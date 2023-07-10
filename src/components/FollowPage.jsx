import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { db } from "../firebase/connection";
import { query, collection, where, onSnapshot } from "firebase/firestore";
import { Link } from "react-router-dom";

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
              <img src={person.profilePic} alt='pic' className='followerProfilePic'></img>
              <div className='followerFullInfo'>
                <div className='followerInfo'>
                  <div className='followerNames'>
                    <p className='followerName'>{person.realName}</p>
                    <p className='followerProfileName'>{person.profileName}</p>
                  </div>
                  {userState ?
                    <>
                      {person.profileName === userState.profileName ?
                        null
                        :
                        <>
                          {person.followers.includes(userState.profileName) ?
                            <button onClick={(e) => addFollow(e, person)} className='unfollowButton'>Unfollow</button>
                          :
                            <button onClick={(e) => addFollow(e, person)} className='followButton'>Follow</button>
                          }
                        </>
                      }
                    </>
                    :
                    null
                  }
                </div>
                <p className='followerBio'>{person.bio}</p>
              </div>
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

export default FollowPage;