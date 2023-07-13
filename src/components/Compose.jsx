import { saveTweet, saveTweetWithImage } from "../firebase/connection"
import { useState, useEffect, useRef } from 'react';
import uniqid from "uniqid";
import { db } from '../firebase/connection';
import uploadImage from '../assets/images/image-line-icon.svg'

function Compose({userState, where, handleCompose}){
  const isImage = ['gif','jpg','jpeg','png'];
  const isVideo = ['mp4','mov']
  const [wrongFile, setWrongFile] = useState(false)
  const fileInputRef = useRef(null);
  const [tweet, setTweet] = useState({
    text: "",
    image: null,
    id: uniqid(),
  })
  
  const onTextChange = (e) => {
    setTweet({
      ...tweet,
      [e.target.name] : e.target.value
    })
  }

  const onImageChange = (e) => {
    console.log(e.target.files[0])
    if(isImage.some(type => e.target.files[0].type.includes(type)) ||
      isVideo.some(type => e.target.files[0].type.includes(type))){
        setTweet({
          ...tweet,
          image: e.target.files[0]
        }) 
      }
    else{
      fileInputRef.current.value = null
      setWrongFile(true)
    }
  }
  
  const addTweet = (e) => {
    e.preventDefault();
    if (tweet.image !== null){
      saveTweetWithImage(db, tweet.image, tweet.text, tweet.id, userState)
    } else{
      saveTweet(db, tweet.text, tweet.id, userState)
    }
    setTweet({
      ...tweet,
      text: "",
      image: null,
    })
    if (where === 'sidebar'){
        handleCompose();
    }  
  }

  useEffect(() => {
    if (wrongFile === true){
      const timeId = setTimeout(() => {
          setWrongFile(false)
        }, 7000)
    
      return () => {
        clearTimeout(timeId)
      }
    }
  }, [wrongFile]);
  console.log(wrongFile)
  return(
    <>
      {wrongFile ?
        <div id="wrongFileMessage">
          <p className="wrongFileLine">Image: gif, jpg, jpeg, png</p>
          <p className="wrongFileLine">Video: mp4, mov</p>
        </div>
        :
        null
      }
      {where === 'home' ?
        <div id='tweetComposeWrapper'>
          <img src={userState.profilePic} alt='profilePic' id='homeComposeProfilePicture'></img>
          <form onSubmit={addTweet} id='tweetForm'>
            <textarea 
              id="homeCompose" 
              name='text'
              placeholder="What is happening?!"
              value={tweet.text}
              onChange={onTextChange}
            >
            </textarea>
            {tweet.image ? 
              <>
                {isImage.some(type => tweet.image.type.includes(type)) ?
                  <img src={ URL.createObjectURL(tweet.image)} id='homeFormImagePreview'></img>
                  : 
                  <video src={ URL.createObjectURL(tweet.image)} id='homeFormImagePreview' controls></video>
                }
              </>
              :
              null
            }
            <div id="uploadAndTweet">
              <label>
              <input 
                type="file" 
                id='uploadInput'
                onChange={onImageChange} 
                accept='.gif,.jpg,.jpeg,.png,.mp4,.mov'
                ref={fileInputRef}
              >
              </input>
              <div className="uploadImageWrapper">
                <img src={uploadImage} alt="imgUL" className='uploadImage'></img>
              </div>
              </label>
              {tweet.text === "" && tweet.image === null ?
                <button id='composeButtonInactive' type='button'>Tweet</button>
                :
                <button id='composeButton' type='submit'>Tweet</button>
              }
            </div>
          </form>
        </div>
        :
        <div id='tweetComposeWrapperSidebar'>
          <form onSubmit={addTweet} id='tweetFormSidebar'>
            <div id='composeMainContent'>
              <img src={userState.profilePic} alt='profilePic' id='homeComposeProfilePicture'></img>
              <textarea 
                id="homeCompose" 
                name='text'
                placeholder="What is happening?!"
                value={tweet.text}
                onChange={onTextChange}
              >
              </textarea>
            </div>
            {tweet.image ? 
              <>
                {isImage.some(type => tweet.image.type.includes(type)) ?
                  <img src={ URL.createObjectURL(tweet.image)} id='homeFormImagePreview'></img>
                  : isVideo.some(type => tweet.image.type.includes(type)) ?
                  <video src={ URL.createObjectURL(tweet.image)} id='homeFormImagePreview' controls></video>
                  :
                  null
                }
              </>
              :
              null
            }
            <div id="uploadAndTweetSidebar">
              <label>
                <input 
                  type="file" 
                  id='uploadInput' 
                  onChange={onImageChange} 
                  accept='.gif,.jpg,.jpeg,.png,.mp4,.mov' 
                  ref={fileInputRef}
                >
                </input>
                <div className="uploadImageWrapper">
                    <img src={uploadImage} alt="imgUL" className='uploadImage'></img>
                </div>
              </label>
              {tweet.text === "" && tweet.image === null ?
                <button id='composeButtonInactive' type='button'>Tweet</button>
                :
                <button id='composeButton' type='submit'>Tweet</button>
              }
            </div>
          </form>
        </div>
      }
    </>
  )
}

export default Compose;