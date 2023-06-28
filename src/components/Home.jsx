import { useEffect, useState } from 'react';
import uploadImage from '../assets/images/image-line-icon.svg'
import '../assets/styles/Home.css'
import uniqid from "uniqid";
import { saveTweet, db, saveTweetWithImage } from '../firebase/connection';
import { Link } from 'react-router-dom';
import { getProfilePicUrl } from '../firebase/connection';


function Home({tweets, userState}){
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
      saveTweetWithImage(tweet.image, tweet.text, tweet.id)
    } else{
      saveTweet(db, tweet.text, tweet.id)
    }
    setTweet({
      ...tweet,
      text: "",
      image: null,
    })  
  }

  const convertDate = (timestamp) => {
    let date = new Date(timestamp * 1000);
    let stringDate = date.toLocaleString(undefined, {
      month: "short",
      day: "2-digit",
      hour: "numeric", minute: "numeric", second: "numeric"
    });
    return stringDate
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
        tweets.map(tweet => {
          return(
            <Link to={`/tweet/${tweet.id}`} key={tweet.id}>
              <div className='tweet'>
                <Link to={`/profile/${tweet.profileName}`}>
                  <img src={tweet.profilePic} className='tweetProfilePicture'></img>
                </Link>
                <div className='tweetWrapper'>
                  <div className='tweetAuthor'>
                    <p className='tweetRealName'>{tweet.author}</p>
                    <p className='tweetProfileName'>@{tweet.author}_profile</p>
                    <span>·</span>
                    <p>{tweet.timestamp ? convertDate(tweet.timestamp.seconds) : ""}</p>
                  </div>
                  <div className='tweetContent'>
                    <p className='tweetText'>{tweet.text}</p>
                    <img src={tweet.imageUrl} className='tweetImage'></img>
                  </div>
                  <div className='tweetLikesBar'>

                  </div>
                </div>
              </div>
            </Link>
          )
        })
        : null
      }
    </>
  )
}

export default Home;