import '../assets/styles/Home.css'
import TweetCard from './TweetCard';
import Compose from './Compose';


function Home({tweets, userState}){
  return(
    <>
      <p id='homeTitle'>Home</p>
      {userState ?
        <Compose userState={userState} where={'home'}/>
        :
        null
      }
      {tweets ? 
        <TweetCard tweets={tweets} userState={userState}/>
        : null
      }
    </>
  )
}

export default Home;