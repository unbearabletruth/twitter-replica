import { saveTweet, saveTweetWithImage } from "../firebase/connection"
import { useState, useEffect, useRef } from 'react';
import uniqid from "uniqid";
import { db } from '../firebase/connection';
import uploadIcon from '../assets/images/image-line-icon.svg'
import closeIcon from '../assets/images/close-icon.svg'

function Compose({userState, where, handleCompose}){
  const isImage = ['gif','jpg','jpeg','png'];
  const isVideo = ['mp4','mov']
  const [wrongFile, setWrongFile] = useState(false)
  const fileInputRef = useRef(null);
  const [tweet, setTweet] = useState({
    text: "",
    media: null,
    id: uniqid(),
  })
  
  const onTextChange = (e) => {
    setTweet({
      ...tweet,
      [e.target.name] : e.target.value
    })
  }

  const onMediaChange = (e) => {
    console.log(e.target.files[0])
    if(isImage.some(type => e.target.files[0].type.includes(type)) ||
      isVideo.some(type => e.target.files[0].type.includes(type))){
        setTweet({
          ...tweet,
          media: e.target.files[0]
        }) 
      }
    else{
      fileInputRef.current.value = null
      setWrongFile(true)
    }
  }
  
  const addTweet = (e) => {
    e.preventDefault();
    if (tweet.media !== null){
      saveTweetWithImage(db, tweet, userState)
    } else{
      saveTweet(db, tweet, userState)
    }
    setTweet({
      text: "",
      media: null,
      id: uniqid(),
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
  
  const removeMedia = () => {
    fileInputRef.current.value = null
    setTweet({
      ...tweet,
      media: null,
    })
  }

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
            {tweet.media ? 
              <>
                {isImage.some(type => tweet.media.type.includes(type)) ?
                  <div id="mediaPreviewWrapper">
                    <img src={ URL.createObjectURL(tweet.media)} id='homeFormImagePreview'></img>
                    <div className="removeMedia" onClick={removeMedia}>
                      <img className="closeIcon remove" src={closeIcon}></img>
                    </div>
                  </div>
                  : 
                  <div id="mediaPreviewWrapper">
                    <video src={ URL.createObjectURL(tweet.media)} id='homeFormImagePreview' controls></video>
                    <div className="removeMedia" onClick={removeMedia}>
                      <img className="closeIcon remove" src={closeIcon}></img>
                    </div>
                  </div>
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
                onChange={onMediaChange} 
                accept='.gif,.jpg,.jpeg,.png,.mp4,.mov'
                ref={fileInputRef}
              >
              </input>
              <div className="uploadIconWrapper">
                <img src={uploadIcon} alt="imgUL" className='uploadIcon'></img>
              </div>
              </label>
              {tweet.text === "" && tweet.media === null ?
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
            {tweet.media ? 
              <>
                {isImage.some(type => tweet.media.type.includes(type)) ?
                  <div id="mediaPreviewWrapper">
                    <img src={ URL.createObjectURL(tweet.media)} id='homeFormImagePreview'></img>
                    <div className="removeMedia" onClick={removeMedia}>
                      <img className="closeIcon remove" src={closeIcon}></img>
                    </div>
                  </div>
                  : isVideo.some(type => tweet.media.type.includes(type)) ?
                  <div id="mediaPreviewWrapper">
                    <video src={ URL.createObjectURL(tweet.media)} id='homeFormImagePreview' controls></video>
                    <div className="removeMedia" onClick={removeMedia}>
                      <img className="closeIcon remove" src={closeIcon}></img>
                    </div>
                  </div>
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
                  onChange={onMediaChange} 
                  accept='.gif,.jpg,.jpeg,.png,.mp4,.mov' 
                  ref={fileInputRef}
                >
                </input>
                <div className="uploadIconWrapper">
                    <img src={uploadIcon} alt="imgUL" className='uploadIcon'></img>
                </div>
              </label>
              {tweet.text === "" && tweet.media === null ?
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