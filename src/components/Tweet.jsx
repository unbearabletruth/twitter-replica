import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import '../assets/styles/Tweet.css'
import { saveComment, db, getProfilePicUrl, updateComments } from "../firebase/connection";
import uniqid from "uniqid";
import uploadImage from '../assets/images/image-line-icon.svg'
import { query, collection, onSnapshot, orderBy, where, doc, getDoc } from 'firebase/firestore';
import TweetCard from "./TweetCard";

function Tweet({userState}){
    const {id} = useParams();
    const [tweet, setTweet] = useState()
    const [comments, setComments] = useState([])
    const [comment, setComment] = useState({
      text: "",
      image: null,
      id: uniqid(),
    })

    useEffect(() => {
      async function getTweet(db){
        const tweetRef = doc(db, "tweets", id);
        const tweetSnap = await getDoc(tweetRef);
        const tweetData = tweetSnap.data();
        setTweet(tweetData);
      }
      getTweet(db)
    }, [id]);

    useEffect(() => {
      async function getComments(db) {
        const getComments = query(collection(db, 'tweets'), where('parent', '==', id));
        onSnapshot(getComments, (snapshot) => {
          let newComments = [];
            snapshot.forEach(doc => {
                let newPost = doc.data()
                newComments.push(newPost)
                console.log(newComments)
            })
          setComments(newComments)
        });
      }
      getComments(db);
    }, [id])
    
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
        saveComment(db, comment.text, userState.profileName, comment.id, tweet.id)
        updateComments(db, comment.id, tweet.id)
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
    console.log( id)
    return(
      <>
      {tweet ?
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
          </div>
          {tweet.retweets > 0 || tweet.likes > 0 ?
            <div className="tweetRetweetsAndLikesBig">
              {tweet.retweets > 0 ?
                <p className="tweetResponseBig">
                  <span className="tweetResponseNumberBig">{tweet.retweets}</span>
                  <span className="tweetResponseTextBig">{tweet.retweets === 1 ? "Retweet" : "Retweets"}</span> 
                </p>
                :
                null
              }
              {tweet.likes > 0 ?
                <p className="tweetResponseBig">
                  <span className="tweetResponseNumberBig">{tweet.likes}</span>
                  <span className="tweetResponseTextBig">{tweet.likes === 1 ? "Like" : "Likes"}</span> 
                </p>
                :
                null
              }
            </div>
            :
            null
          }
          
          <div className='tweetLikesBarBig'>
            <span>svg will be here</span>
          </div>
          
        </div>
        :
        null
      }
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
      {comments ? 
        <TweetCard tweets={comments} userState={userState}/>
        : null
      }
      <div className="emptySpaceBottom"></div>
      </>
    )
}

export default Tweet;