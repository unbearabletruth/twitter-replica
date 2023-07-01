
import { db, updateLikes, updateRetweets } from '../firebase/connection';
import { Link } from 'react-router-dom';
import like from '../assets/images/like.png'
import retweet from '../assets/images/retweet.png'
import reply from '../assets/images/reply.png'

function TweetCard({tweets, userState}){

  const addLike = (e, id) => {
    e.preventDefault()
    updateLikes(db, id, userState.profileName)
  }

  const addRetweet = (e, id) => {
    e.preventDefault()
    updateRetweets(db, id, userState.profileName)
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
  console.log(userState)
  return (
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
                  <span className='replyNumber'>{tweet.comments === 0 ? null : tweet.comments}</span>
                </div>
                <div className='response retweet' onClick={(e) => addRetweet(e, tweet.id)}>
                  <div className='responseImgWrapper retweet'>
                    <img 
                      src={retweet} 
                      className={userState && tweet.retweetedBy && 
                                tweet.retweetedBy.includes(userState.profileName) ? 
                          'responseImg retweet active'
                        : 
                          'responseImg retweet'}
                      >
                     </img>
                  </div>
                  <span 
                    className={userState && tweet.retweetedBy && 
                              tweet.retweetedBy.includes(userState.profileName) ? 
                        'retweetNumber active'
                      :
                        'retweetNumber'}
                  >
                    {tweet.retweets === 0 ? null : tweet.retweets}
                  </span>
                </div>
                <div className='response like' onClick={(e) => addLike(e, tweet.id)}>
                  <div className='responseImgWrapper like'>
                    <img 
                    src={like} 
                    className={userState && tweet.likedBy && 
                              tweet.likedBy.includes(userState.profileName) ?
                        'responseImg like active'
                      :
                        'responseImg like'}
                    >
                    </img>
                  </div>
                  <span 
                    className={userState && tweet.likedBy && 
                              tweet.likedBy.includes(userState.profileName) ? 
                        'likeNumber active'
                      :
                        'likeNumber'}
                  >
                    {tweet.likes === 0 ? null : tweet.likes}
                  </span>
                </div>
                
              </div>
            </div>
          </Link>
        </div>
      )
    })
  )
}

export default TweetCard;