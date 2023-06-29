import '../assets/styles/Profile.css'
import { db, getUserInfo } from '../firebase/connection';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { query, collection, onSnapshot, orderBy, where } from 'firebase/firestore';
import TweetCard from './TweetCard';

function Profile({userState}){
  const {id} = useParams();
  const [userProfile, setUserProfile] = useState()
  const [retweets, setRetweets] = useState([])

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
      const getTweets = query(collection(db, 'tweets'), where("retweetedBy", "array-contains", userState.profileName ));
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

  const convertJoined = (timestamp) => {
    let date = new Date(timestamp * 1000);
    let stringDate = date.toLocaleString(undefined, {
      month: "short",
      year: "numeric",
    });
    return stringDate
  }

  console.log(retweets)
  
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
      {retweets ? 
        <TweetCard tweets={retweets} />
        : null
      }
    </>
  )
}

export default Profile;