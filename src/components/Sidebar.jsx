import '../assets/styles/Sidebar.css'
import { Link } from 'react-router-dom';
import logo from '../assets/images/twitter-icon.svg'
import { getUserName, getProfilePicUrl } from '../firebase/connection';
import { useEffect, useState, useRef } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { signIn, signOutUser } from "../firebase/connection";


function Sidebar({userState}) {
  
  const [loginWindow, setLoginWindow] = useState(false)
  const loginPopupWindow = useRef(null);

  

  /*useEffect(() => {
    function handleClickOutside(e) {
      if (loginPopupWindow.current && loginPopupWindow.current !== e.target) {
        setLoginWindow(false)
      }
    }
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [loginPopupWindow]);*/

  const loginPopup = () => {
    setLoginWindow(true)
  }

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
              <Link to={userState ? `/profile/${userState.profileName}` : "/profile"} className="sidebarLink">Profile</Link>
            </div>
          </div>
          <div className='sidebarLinkWrapper'>
            <div className='sidebarLinkContent'>
              <div className="sidebarLink">More</div>
            </div>
          </div>
          <Link to="/compose" id='composeTweet'>Tweet</Link>
        </div>
          {userState ?
              <>
                <div className="sidebarUserInfo" onClick={loginPopup} ref={loginPopupWindow}>
                  <div id='sidebarProfileBlock'>
                    <img src={getProfilePicUrl()} alt='profilePic' id='profilePic'></img>
                    <div className='profileNames'>
                      <p id='realName'>{getUserName()}</p>
                      <p id='profileName'>@{getUserName()}_profile</p>
                    </div>
                  </div>
                  <p id='profileMenu'>&#8230;</p>
                  
                </div>
                {loginWindow ? 
                  <div className='loginPopup' >
                    <a id='logoutLink' onClick={signOutUser}>Log out @{getUserName()}_profile</a>
                  </div>
                  :
                  null
                }
              </>
            :
              <Link to="/login">Log in</Link>
          }
        </div>
      </div>
    
  )
}

export default Sidebar;