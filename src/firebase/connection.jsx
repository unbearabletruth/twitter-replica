import { initializeApp } from "firebase/app";
import {
  getAuth,
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
    orderBy,
    onSnapshot
  } from 'firebase/firestore';
import {
    getStorage,
    ref,
    uploadBytesResumable,
    getDownloadURL,
  } from 'firebase/storage';

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

async function signIn() {
  let provider = new GoogleAuthProvider();
  await signInWithRedirect(getAuth(), provider);
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

async function saveTweet(db, text, id){
    await setDoc(doc(db, "tweets", id), {
      profilePic: getProfilePicUrl(),
      author: getUserName(),
      text: text,
      id: id,
      timestamp: serverTimestamp()
    });
}

/*async function getTweets(db) {
    const getTweets = query(collection(db, 'tweets'), orderBy("timestamp", "desc"));
    const tweetsSnapshot = await getDocs(getTweets);
    const tweets = tweetsSnapshot.docs.map(doc => doc.data())
    console.log(tweets)
    return tweets;
}*/

async function saveTweetWithImage(file, text, id) {
    try {
      const messageRef = await addDoc(collection(getFirestore(), 'tweets'), {
        profilePic: getProfilePicUrl(),
        author: getUserName(),
        text: text,
        id: id,
        timestamp: serverTimestamp()
      });

      const filePath = `${file.name}`;
      const newImageRef = ref(getStorage(), filePath);
      const fileSnapshot = await uploadBytesResumable(newImageRef, file);
      
      const publicImageUrl = await getDownloadURL(newImageRef);
  
      await updateDoc(messageRef,{
        imageUrl: publicImageUrl,
        storageUri: fileSnapshot.metadata.fullPath
      });
    } catch (error) {
      console.error('There was an error uploading a file to Cloud Storage:', error);
    }
}

async function saveComment(db, text, id, tweetId){
  await setDoc(doc(db, tweetId, id), {
    profilePic: getProfilePicUrl(),
    author: getUserName(),
    text: text,
    id: id,
    timestamp: serverTimestamp()
  });
}
  
export {db, saveTweet, saveTweetWithImage, saveComment,
signIn, signOutUser, getProfilePicUrl, getUserName, isUserSignedIn, }