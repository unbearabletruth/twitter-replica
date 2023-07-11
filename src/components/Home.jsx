import '../assets/styles/Home.css'
import TweetCard from './TweetCard';
import Compose from './Compose';
import { useState, useEffect } from 'react';
import { db } from '../firebase/connection';
import { query, collection, onSnapshot, orderBy, where, and } from 'firebase/firestore';


function Home({userState}){
  const [allTweets, setAllTweets] = useState([])
  const [followTweets, setFollowTweets] = useState([])
  const [tab, setTab] = useState()
  const [selected, setSelected] = useState()

  useEffect(() => {
    setTab(allTweets)
    setSelected('allTweets')
  }, [allTweets])

  useEffect(() => {
    async function getAllTweets(db) {
      const getTweets = query(collection(db, 'tweets'), 
        where("parent", "==", null), orderBy("timestamp", "desc"));
      onSnapshot(getTweets, (snapshot) => {
        let tweets = [];
          snapshot.forEach(doc => {
              let tweet = doc.data()
              tweets.push(tweet)
              
          })
        setAllTweets(tweets)
      });
    }
    getAllTweets(db);
  }, [])

  useEffect(() => {
    if (userState && userState.following.length !== 0){
      async function getFollowTweets(db) {
        const getTweets = query(collection(db, 'tweets'), 
          and(where("profileName", "in", userState.following),
              where("parent", "==", null)), orderBy("timestamp", "desc"));
        onSnapshot(getTweets, (snapshot) => {
          let tweets = [];
            snapshot.forEach(doc => {
                let tweet = doc.data()
                tweets.push(tweet)
                
            })
          setFollowTweets(tweets)
        });
      }
      getFollowTweets(db);
    }
  }, [userState])
  
  const handleSelected = (e) => {
    if (e.target.textContent === "All"){
      setTab(allTweets)
    } else if (e.target.textContent === "Following"){
      setTab(followTweets)
    }
    setSelected(e.currentTarget.id)
  }

  return(
    <>
      <div id='homeHeader'>
        <p id='homeTitle'>Home</p>
        <div className='homeTabs'>
          <button 
            className={`homeTabButton ${selected === 'allTweets' ? 'active' : ''}`}
            id='allTweets' 
            onClick={handleSelected}
          >
            All
          </button>
          <button 
            className={`homeTabButton ${selected === 'followTweets' ? 'active' : ''}`}
            id='followTweets' 
            onClick={handleSelected}
          >
            Following
          </button>
        </div>
      </div>
      {userState ?
        <Compose userState={userState} where={'home'}/>
        :
        null
      }
      {tab ? 
        <TweetCard tweets={tab} userState={userState}/>
        : null
      }
    </>
  )
}

export default Home;