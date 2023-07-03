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
  const [selected, setSelected] = useState()

  useEffect(() => {
    setTab(tweets)
    setSelected('tweetsTab')
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
      const getTweets = query(collection(db, 'tweets'), 
        where("retweetedBy", "array-contains", userProfile.profileName ), 
        orderBy("timestamp", "desc"));
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
      const getTweets = query(collection(db, 'tweets'), 
        and(where("profileName", "==", userProfile.profileName ),
          where("parent", "==", null)), orderBy("timestamp", "desc"));
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
      const getTweets = query(collection(db, 'tweets'), 
        where("likedBy", "array-contains", userProfile.profileName ), 
        orderBy("timestamp", "desc"));
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

  const handleSelected = (e) => {
    if (e.target.textContent === "Tweets"){
      setTab(tweets)
    } else if (e.target.textContent === "Retweets"){
      setTab(retweets)
    } else if (e.target.textContent === "Likes"){
      setTab(likes)
    }
    setSelected(e.currentTarget.id)
  }

  const convertJoined = (timestamp) => {
    let date = new Date(timestamp * 1000);
    let stringDate = date.toLocaleString(undefined, {
      month: "long",
      year: "numeric",
    });
    return stringDate
  }

  console.log(tab, selected)
  return(
    <>
      {userProfile ?
        <div className="profileHeader">
          <div className="profileBackground"></div>
          <div className="profilePictureAndFollow">
            <img src={userProfile.profilePic} className='profilePictureBig'></img>
            <button>Edit profile</button>
          </div>
          <div className='profileNameBlock'>
            <p className='profileRealName'>{userProfile.realName}</p>
            <p className='profileName'>@{userProfile.profileName}</p>
          </div>
          <div className='profileJoined'>Joined {convertJoined(userProfile.joined.seconds)}</div>
          <div>followers</div>
        </div>
        :
        null
      }
      <div className='profileTabs'>
        <button 
          className={`tabButton ${selected === 'tweetsTab' ? 'active' : ''}`}
          id='tweetsTab' 
          onClick={handleSelected}
        >
          Tweets
        </button>
        <button 
          className={`tabButton ${selected === 'retweetsTab' ? 'active' : ''}`}
          id='retweetsTab' 
          onClick={handleSelected}
        >
          Retweets
        </button>
        <button 
          className={`tabButton ${selected === 'likesTab' ? 'active' : ''}`}
          id='likesTab' 
          onClick={handleSelected}
        >
          Likes
        </button>
      </div>
      {tab ? 
        <TweetCard tweets={tab} userState={userState}/>
        : null
      }
    </>
  )
}

export default Profile;
