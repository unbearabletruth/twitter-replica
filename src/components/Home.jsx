
import uploadImage from '../assets/images/image-line-icon.svg'
import '../assets/styles/Home.css'
import { useState } from 'react';
import uniqid from "uniqid";
import { getProfilePicUrl } from '../firebase/connection';
import { saveTweet, saveTweetWithImage } from '../firebase/connection';
import TweetCard from './TweetCard';


function Home({tweets, userState}){
  const [tweet, setTweet] = useState({
    text: "",
    image: null,
    likes: 0,
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
      saveTweetWithImage(tweet.image, tweet.text, tweet.id, userState.profileName)
    } else{
      saveTweet(db, tweet.text, tweet.id, tweet.likes, userState.profileName)
    }
    setTweet({
      ...tweet,
      text: "",
      image: null,
    })  
  }

  console.log(tweets)
  return(
    <>
      <p id='homeTitle'>Home</p>
      {userState ?
        <div id='tweetComposeWrapper'>
          <img src={getProfilePicUrl()} alt='profilePic' id='homeComposeProfilePicture'></img>
          <form onSubmit={addTweet} id='tweetForm'>
              <textarea 
                id="homeCompose" 
                name='text'
                placeholder="What is happening?!"
                value={tweet.text}
                onChange={onTextChange}
              >
              </textarea>
              <img src={tweet.image? URL.createObjectURL(tweet.image) : null} id='homeFormImagePreview'></img>
              <div id="uploadAndTweet">
                <label>
                  <input type="file" id='uploadInput' onChange={onImageChange}></input>
                  <img src={uploadImage} alt="imgUL" className='uploadImage'></img>
                </label>
                <button id='homeComposeButton' type='submit'>Tweet</button>
              </div>
          </form>
        </div>
        :
        null
      }
      {tweets ? 
        <TweetCard tweets={tweets} />
        : null
      }
    </>
  )
}

export default Home;