import '../assets/styles/WhoToFollow.css'
import { useState, useEffect } from 'react'
import { db, updateFollow } from '../firebase/connection'
import { query, collection, onSnapshot, limit } from 'firebase/firestore';
import { Link } from 'react-router-dom';

function WhoToFollow({userState}){
  const [toFollow, setToFollow] = useState([])

  useEffect(() => {
    async function getNotFollowing(db) {
      const getUsers = query(collection(db, 'users'), limit(3))
      onSnapshot(getUsers, (snapshot) => {
        let users = [];
          snapshot.forEach(doc => {
              let user = doc.data()
              if (!(userState.following && 
              (userState.following.includes(user.profileName) ||
              user.uid === userState.uid))){
                users.push(user)
              }
          })
        setToFollow(users)
      });
    }
    if (userState){
      getNotFollowing(db);
    }
  }, [userState])

  const addFollow = (e, user) => {
    e.preventDefault()
    updateFollow(db, userState, user)
  }

  return(
    toFollow && toFollow.length !== 0 ? 
    <div id='wtfWrapper'>
      <p id='wtfTitle'>Who to follow</p>
      {toFollow.map(user => {
        return(
          <Link to={`/profile/${user.profileName}`} key={user.uid}>
            <div className='wtfUser'>
              <div className='wtfUserInfoBlock'>
                <img className='wtfProfilePicture' src={user.profilePic}></img>
                <div className='wtfNamesBlock'>
                  <span className='wtfRealName'>{user.realName}</span>
                  <span className='wtfProfileName'>{user.profileName}</span>
                </div>
              </div>
              <button 
                className='wtfFollowButton' 
                onClick={(e) => addFollow(e, user)}
              >
                Follow
              </button>
            </div>
          </Link>
        )
      })
      }
    </div>
    :
    null
  )
}

export default WhoToFollow;