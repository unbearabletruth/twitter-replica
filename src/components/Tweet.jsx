import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import '../assets/styles/Tweet.css'

function Tweet({tweets}){
    const {id} = useParams();
    const [tweet, setTweet] = useState(tweets.find((item) => item.id === id))

    useEffect(() => {
        const currentTweet = tweets.find((item) => item.id === id);
        setTweet(currentTweet);
      }, [id]);

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
          <p className='tweetTimeBig'>{convertDate(tweet.timestamp.seconds)}</p>
          <div className='tweetLikesBarBig'>

          </div>
        
      </div>
    )
}

export default Tweet;