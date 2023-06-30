import '../assets/styles/Profile.css'
import { db, getUserInfo } from '../firebase/connection';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { query, collection, onSnapshot, orderBy, where, and, or } from 'firebase/firestore';
import TweetCard from './TweetCard';

function Profile({userState}){
  const {id} = useParams();
  const [userProfile, setUserProfile] = useState()
  const [tweets, setTweets] = useState([])
  const [retweets, setRetweets] = useState([])
  const [likes, setLikes] = useState([])
  const [tab, setTab] = useState()

  useEffect(() => {
    setTab(tweets)
  }, [tweets])

  useEffect(() => {
    async function getUser(){
      const userPromise = getUserInfo(db, id);
      const user = await userPromise;
      setUserProfile(user[0])
    }
    getUser()
  }, [id])

  useEffect(() => {
    async function getRetweets(db) {
      const getTweets = query(collection(db, 'tweets'), where("retweetedBy", "array-contains", userProfile.profileName ));
      onSnapshot(getTweets, (snapshot) => {
        let newTweets = [];
          snapshot.forEach(doc => {
              let newPost = doc.data()
              newTweets.push(newPost)
          })
        setRetweets(retweets.concat(newTweets))
      });
    }
    getRetweets(db);
  }, [userProfile])

  useEffect(() => {
    async function getTweets(db) {
      const getTweets = query(collection(db, 'tweets'), where("profileName", "==", userProfile.profileName ), orderBy("timestamp", "desc"));
      onSnapshot(getTweets, (snapshot) => {
        let newTweets = [];
          snapshot.forEach(doc => {
              let newPost = doc.data()
              newTweets.push(newPost)
          })
        setTweets(tweets.concat(newTweets))
      });
    }
    getTweets(db);
  }, [userProfile])

  useEffect(() => {
    async function getLikes(db) {
      const getTweets = query(collection(db, 'tweets'), where("likedBy", "array-contains", userProfile.profileName ));
      onSnapshot(getTweets, (snapshot) => {
        let newTweets = [];
          snapshot.forEach(doc => {
              let newPost = doc.data()
              newTweets.push(newPost)
          })
        setLikes(likes.concat(newTweets))
      });
    }
    getLikes(db);
  }, [userProfile])

  const retweetsTab = () => {
    setTab(retweets)
  }

  const tweetsTab = () => {
    setTab(tweets)
  }

  const likesTab = () => {
    setTab(likes)
  }

  const convertJoined = (timestamp) => {
    let date = new Date(timestamp * 1000);
    let stringDate = date.toLocaleString(undefined, {
      month: "short",
      year: "numeric",
    });
    return stringDate
  }

  console.log(retweets)
  console.log(tweets)
  console.log(likes)
  return(
    <>
      {userProfile ?
        <div className="profileHeader">
          <div className="profileBackground"></div>
          <div className="profilePictureAndFollow">
            <img src={userProfile.profilePic} className='profilePictureBig'></img>
            <button>Edit profile</button>
          </div>
          <p>{userProfile.realName}</p>
          <p>{userProfile.profileName}</p>
          <p>bio</p>
          <div>Joined {convertJoined(userProfile.joined.seconds)}</div>
          <div>followers</div>
        </div>
        :
        null
      }
      <div className='profileTabs'>
        <button onClick={tweetsTab}>tweets</button>
        <button onClick={retweetsTab}>retweets</button>
        <button onClick={likesTab}>likes</button>
      </div>
      {tab ? 
        <TweetCard tweets={tab} userState={userState}/>
        : null
      }
    </>
  )
}

export default Profile;

//tab selection shows proper tweets array