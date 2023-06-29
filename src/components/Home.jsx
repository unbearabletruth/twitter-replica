import { useEffect, useState } from 'react';
import uploadImage from '../assets/images/image-line-icon.svg'
import '../assets/styles/Home.css'
import uniqid from "uniqid";
import { saveTweet, db, saveTweetWithImage, updateTweet, userRetweets } from '../firebase/connection';
import { Link } from 'react-router-dom';
import { getProfilePicUrl } from '../firebase/connection';
import like from '../assets/images/like.png'
import retweet from '../assets/images/retweet.png'
import reply from '../assets/images/reply.png'


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

  const addLike = (e, id) => {
    e.preventDefault()
    updateTweet(db, id)
  }

  const addRetweet = (e, id) => {
    e.preventDefault()
    userRetweets(db, id, userState.profileName)
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

  const convertDate = (timestamp) => {
    let date = new Date(timestamp * 1000);
    let stringDate = date.toLocaleString(undefined, {
      month: "short",
      day: "2-digit",
      hour: "numeric", minute: "numeric"
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
            <div className='tweet' key={tweet.id}>
              <Link to={`/profile/${tweet.profileName}`} className='tweetProfilePictureLink'>
                    <img src={tweet.profilePic} className='tweetProfilePicture'></img>
              </Link>
              <Link to={`/tweet/${tweet.id}`} className='tweetLink'>
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
                  <div className='tweetResponseBar'>
                    <div className='response reply'>
                      <div className='responseImgWrapper reply'>
                        <img src={reply} className='responseImg reply'></img>
                      </div>
                      <span className='replyNumber'>12</span>
                    </div>
                    <div className='response retweet' onClick={(e) => addRetweet(e, tweet.id)}>
                      <div className='responseImgWrapper retweet'>
                        <img src={retweet} className='responseImg retweet'></img>
                      </div>
                      <span className='retweetNumber'>{tweet.retweets}</span>
                    </div>
                    <div className='response like' onClick={(e) => addLike(e, tweet.id)}>
                      <div className='responseImgWrapper like'>
                        <img src={like} className='responseImg like'></img>
                      </div>
                      <span className='likeNumber'>{tweet.likes}</span>
                    </div>
                    
                  </div>
                </div>
              </Link>
            </div>
          )
        })
        : null
      }
    </>
  )
}

export default Home;