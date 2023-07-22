import '../assets/styles/Content.css'
import { Routes, Route, Navigate } from "react-router-dom";
import Home from './Home';
import Explore from './in development/Expole';
import Notifications from './in development/Notifications';
import Messages from './in development/Messages';
import Lists from './in development/Lists';
import Bookmarks from './in development/Bookmarks';
import Verified from './in development/Verified';
import Profile from './Profile';
import FollowPage from './FollowPage';
import Tweet from './Tweet';
import Search from './Search';
import WhoToFollow from './WhoToFollow';
import Error404 from './Error404';


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
            <Route path="*" element={<Error404/>} />
          </Routes>
        </div>
        <div id='sideContent'>
          <Search userState={userState}/>
          <WhoToFollow userState={userState}/>
        </div>
      </div>
    )
}

export default Content;