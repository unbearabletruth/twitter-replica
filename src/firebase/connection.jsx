import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  signInWithRedirect,
  getAdditionalUserInfo
} from 'firebase/auth';
import {
    getFirestore,
    collection,
    doc,
    setDoc,
    addDoc,
    updateDoc,
    getDocs,
    query,
    serverTimestamp,
    where,
    increment,
    arrayUnion,
    arrayRemove,
    getDoc,
  } from 'firebase/firestore';
import {
    getStorage,
    ref,
    uploadBytesResumable,
    getDownloadURL,
  } from 'firebase/storage';
import uniqid from "uniqid";
import avatarPlaceholder from '../assets/images/man-line-icon.svg'

const firebaseConfig = {
  apiKey: "AIzaSyCvJ-2uriYsQG8Qd5p4AfEVTrHHzn_EYTc",
  authDomain: "twitter-replica-b31da.firebaseapp.com",
  projectId: "twitter-replica-b31da",
  storageBucket: "twitter-replica-b31da.appspot.com",
  messagingSenderId: "707555425194",
  appId: "1:707555425194:web:25629f1ef304e33753c9d3"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app)

async function createUser(data){
  const res = await createUserWithEmailAndPassword(auth, data.email, data.password)
  await setDoc(doc(db, "users", res.user.uid), {
    realName: data.name,
    profileName: `${data.name}_${uniqid()}`,
    joined: serverTimestamp(),
    uid: res.user.uid,
    followers: [],
    following: []
  });
  const publicImageUrl = await getDownloadURL(ref(getStorage(), 'man-line-icon.svg'));

  const mesRef = doc(db, "users", res.user.uid)
    await updateDoc(mesRef,{
      profilePic: publicImageUrl,
    });
}

async function signIn(data){
  signInWithEmailAndPassword(auth, data.email, data.password)
}


async function signInWithGoogle() {
  let provider = new GoogleAuthProvider();
  const res = await signInWithPopup(auth, provider);
  const { isNewUser } = getAdditionalUserInfo(res)   
  if (isNewUser){
    await setDoc(doc(db, "users", res.user.uid), {
      profilePic: getProfilePicUrl(),
      realName: getUserName(),
      profileName: `${getUserName()}_${uniqid()}`,
      joined: serverTimestamp(),
      uid: res.user.uid,
      followers: [],
      following: []
    });
  }
}

function signOutUser() {
  signOut(auth);
}

function getProfilePicUrl() {
  return getAuth().currentUser.photoURL || '/images/profile_placeholder.png';
}

function getUserName() {
  return getAuth().currentUser.displayName;
}

function isUserSignedIn() {
  return !!getAuth().currentUser;
}

async function getCurrentUser(db, id) {
  const getUser = query(collection(db, "users"), where("uid", "==", id));
  const userSnapshot = await getDocs(getUser);
  const user = userSnapshot.docs.map(doc => doc.data())
  return user
}

async function getUserInfo(db, profileName) {
  const getUser = query(collection(db, "users"), where("profileName", "==", profileName));
  const userSnapshot = await getDocs(getUser);
  const user = userSnapshot.docs.map(doc => doc.data())
  return user
}

async function saveTweet(db, tweet, userState){
    await setDoc(doc(db, "tweets", tweet.id), {
      profilePic: userState.profilePic,
      author: userState.realName,
      profileName: userState.profileName,
      text: tweet.text,
      id: tweet.id,
      timestamp: serverTimestamp(),
      parent: null
    });
}

async function saveTweetWithImage(db, tweet, userState) {
  try {
    await setDoc(doc(db, 'tweets', tweet.id), {
      profilePic: userState.profilePic,
      author: userState.realName,
      profileName: userState.profileName,
      text: tweet.text,
      id: tweet.id,
      timestamp: serverTimestamp(),
      parent: null
    });

    const filePath = `tweets media/${tweet.media.name}`;
    const newMediaRef = ref(getStorage(), filePath);
    const fileSnapshot = await uploadBytesResumable(newMediaRef, tweet.media);
    const publicMediaUrl = await getDownloadURL(newMediaRef);
    
    const mesRef = doc(db, "tweets", tweet.id)
    await updateDoc(mesRef,{
      mediaUrl: publicMediaUrl,
      storageUri: fileSnapshot.metadata.fullPath
    });
  } catch (error) {
    console.error('There was an error uploading a file to Cloud Storage:', error);
  }
}

