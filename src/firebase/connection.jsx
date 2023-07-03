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
    getDoc
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

async function createUser(email, password){
  console.log(email)
  createUserWithEmailAndPassword(getAuth(app), email, password)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    // ..
  });
}

async function signIn(email, password){
  const res = await signInWithEmailAndPassword(getAuth(), email, password)
  const q = query(collection(db, "users"), where("uid", "==", res.user.uid));
  const docs = await getDocs(q);
  if (docs.docs.length === 0){
    await setDoc(doc(db, "users", res.user.uid), {
      profilePic: avatarPlaceholder,
      realName: 'Greg',
      profileName: `Greg_${uniqid()}`,
      joined: serverTimestamp(),
      uid: res.user.uid
    });
  }
}


async function signInWithGoogle() {
  let provider = new GoogleAuthProvider();
  const res = await signInWithRedirect(getAuth(), provider);
  const q = query(collection(db, "users"), where("uid", "==", res.user.uid));
  const docs = await getDocs(q);
  if (docs.docs.length === 0){
    await setDoc(doc(db, "users", res.user.displayName), {
      profilePic: getProfilePicUrl(),
      realName: getUserName(),
      profileName: `${getUserName()}_${uniqid()}`,
      joined: serverTimestamp(),
      uid: res.user.uid
    });
  }
}

function signOutUser() {
  signOut(getAuth());
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

async function saveTweet(db, text, id, userState){
    await setDoc(doc(db, "tweets", id), {
      profilePic: userState.profilePic,
      author: userState.realName,
      profileName: userState.profileName,
      text: text,
      id: id,
      timestamp: serverTimestamp(),
      parent: null
    });
}

async function saveTweetWithImage(db, file, text, id, userState) {
  try {
    await setDoc(doc(db, 'tweets', id), {
      profilePic: userState.profilePic,
      author: userState.realName,
      profileName: userState.profileName,
      text: text,
      id: id,
      timestamp: serverTimestamp(),
      parent: null
    });

    const filePath = `${file.name}`;
    const newImageRef = ref(getStorage(), filePath);
    const fileSnapshot = await uploadBytesResumable(newImageRef, file);
    const publicImageUrl = await getDownloadURL(newImageRef);
    
    const mesRef = doc(db, "tweets", id)
    await updateDoc(mesRef,{
      imageUrl: publicImageUrl,
      storageUri: fileSnapshot.metadata.fullPath
    });
  } catch (error) {
    console.error('There was an error uploading a file to Cloud Storage:', error);
  }
}

async function saveComment(db, text, userState, id, parentId){
  await setDoc(doc(db, 'tweets', id), {
    profilePic: userState.profilePic,
    author: userState.realName,
    profileName: userState.profileName,
    text: text,
    id: id,
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

/*async function getTweets(db) {
    const getTweets = query(collection(db, 'tweets'), orderBy("timestamp", "desc"));
    const tweetsSnapshot = await getDocs(getTweets);
    const tweets = tweetsSnapshot.docs.map(doc => doc.data())
    console.log(tweets)
    return tweets;
}*/




  
export {db, saveTweet, saveTweetWithImage, saveComment,
signInWithGoogle, signOutUser, getProfilePicUrl, getUserName, isUserSignedIn, getCurrentUser, getUserInfo,
updateLikes, updateRetweets, updateComments, createUser, signIn}