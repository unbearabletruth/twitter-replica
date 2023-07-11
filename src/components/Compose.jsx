import { saveTweet, saveTweetWithImage } from "../firebase/connection"
import { useState } from 'react';
import uniqid from "uniqid";
import { db } from '../firebase/connection';
import uploadImage from '../assets/images/image-line-icon.svg'

function Compose({userState, where, handleCompose}){
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
        setTweet({
          ...tweet,
          image: e.target.files[0]
      })  
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

    return(
        where === 'home' ?
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
                        <img src={ URL.createObjectURL(tweet.image)} id='homeFormImagePreview'></img>
                        :
                        null
                    }
                    <div id="uploadAndTweet">
                        <label>
                        <input type="file" id='uploadInput' onChange={onImageChange}></input>
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
                <form onSubmit={addTweet} id='tweetForm'>
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
                        <div id="previewImageWrapper">
                            <img src={ URL.createObjectURL(tweet.image)} id='sidebarFormImagePreview'></img>
                        </div>
                        :
                        null
                    }
                    <div id="uploadAndTweetSidebar">
                        <label>
                        <input type="file" id='uploadInput' onChange={onImageChange}></input>
                        <img src={uploadImage} alt="imgUL" className='uploadImage'></img>
                        </label>
                        {tweet.text === "" && tweet.image === null ?
                            <button id='composeButtonInactive' type='button'>Tweet</button>
                            :
                            <button id='composeButton' type='submit'>Tweet</button>
                        }
                    </div>
                </form>
            </div>
    )
}

export default Compose;