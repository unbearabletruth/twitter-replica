import { useEffect, useState } from 'react';
import uploadImage from '../assets/images/image-line-icon.svg'
import '../assets/styles/Home.css'
import uniqid from "uniqid";
import { saveTweet, db, getTweets, saveTweetWithImage } from '../firebase/connection';



function Home(){
  const [tweets, setTweets] = useState([])
  const [tweet, setTweet] = useState({
    text: "",
    image: null,
    id: uniqid(),
  })

  useEffect(() => {
    async function readTweets(){
      const tweetsPromise = getTweets(db);
      const tweetsArray = await tweetsPromise;
      setTweets(tweets.concat(tweetsArray))
    }
    readTweets()
  }, [])
    
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
      saveTweetWithImage(tweet.image, tweet.text, tweet.id)
    } else{
      saveTweet(db, tweet.text, tweet.id)
    }
    //setTweets(tweets.concat(tweet))
    setTweet({
      ...tweet,
      text: "",
      image: null,
    })
    
  }
  
  return(
    <>
      <p id='homeTitle'>Home</p>
      <form onSubmit={addTweet}>
        <div id='tweetFormContent'>
          <img id='homeComposeProfilePicture'></img>
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
            <button type='submit'>Tweet</button>
          </div>
        </div>
        
      </form>
      {tweets ? 
        tweets.map(tweet => {
          return(
            <div key={tweet.id} className='tweet'>
              <div className='tweetAuthor'>
                {tweet.timestamp.seconds}
              </div>
              <div className='tweetContent'>
                <p className='tweetText'>{tweet.text}</p>
                <img src={tweet.imageUrl} className='tweetImage'></img>
              </div>
              <div className='tweetLikesBar'>

              </div>
              
            </div>
          )
        })
        : null
      }
    </>
  )
}

export default Home;