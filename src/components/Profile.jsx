import '../assets/styles/Profile.css'
import { getUserName, getProfilePicUrl, db, getUserInfo } from '../firebase/connection';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

function Profile({userState}){
  const {id} = useParams();
  const [userProfile, setUserProfile] = useState()

  useEffect(() => {
    async function getUser(){
      const userPromise = getUserInfo(db, id);
      const user = await userPromise;
      console.log(user)
      setUserProfile(user[0])
    }
    getUser()
  }, [id])
  
  return(
    userProfile ?
    <div className="profileHeader">
      <div className="profileBackground"></div>
      <div className="profilePictureAndFollow">
        <img src={userProfile.profilePic} className='profilePictureBig'></img>
        <button>Edit profile</button>
      </div>
      <p>{userProfile.realName}</p>
      <p>{userProfile.profileName}</p>
      <p>bio</p>
      <div>joined</div>
      <div>followers</div>

    </div>
    :
    null
  )
}

export default Profile;