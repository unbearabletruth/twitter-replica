import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import '../assets/styles/Tweet.css'
import { saveComment, db, updateComments, updateRetweets, updateLikes } from "../firebase/connection";
import uniqid from "uniqid";
import uploadImage from '../assets/images/image-line-icon.svg'
import { query, collection, onSnapshot, orderBy, where, doc, getDoc } from 'firebase/firestore';
import TweetCard from "./TweetCard";
import like from '../assets/images/like.png'
import retweet from '../assets/images/retweet.png'


function Tweet({userState}){
    const isImage = ['gif','jpg','jpeg','png'];
    const isVideo = ['mpg', 'mp2', 'mpeg', 'mpe', 'mpv', 'mp4']
    const {id} = useParams();
    const [tweet, setTweet] = useState()
    const [parent, setParent] = useState()
    const [comments, setComments] = useState([])
    const [comment, setComment] = useState({
      text: "",
      image: null,
      id: uniqid(),
    })

    const addLike = () => {
      updateLikes(db, tweet.id, userState.profileName)
    }
  
    const addRetweet = () => {
      updateRetweets(db, tweet.id, userState.profileName)
    }

    /*useEffect(() => {
      async function getTweet(db){
        const tweetRef = doc(db, "tweets", id);
        const tweetSnap = await getDoc(tweetRef);
        const tweetData = tweetSnap.data();
        setTweet(tweetData);
      }
      getTweet(db)
    }, [id]);*/

    useEffect(() => {
      onSnapshot(doc(db, "tweets", id), (doc) => {
        setTweet(doc.data())
        setParent(null)
      })
    }, [id])

    useEffect(() => {
      async function getComments(db) {
        const getComments = query(collection(db, 'tweets'), where('parent', '==', id));
        onSnapshot(getComments, (snapshot) => {
          let newComments = [];
            snapshot.forEach(doc => {
                let newPost = doc.data()
                newComments.push(newPost)
            })
          setComments(newComments)
        });
      }
      getComments(db);
    }, [id])

    useEffect(() => {
      if(tweet && tweet.parent){
        async function getParentTweet(db){
          const tweetRef = doc(db, "tweets", tweet.parent);
          const tweetSnap = await getDoc(tweetRef);
          const tweetData = tweetSnap.data();
          setParent(tweetData);
        }
        getParentTweet(db)
      }
    }, [tweet]);
    
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
        saveComment(db, comment.text, userState, comment.id, tweet.id)
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

    return(
      <>
      {tweet ?
        <>
        {parent ?
          <TweetCard tweets={[parent]} userState={userState}/>
          : null
        }
        <div className='tweetBig'>
          <div className="tweetProfileBig">
            <div className="tweetProfileNoMenuBig">
              <Link to={`/profile/${tweet.profileName}`}>
                <img src={tweet.profilePic} className='tweetProfilePictureBig'></img>
              </Link>
              <div className='tweetAuthorBig'>
                <p className='tweetRealNameBig'>{tweet.author}</p>
                <p className='tweetProfileNameBig'>@{tweet.profileName}</p>
              </div>
            </div>
            <span>&#8230;</span>
          </div>
          <div className='tweetContentBig'>
            <p className='tweetTextBig'>{tweet.text}</p>
            {tweet.imageUrl ?
              <>
              {isImage.some(type => tweet.imageUrl.includes(type)) ? 
                <img src={tweet.imageUrl} className='tweetImageBig'></img>
                : isVideo.some(type => tweet.imageUrl.includes(type)) ?
                <video src={tweet.imageUrl} className='tweetImageBig' controls></video>
                :
                null
              }
            </>
            :
            null
            }
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
          <div className='tweetResponseBarBig'>
            <div className='response retweet' onClick={addRetweet}>
              <div className='responseImgWrapper big retweet'>
                <img 
                  src={retweet} 
                  className={userState && tweet.retweetedBy && 
                            tweet.retweetedBy.includes(userState.profileName) ? 
                      'responseImg retweet big active'
                    : 
                      'responseImg retweet big'}
                  >
                  </img>
              </div>
            </div>
            <div className='response like' onClick={addLike}>
              <div className='responseImgWrapper big like'>
                <img 
                src={like} 
                className={userState && tweet.likedBy && 
                          tweet.likedBy.includes(userState.profileName) ?
                    'responseImg like big active'
                  :
                    'responseImg like big'}
                >
                </img>
              </div>
            </div>
          </div>
        </div>
        </>
        :
        null
      }
      {userState ? 
        <div id='tweetComposeWrapper'>
          <img src={userState.profilePic} alt='profilePic' id='homeComposeProfilePicture'></img>
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
                {comment.text === "" && comment.image === null ?
                  <button id='composeButtonInactive' type='button'>Tweet</button>
                  :
                  <button id='composeButton' type='submit'>Tweet</button>
                }
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