import '../assets/styles/Content.css'
import { Routes, Route } from "react-router-dom";
import Home from './Home';
import Explore from './Expole';
import Notifications from './Notifications';
import Messages from './Messages';
import Lists from './Lists';
import Bookmarks from './Bookmarks';
import Verified from './Verified';
import {Profile, FollowPage} from './Profile';
import Login from './Login';
import Tweet from './Tweet';
import { useState, useEffect } from 'react';
import { db } from '../firebase/connection';
import { query, collection, onSnapshot, orderBy, where } from 'firebase/firestore';

function Content({userState}){
  const [tweets, setTweets] = useState([])

  useEffect(() => {
    async function getLastTweet(db) {
      const getTweets = query(collection(db, 'tweets'), 
        where("parent", "==", null), orderBy("timestamp", "desc"));
      
      onSnapshot(getTweets, (snapshot) => {
        let newTweets = [];
          snapshot.forEach(doc => {
              let newPost = doc.data()
              newTweets.push(newPost)
              
          })
        setTweets(tweets.concat(newTweets))
      });
    }
    getLastTweet(db);
  }, [])
console.log(tweets)
    return(
      <div id='content'>
        <div id="mainContent">
          <Routes>
            <Route path="/home" element={<Home tweets={tweets} userState={userState}/>} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/lists" element={<Lists />} />
            <Route path="/bookmarks" element={<Bookmarks />} />
            <Route path="/verified" element={<Verified />} />
            <Route path="/profile/:id" element={<Profile userState={userState}/>} />
            <Route path="/profile/:id/follow" element={<FollowPage />} />
            <Route path="/tweet/:id" element={<Tweet tweets={tweets} userState={userState}/>} />
          </Routes>
        </div>
        <div id='sideContent'>
          <input type='search' id='search' placeholder='Search Twitter'></input>
          <div id='getVerified'>
            <p>Get Verified</p>
            <p>Subscribe to unlock new features</p>
            <a>Subscribe</a>
          </div>
          <div id='trends'>
            <p>Trends for you</p>
            <div id='trendsEntry'>
              some text
            </div>
          </div>
        </div>
      </div>
    )
}

export default Content;