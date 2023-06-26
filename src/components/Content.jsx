import '../assets/styles/Main.css'
import { Routes, Route } from "react-router-dom";
import Home from './Home';
import Explore from './Expole';
import Notifications from './Notifications';
import Messages from './Messages';
import Lists from './Lists';
import Bookmarks from './Bookmarks';
import Verified from './Verified';
import Profile from './Profile';
import Login from './Login';
import Tweet from './Tweet';
import { useState, useEffect } from 'react';
import { getTweets, db } from '../firebase/connection';

function Content(){
  const [tweets, setTweets] = useState([])

  useEffect(() => {
    async function readTweets(){
      const tweetsPromise = getTweets(db);
      const tweetsArray = await tweetsPromise;
      setTweets(tweets.concat(tweetsArray))
    }
    readTweets()
  }, [])

    return(
      <div id='content'>
        <div id="mainContent">
          <Routes>
            <Route path="/" element={<Home tweets={tweets}/>} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/lists" element={<Lists />} />
            <Route path="/bookmarks" element={<Bookmarks />} />
            <Route path="/verified" element={<Verified />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/login" element={<Login />} />
            <Route path="/tweet/:id" element={<Tweet tweets={tweets}/>} />
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