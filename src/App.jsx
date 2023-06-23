import { useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
import Sidebar from './components/Sidebar';
import Main from './components/Main';
import Home from './components/Home';
import Explore from './components/Expole';
import Notifications from './components/Notifications';
import Messages from './components/Messages';
import Lists from './components/Lists';
import Bookmarks from './components/Bookmarks';
import Verified from './components/Verified';
import Profile from './components/Profile';

function App() {
  return (
    <>
      <BrowserRouter>
        <Sidebar/>
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
      </BrowserRouter>
      <Main/>
    </>
  )
}

export default App
