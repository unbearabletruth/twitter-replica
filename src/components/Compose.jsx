import { saveTweet, updateComments } from "../firebase/connection"
import { useState, useEffect, useRef, useMemo } from 'react';
import uniqid from "uniqid";
import { db } from '../firebase/connection';
import uploadIcon from '../assets/images/image-line-icon.svg'
import closeIcon from '../assets/images/close-icon.svg'

function Compose({userState, where, handleCompose, parentId = null}){
  const isImage = ['gif','jpg','jpeg','png'];
  const isVideo = ['mp4','mov']
  const [wrongFile, setWrongFile] = useState(false)
  const fileInputRef = useRef(null);
  const [tweet, setTweet] = useState({
    text: "",
    id: uniqid(),
  })
  const [media, setMedia] = useState(null)
  const [textInputFocus, setTextInputFocus] = useState(false)

  const handleFocus = () => {
    setTextInputFocus(true)
  }
 
  const onTextChange = (e) => {
    setTweet({
      ...tweet,
      [e.target.name] : e.target.value
    })
  }

  const onMediaChange = (e) => {
    if(isImage.some(type => e.target.files[0].type.includes(type)) ||
      isVideo.some(type => e.target.files[0].type.includes(type))){
        setMedia(e.target.files[0])
      }
    else{
      fileInputRef.current.value = null
      setWrongFile(true)
    }
  }
  
  const addTweet = (e) => {
    e.preventDefault();
    saveTweet(db, tweet, media, userState, parentId)
    if (parentId){
      updateComments(db, tweet.id, parentId)
    }
    resetCompose()
  }

  const resetCompose = () => {
    setTweet({
      text: "",
      id: uniqid(),
    })
    setMedia(null)
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
    setMedia(null)
  }

  const mediaPreview = useMemo(() => (
    media ?
      <MediaPreview 
        media={media} 
        isImage={isImage} 
        removeMedia={removeMedia}
      />
    :
      null
  ), [media])

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
          <img 
            src={userState.profilePic} 
            alt='profilePic' 
            id='homeComposeProfilePicture'
          >
          </img>
          <form onSubmit={addTweet} id='tweetForm'>
            <textarea 
              id="homeCompose" 
              className={textInputFocus ? 'focus' : null}
              name='text'
              placeholder={parentId ? "Tweet your reply!" : "What is happening?!"}
              value={tweet.text}
              onChange={onTextChange}
              onFocus={handleFocus}
            >
            </textarea>
            {mediaPreview}
            <div id="uploadAndTweet" className={textInputFocus ? 'focus' : null}>
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
              {tweet.text === "" && media === null || tweet.text.length >= 280 ?
                tweet.text.length >= 280 ?
                  <div id="composeButtonAndSymbols">
                    <div id="composeSymbolsLeft" className='tooMany'>
                      {280 - tweet.text.length}
                    </div>
                    <button id='composeButtonInactive' type='button'>Tweet</button>
                  </div>
                  :
                  <button id='composeButtonInactive' type='button'>Tweet</button>
                :
                <div id="composeButtonAndSymbols">
                  <div id="composeSymbolsLeft">{280 - tweet.text.length}</div>
                  <button id='composeButton' type='submit'>Tweet</button>
                </div>
              }
            </div>
          </form>
        </div>
        :
        <div id='tweetComposeWrapperSidebar'>
          <form onSubmit={addTweet} id='tweetFormSidebar'>
            <div id='composeMainContent'>
              <img 
                src={userState.profilePic} 
                alt='profilePic' 
                id='homeComposeProfilePicture'
              >
              </img>
              <textarea 
                id="homeCompose" 
                name='text'
                placeholder="What is happening?!"
                value={tweet.text}
                onChange={onTextChange}
              >
              </textarea>
            </div>
              {mediaPreview}
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
                {tweet.text === "" && media === null || tweet.text.length >= 280 ?
                  tweet.text.length >= 280 ?
                    <div id="composeButtonAndSymbols">
                      <div id="composeSymbolsLeft" className='tooMany'>
                        {280 - tweet.text.length}
                      </div>
                      <button id='composeButtonInactive' type='button'>Tweet</button>
                    </div>
                    :
                    <button id='composeButtonInactive' type='button'>Tweet</button>
                  :
                  <div id="composeButtonAndSymbols">
                    <div id="composeSymbolsLeft">{280 - tweet.text.length}</div>
                    <button id='composeButton' type='submit'>Tweet</button>
                  </div>
                }
            </div>
          </form>
        </div>
      }
    </>
  )
}

function MediaPreview({media, isImage, removeMedia}){
  return (
    isImage.some(type => media.type.includes(type)) ?
      <div id="mediaPreviewWrapper">
        <img 
          src={ URL.createObjectURL(media)} 
          id='homeFormImagePreview'
        >
        </img>
        <div className="removeMedia" onClick={removeMedia}>
          <img className="closeIcon remove" src={closeIcon}></img>
        </div>
      </div>
    : 
      <div id="mediaPreviewWrapper">
        <video 
          src={ URL.createObjectURL(media)} 
          id='homeFormImagePreview' 
          controls
        >
        </video>
        <div className="removeMedia" onClick={removeMedia}>
          <img className="closeIcon remove" src={closeIcon}></img>
        </div>
      </div>
  )
}

export default Compose;