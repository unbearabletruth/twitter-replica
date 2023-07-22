import '../assets/styles/Profile.css'
import { db, updateFollow } from '../firebase/connection';
import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { query, collection, onSnapshot, orderBy, where, and } from 'firebase/firestore';
import TweetCard from './TweetCard';
import calendar from '../assets/images/calendar.svg'
import location from '../assets/images/location.svg'
import ProfileEdit from './ProfileEdit';

function Profile({userState}){
  const {id} = useParams();
  const [userProfile, setUserProfile] = useState()
  const [tweets, setTweets] = useState([])
  const [retweets, setRetweets] = useState([])
  const [likes, setLikes] = useState([])
  const [tab, setTab] = useState()
  const [selected, setSelected] = useState()
  const [editPopup, setEditPopup] = useState(false)

  useEffect(() => {
    setTab(tweets)
    setSelected('tweetsTab')
  }, [tweets])

  useEffect(() => {
    const q = query(collection(db, "users"), where("profileName", "==", id));
    async function getUser(){
      onSnapshot(q, (snapshot) => {
          snapshot.forEach(doc => {
              let newUser = doc.data()
              setUserProfile(newUser)
          })
      });
    }
    getUser()
  }, [id])

  useEffect(() => {
    if (userProfile){
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
          setRetweets(newTweets)
        });
      }
      getRetweets(db);
    }
  }, [userProfile])

  useEffect(() => {
    if (userProfile){
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
          setTweets(newTweets)
        });
      }
      getTweets(db);
    }
  }, [userProfile])

  useEffect(() => {
    if (userProfile){
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
          setLikes(newTweets)
        });
      }
      getLikes(db);
    }
  }, [userProfile])

  const addFollow = () => {
    updateFollow(db, userState, userProfile)
  }

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

  const handleEditPopup = () => {
    setEditPopup(!editPopup)
  }

  const convertJoined = (timestamp) => {
    let date = new Date(timestamp * 1000);
    let stringDate = date.toLocaleString(undefined, {
      month: "long",
      year: "numeric",
    });
    return stringDate
  }

  return(
    <>
      {editPopup ?
        <ProfileEdit 
          userState={userState} 
          handleEditPopup={handleEditPopup}
          userProfile={userProfile}
        />
        :
        null
      }
      {userProfile ?
        <>
          <div className="profileBackground"></div>
          <div className="profileHeader">
            <div className="profilePictureAndFollow">
              <img src={userProfile.profilePic} className='profilePictureBig'></img>
              {userState ?
                <>
                  {userProfile.profileName === userState.profileName ?
                    <button onClick={handleEditPopup} className='editProfileButton'>Edit profile</button>
                    :
                    <>
                      {userProfile.followers.includes(userState.profileName) ?
                        <button onClick={addFollow} className='unfollowButton'>Unfollow</button>
                      :
                        <button onClick={addFollow} className='followButton'>Follow</button>
                      }
                    </>
                  }
                </>
                :
                null
              }
            </div>
            <div className='profileNameBlock'>
              <p className='profileRealName'>{userProfile.realName}</p>
              <p className='profileName'>@{userProfile.profileName}</p>
            </div>
            {userProfile.bio ?
              <div className='profileBio'>
                {userProfile.bio}
              </div>
              :
              null
            }
            <div className='profileExtraInfo'>
              {userProfile.location ?
                <div className='profileExtraSubBlock'>
                  <img src={location} alt='icon' className='profileExtraInfoIcon'></img>
                  {userProfile.location}
                </div>
                :
                null
              }
              <div className='profileExtraSubBlock'>
                <img src={calendar} alt='icon' className='profileExtraInfoIcon'></img>
                Joined {convertJoined(userProfile.joined.seconds)}
              </div>
            </div>
            <div className='followBlock'>
              <Link to={`/profile/${userProfile.profileName}/follow`} state={userProfile}>
                <p className='followAmountP'>
                  <span className='followAmount'>{userProfile.following.length}</span>
                  <span className='followText'>Following</span>
                </p>
              </Link>
              <Link to={`/profile/${userProfile.profileName}/follow`} state={userProfile}>
                <p className='followAmountP'>
                  <span className='followAmount'>{userProfile.followers.length}</span>
                  <span className='followText'>Followers</span>
                </p>
              </Link>
            </div>
          </div>
        </>
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
