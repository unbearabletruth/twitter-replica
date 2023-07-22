import closeIcon from '../assets/images/close-icon.svg'
import addPhoto from '../assets/images/add_photo.png'
import { useState, useEffect } from 'react'
import { db, updateProfile } from '../firebase/connection'

function ProfileEdit({userProfile, handleEditPopup, userState}){
  const [profileInfo, setProfileInfo] = useState({
    bio: '',
    location: '',
    image: null
  })

  useEffect(() => {
    if (userProfile.bio){
      setProfileInfo({
        ...profileInfo,
        bio: userProfile.bio
      })
    }
    if (userProfile.location){
      setProfileInfo({
        ...profileInfo,
        location: userProfile.location
      })
    }
  }, [userProfile])

  const handleEditChange = (e) => {
    setProfileInfo({
      ...profileInfo,
      [e.target.name] : e.target.value
    })
  }

  const onProfileImageChange = (e) => {
    setProfileInfo({
      ...profileInfo,
      image: e.target.files[0]
    })  
  }

  const onEditSubmit = (e) => {
    e.preventDefault()
    updateProfile(db, userState, profileInfo)
    handleEditPopup()
  }

  const onClose = () => {
    setProfileInfo({
      ...profileInfo,
      image: null
    }) 
    handleEditPopup()
  }

  return(
    <div id='popupBackground'>
      <div id='editPopupWrapper'>
        <button onClick={onClose} className="closePopup">
          <img src={closeIcon} alt="x" className="closeIcon"></img>
        </button>
        <div id='editPopupHeader'>
          <p id='editPopupTitle'>Edit profile</p>
          <button id='editPopupSave' form='editProfileForm' type='submit'>Save</button>
        </div>
        <form id='editProfileForm' onSubmit={onEditSubmit}>
          <div className='changeProfilePicture'>
            <img 
              src={profileInfo.image ? URL.createObjectURL(profileInfo.image) : userProfile.profilePic}
              alt="imgUL" 
              className='uploadProfileImage'
            >
            </img>
            <label>
              <div className='addImageWrapper'>
                <input type="file" id='uploadInput' onChange={onProfileImageChange}></input>
                <img src={addPhoto} alt='add' className='uploadImageAdd'></img>
              </div>
            </label>
          </div>
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
    </div>
  )
}

export default ProfileEdit;