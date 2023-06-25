import '../assets/styles/Sidebar.css'
import { Link } from 'react-router-dom';
import logo from '../assets/images/twitter-icon.svg'
import { getUserName, getProfilePicUrl, isUserSignedIn, authStateObserver } from '../firebase/connection';
import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';


function Sidebar() {
  const [state, setState] = useState()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(), user => {
    if(user){
        setState(true);
         }else{
        setState(false);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);
  
  return(
    <div id="sidebar">
      <div id='sidebarContent'>
        <div className="sidebarLinks">
          <div className='sidebarLinkWrapper'>
            <div className='sidebarLinkContent'>
              <img src={logo} alt='logo' id='sidebarLogo'></img>
            </div>
          </div>
          <div className='sidebarLinkWrapper'>
            <div className='sidebarLinkContent'>
              <Link to="/" className="sidebarLink">Home</Link>
            </div>
          </div>
          <div className='sidebarLinkWrapper'>
            <div className='sidebarLinkContent'>
              <Link to="/explore" className="sidebarLink">Explore</Link>
            </div>
          </div>
          <div className='sidebarLinkWrapper'>
            <div className='sidebarLinkContent'>
              <Link to="/notifications" className="sidebarLink">Notifications</Link>
            </div>
          </div>
          <div className='sidebarLinkWrapper'>
            <div className='sidebarLinkContent'>
              <Link to="/messages" className="sidebarLink">Messages</Link>
            </div>
          </div>
          <div className='sidebarLinkWrapper'>
            <div className='sidebarLinkContent'>
              <Link to="/lists" className="sidebarLink">Lists</Link>
            </div>
          </div>
          <div className='sidebarLinkWrapper'>
            <div className='sidebarLinkContent'>
              <Link to="/bookmarks" className="sidebarLink">Bookmarks</Link>
            </div>
          </div>
          <div className='sidebarLinkWrapper'>
            <div className='sidebarLinkContent'>
              <Link to="/verified" className="sidebarLink">Verified</Link>
            </div>
          </div>
          <div className='sidebarLinkWrapper'>
            <div className='sidebarLinkContent'>
              <Link to="/profile" className="sidebarLink">Profile</Link>
            </div>
          </div>
          <div className='sidebarLinkWrapper'>
            <div className='sidebarLinkContent'>
              <div className="sidebarLink">More</div>
            </div>
          </div>
          <Link to="/compose" id='composeTweet'>Tweet</Link>
        </div>
        <div className="sidebarUserInfo">
          {state ?
              <>
                <img src={getProfilePicUrl()} alt='profilePic'></img>
                <div>
                  <p>{getUserName()}</p>
                  <p>profile name</p>
                </div>
                <img></img>
              </>
            :
              <Link to="/login">Log in</Link>
          }
        </div>
      </div>
    </div>
  )
}

export default Sidebar;