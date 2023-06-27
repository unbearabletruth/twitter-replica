import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import '../assets/styles/Tweet.css'
import { saveComment, db, getProfilePicUrl } from "../firebase/connection";
import uniqid from "uniqid";
import uploadImage from '../assets/images/image-line-icon.svg'
import { query, collection, onSnapshot, orderBy } from 'firebase/firestore';

function Tweet({tweets, userState}){
    const {id} = useParams();
    const [tweet, setTweet] = useState(tweets.find((item) => item.id === id))
    const [comments, setComments] = useState([])
    const [comment, setComment] = useState({
      text: "",
      image: null,
      id: uniqid(),
    })

    useEffect(() => {
        const currentTweet = tweets.find((item) => item.id === id);
        setTweet(currentTweet);
    }, [id]);

    useEffect(() => {
      async function getComments(db) {
        const getComments = query(collection(db, tweet.id), orderBy("timestamp", "desc"));
        
        onSnapshot(getComments, (snapshot) => {
          let newComments = [];
            snapshot.forEach(doc => {
                let newPost = doc.data()
                newComments.push(newPost)
            })
          setComments(comments.concat(newComments))
        });
      }
      getComments(db);
    }, [])
    
    const onTextChange = (e) => {
      setComment({
        ...comment,
        [e.target.name] : e.target.value
    })
    }
  
    const onImageChange = (e) => {
      setComment({
        ...comment,
        image: e.target.files[0]
    })  
    }
  
    const addComment = (e) => {
      e.preventDefault();
      if (comment.image !== null){
        //saveCommentWithImage(comment.image, comment.text, comment.id)
      } else{
        saveComment(db, comment.text, comment.id, tweet.id)
      }
      setComment({
        ...comment,
        text: "",
        image: null,
      })  
    }

    const convertDate = (timestamp) => {
      let date = new Date(timestamp * 1000);
      let stringDate = date.toLocaleString(undefined, {
        hour: "numeric", minute: "numeric",
        month: "short",
        day: "2-digit",
      });
      return stringDate
    }

    return(
      <>
      <div className='tweetBig'>
        <div className="tweetProfileBig">
          <div className="tweetProfileNoMenuBig">
            <img src={tweet.profilePic} className='tweetProfilePictureBig'></img>
            <div className='tweetAuthorBig'>
              <p className='tweetRealNameBig'>{tweet.author}</p>
              <p className='tweetProfileNameBig'>@{tweet.author}_profile</p>
            </div>
          </div>
          <span>&#8230;</span>
        </div>
        <div className='tweetContentBig'>
          <p className='tweetTextBig'>{tweet.text}</p>
          <img src={tweet.imageUrl} className='tweetImageBig'></img>
        </div>
        <div className="tweetTimeAndViewsBig">
          <p className='tweetTimeBig'>{tweet.timestamp ? convertDate(tweet.timestamp.seconds) : ""}</p>
          <p>views</p>
        </div>
        <div className="tweetRetweetsAndLikesBig">
          <span>Retweets</span>
          <span>Likes</span>
        </div>
        <div className='tweetLikesBarBig'>
          <span>svg will be here</span>
        </div>
        {userState ? 
          <div id='tweetComposeWrapper'>
            <img src={getProfilePicUrl()} alt='profilePic' id='homeComposeProfilePicture'></img>
            <form onSubmit={addComment} id='tweetForm'>
                <textarea 
                  id="homeCompose" 
                  name='text'
                  placeholder="Tweet your reply!"
                  value={comment.text}
                  onChange={onTextChange}
                >
                </textarea>
                <img src={comment.image? URL.createObjectURL(comment.image) : null} id='homeFormImagePreview'></img>
                <div id="uploadAndTweet">
                  <label>
                    <input type="file" id='uploadInput' onChange={onImageChange}></input>
                    <img src={uploadImage} alt="imgUL" className='uploadImage'></img>
                  </label>
                  <button id='homeComposeButton' type='submit'>Reply</button>
                </div>
            </form>
          </div>
          :
          null
        }
      </div>
      {comments ? 
        comments.map(comment => {
          return(
            <div className='tweet' key={comment.id}>
              <img src={comment.profilePic} className='tweetProfilePicture'></img>
              <div className='tweetWrapper'>
                <div className='tweetAuthor'>
                  <p className='tweetRealName'>{comment.author}</p>
                  <p className='tweetProfileName'>@{comment.author}_profile</p>
                  <span>·</span>
                  <p>{comment.timestamp ? convertDate(comment.timestamp.seconds) : ""}</p>
                </div>
                <div className='tweetContent'>
                  <p className='tweetText'>{comment.text}</p>
                  <img src={comment.imageUrl} className='tweetImage'></img>
                </div>
                <div className='tweetLikesBar'>

                </div>
              </div>
            </div>
          )
        })
        : null
      }
      </>
    )
}

export default Tweet;