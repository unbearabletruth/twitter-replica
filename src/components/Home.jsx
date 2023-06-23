import { useState } from 'react';
import uploadImage from '../assets/images/image-line-icon.svg'
import '../assets/styles/Home.css'
import uniqid from "uniqid";

function Home(){
  const [tweets, setTweets] = useState([])
  const [tweet, setTweet] = useState({
    text: "",
    image: null,
    id: uniqid()
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
      image: URL.createObjectURL(e.target.files[0])
  })  
  }

  const addTweet = (e) => {
    e.preventDefault();
    setTweets(tweets.concat(tweet))
    setTweet({
      text: "",
      image: null,
      id: uniqid()
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
          <img src={tweet.image} id='homeFormImagePreview'></img>
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

              </div>
              <div className='tweetContent'>
                <p className='tweetText'>{tweet.text}</p>
                <img src={tweet.image} className='tweetImage'></img>
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