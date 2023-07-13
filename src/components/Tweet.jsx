import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import '../assets/styles/TweetBig.css'
import { db, updateRetweets, updateLikes } from "../firebase/connection";
import { query, collection, onSnapshot, orderBy, where, doc, getDoc } from 'firebase/firestore';
import TweetCard from "./TweetCard";
import like from '../assets/images/like.png'
import retweet from '../assets/images/retweet.png'
import Compose from "./Compose";


function Tweet({userState}){
    const isImage = ['.gif','.jpg','.jpeg','.png'];
    const isVideo = ['.mp4','.mov']
    const {id} = useParams();
    const [tweet, setTweet] = useState()
    const [parent, setParent] = useState()
    const [comments, setComments] = useState([])

    const addLike = () => {
      updateLikes(db, tweet.id, userState.profileName)
    }
  
    const addRetweet = () => {
      updateRetweets(db, tweet.id, userState.profileName)
    }

    useEffect(() => {
      onSnapshot(doc(db, "tweets", id), (doc) => {
        setTweet(doc.data())
        setParent(null)
      })
    }, [id])

    useEffect(() => {
      async function getComments(db) {
        const getComments = query(collection(db, 'tweets'), 
                                  where('parent', '==', id), 
                                  orderBy("timestamp", "desc"));
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
            {tweet.mediaUrl ?
              <>
              {isImage.some(type => tweet.mediaUrl.includes(type)) ? 
                <img src={tweet.mediaUrl} className='tweetImageBig'></img>
                : isVideo.some(type => tweet.mediaUrl.includes(type)) ?
                <video src={tweet.mediaUrl} className='tweetImageBig' controls></video>
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
      {userState && tweet?
        <Compose userState={userState} where={'home'} parentId={tweet.id}/>
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