async function saveComment(db, comment, userState, parentId){
  await setDoc(doc(db, 'tweets', comment.id), {
    profilePic: userState.profilePic,
    author: userState.realName,
    profileName: userState.profileName,
    text: comment.text,
    id: comment.id,
    timestamp: serverTimestamp(),
    parent: parentId
  });
}

async function updateLikes(db, id, profileName){
  const tweetRef = doc(db, "tweets", id);
  const tweetSnap = await getDoc(tweetRef);
  const tweetData = tweetSnap.data();
  if (tweetData.likedBy && tweetData.likedBy.includes(profileName)){
    await updateDoc(tweetRef, {
      likes: increment(-1),
      likedBy: arrayRemove(profileName)
    });
  } else{
    await updateDoc(tweetRef, {
      likes: increment(1),
      likedBy: arrayUnion(profileName)
    });
  }
}

async function updateRetweets(db, id, profileName){
  const tweetRef = doc(db, "tweets", id);
  const tweetSnap = await getDoc(tweetRef);
  const tweetData = tweetSnap.data();
  if (tweetData.retweetedBy && tweetData.retweetedBy.includes(profileName)){
    await updateDoc(tweetRef, {
      retweets: increment(-1),
      retweetedBy: arrayRemove(profileName)
    });
  } else{
    await updateDoc(tweetRef, {
      retweets: increment(1),
      retweetedBy: arrayUnion(profileName)
    });
  }
}

async function updateComments(db, commentId, id){
  const tweetRef = doc(db, "tweets", id);
  await updateDoc(tweetRef, {
    comments: increment(1),
    commentsIds: arrayUnion(commentId)
  });
}

async function updateFollow(db, follower, followee){
  const followerRef = doc(db, "users", follower.uid);
  const followerSnap = await getDoc(followerRef);
  const followerData = followerSnap.data();

  const followeeRef = doc(db, "users", followee.uid);

  if (followerData.following && followerData.following.includes(followee.profileName)){
    await updateDoc(followerRef, {
      following: arrayRemove(followee.profileName)
    })
    await updateDoc(followeeRef, {
      followers: arrayRemove(follower.profileName)
    })
  } else{
    await updateDoc(followerRef, {
      following: arrayUnion(followee.profileName)
    })
    await updateDoc(followeeRef, {
      followers: arrayUnion(follower.profileName)
    })
  }
}

async function updateProfile(db, user, profileInfo){
  const userRef = doc(db, 'users', user.uid);
  if (profileInfo.bio !== undefined){
    console.log('empty')
    await updateDoc(userRef, {
      bio: profileInfo.bio,
    })
  }
  if (profileInfo.location !== undefined){
    await updateDoc(userRef, {
      location: profileInfo.location
    })
  }
  if (profileInfo.image){
    const filePath = `profile pictures${profileInfo.image.name}`;
    const newImageRef = ref(getStorage(), filePath);
    await uploadBytesResumable(newImageRef, profileInfo.image);
    const publicImageUrl = await getDownloadURL(newImageRef);
    await updateDoc(userRef, {
      profilePic: publicImageUrl
    })
    //update in tweets
    const q = query(collection(db, 'tweets'), where("profileName", "==", user.profileName))
    const tweetsSnapshot = await getDocs(q);
    tweetsSnapshot.docs.map(doc => updateDoc(doc.ref, {profilePic: publicImageUrl}))
  }
}


export {db, auth, saveTweet, saveTweetWithImage, saveComment, signInWithGoogle,
signOutUser, getProfilePicUrl, getUserName, isUserSignedIn, getCurrentUser, 
getUserInfo, updateLikes, updateRetweets, updateComments, createUser, signIn,
updateFollow, updateProfile}