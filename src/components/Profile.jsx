import '../assets/styles/Profile.css'
import { db, getUserInfo, updateFollow, updateProfileInfo } from '../firebase/connection';
import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { query, collection, onSnapshot, orderBy, where, and } from 'firebase/firestore';
import TweetCard from './TweetCard';
import { useLocation } from "react-router-dom";
import calendar from '../assets/images/calendar.svg'
import location from '../assets/images/location.svg'
import closeIcon from '../assets/images/close-icon.svg'

function Profile({userState}){
  const {id} = useParams();
  const [userProfile, setUserProfile] = useState()
  const [tweets, setTweets] = useState([])
  const [retweets, setRetweets] = useState([])
  const [likes, setLikes] = useState([])
  const [tab, setTab] = useState()
  const [selected, setSelected] = useState()
  const [editPopup, setEditPopup] = useState(false)
  const [profileInfo, setProfileInfo] = useState({
    bio: '',
    location: ''
  })

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
    /*async function getUser(){
      const userPromise = getUserInfo(db, id);
      const user = await userPromise;
      setUserProfile(user[0])
    }*/
    
    getUser()
  }, [id])

  useEffect(() => {
    if (userProfile){
      setProfileInfo({
        bio: userProfile.bio,
        location: userProfile.location
      })
    }
  }, [userProfile])

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
        setRetweets(newTweets)
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
        setTweets(newTweets)
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
        setLikes(newTweets)
      });
    }
    getLikes(db);
  }, [userProfile])

  const addFollow = () => {
    updateFollow(db, userState, userProfile)
  }

  const handleEditChange = (e) => {
    setProfileInfo({
      ...profileInfo,
      [e.target.name] : e.target.value
    })
  }

  const onEditSubmit = (e) => {
    e.preventDefault()
    updateProfileInfo(db, userState.uid, profileInfo)
    handleEditPopup()
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
  console.log(profileInfo)
  return(
    <>
      {editPopup ?
        <div id='editPopupWrapper'>
          <button onClick={handleEditPopup} className="closePopup">
            <img src={closeIcon} alt="x" className="closeIcon"></img>
          </button>
          <div id='editPopupHeader'>
            <p id='editPopupTitle'>Edit profile</p>
            <button id='editPopupSave' form='editProfileForm' type='submit'>Save</button>
          </div>
          <form id='editProfileForm' onSubmit={onEditSubmit}>
              <textarea 
                id='editPopupTextArea' 
                onChange={handleEditChange} 
                placeholder='Bio'
                name='bio'
                value={profileInfo.bio}
              >
              </textarea>
              <input
                className='editPopupInput' 
                onChange={handleEditChange} 
                placeholder='Location'
                name='location'
                value={profileInfo.location}
              >
              </input>
          </form>
        </div>
        :
        null
      }
      {userProfile ?
        <div className="profileHeader">
          <div className="profileBackground"></div>
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

function FollowPage({userState}){
  const location = useLocation();
  const user = location.state;

  const [followers, setFollowers] = useState()
  const [followees, setFollowees] = useState()
  const [tab, setTab] = useState()
  const [selected, setSelected] = useState()

  useEffect(() => {
    setTab(followers)
    setSelected('followersTab')
  }, [followers])

  useEffect(() => {
    async function getFollowers(db) {
      const q = query(collection(db, 'users'), 
        where("following", "array-contains", user.profileName ));
      onSnapshot(q, (snapshot) => {
        let followers = [];
          snapshot.forEach(doc => {
              let follower = doc.data()
              followers.push(follower)
          })
        setFollowers(followers)
      });
    }
    getFollowers(db);
  }, [user])

  useEffect(() => {
    async function getFollowees(db) {
      const q = query(collection(db, 'users'), 
        where("followers", "array-contains", user.profileName ));
      onSnapshot(q, (snapshot) => {
        let followees = [];
          snapshot.forEach(doc => {
              let followee = doc.data()
              followees.push(followee)
          })
        setFollowees(followees)
      });
    }
    getFollowees(db);
  }, [user])

  const handleSelected = (e) => {
    if (e.target.textContent === "Followers"){
      setTab(followers)
    } else if (e.target.textContent === "Following"){
      setTab(followees)
    }
    setSelected(e.currentTarget.id)
  }

  const addFollow = (e, person) => {
    e.preventDefault();
    updateFollow(db, userState, person)
  }
  
  return(
    <>
      <div className='followTabs'>
        <button 
          className={`tabFollowButton ${selected === 'followersTab' ? 'active' : ''}`}
          id='followersTab' 
          onClick={handleSelected}
        >
          Followers
        </button>
        <button 
          className={`tabFollowButton ${selected === 'followingTab' ? 'active' : ''}`}
          id='followingTab' 
          onClick={handleSelected}
        >
          Following
        </button>
      </div>
    {tab ? 
      <>
      {tab.map(person => {
        return(
          <Link to={`/profile/${person.profileName}`} key={person.uid}>
            <div className='followerCard'>
              <div className='followerInfo'>
                <img src={person.profilePic} alt='pic' className='followerProfilePic'></img>
                <div className='followerNames'>
                  <p className='followerName'>{person.realName}</p>
                  <p className='followerProfileName'>{person.profileName}</p>
                </div>
              </div>
              {userState ?
                <>
                  {person.followers.includes(userState.profileName) ?
                    <button onClick={(e) => addFollow(e, person)} className='unfollowButton'>Unfollow</button>
                  :
                    <button onClick={(e) => addFollow(e, person)} className='followButton'>Follow</button>
                  }
                </>
                :
                null
              }
            </div>
          </Link>
        )
      })}
      </>
      :
      null
    }
    </>
  )
}

export {Profile, FollowPage};
