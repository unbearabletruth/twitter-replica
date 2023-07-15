import '../assets/styles/Content.css'
import { Routes, Route, Navigate } from "react-router-dom";
import Home from './Home';
import Explore from './Expole';
import Notifications from './Notifications';
import Messages from './Messages';
import Lists from './Lists';
import Bookmarks from './Bookmarks';
import Verified from './Verified';
import Profile from './Profile';
import FollowPage from './FollowPage';
import Tweet from './Tweet';
import Search from './Search';


function Content({userState}){
    return(
      <div id='content'>
        <div id="mainContent">
          <Routes>
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="/home" element={<Home userState={userState}/>} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/lists" element={<Lists />} />
            <Route path="/bookmarks" element={<Bookmarks />} />
            <Route path="/verified" element={<Verified />} />
            <Route path="/profile/:id" element={<Profile userState={userState}/>} />
            <Route path="/profile/:id/follow" element={<FollowPage userState={userState}/>} />
            <Route path="/tweet/:id" element={<Tweet userState={userState}/>} />
          </Routes>
        </div>
        <div id='sideContent'>
          <Search />
          <div id='getVerified'>
            <p>Just</p>
            <p>a non-functional</p>
            <a>placeholder</a>
          </div>
          <div id='trends'>
            <p>Trends for you</p>
            <div id='trendsEntry'>
              placeholder
            </div>
          </div>
        </div>
      </div>
    )
}

export default Content;