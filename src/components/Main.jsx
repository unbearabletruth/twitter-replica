import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './Home';
import Explore from './Expole';
import Notifications from './Notifications';
import Messages from './Messages';
import Lists from './Lists';
import Bookmarks from './Bookmarks';
import Verified from './Verified';
import Profile from './Profile';

function Main(){
    return(
      <div id="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/lists" element={<Lists />} />
          <Route path="/bookmarks" element={<Bookmarks />} />
          <Route path="/verified" element={<Verified />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    )
}

export default Main;