import '../assets/styles/Sidebar.css'
import { Link } from 'react-router-dom';
import logo from '../assets/images/twitter-icon.svg'
import { useEffect, useState, useRef } from 'react';
import { signOutUser } from "../firebase/connection";
import uniqid from "uniqid";
import { useLocation } from 'react-router-dom';
import home from '../assets/images/sidebar/home.svg'
import explore from '../assets/images/sidebar/explore.svg'
import notifications from '../assets/images/sidebar/notifications.png'
import messages from '../assets/images/sidebar/messages.png'
import lists from '../assets/images/sidebar/lists.svg'
import bookmarks from '../assets/images/sidebar/bookmarks.svg'
import verified from '../assets/images/sidebar/verified.png'
import profile from '../assets/images/sidebar/profile.png'
import more from '../assets/images/sidebar/more.png'
import Compose from './Compose';
import closeIcon from '../assets/images/close-icon.svg'

function Sidebar({userState}) {
  const tabs = ['home', 'explore', 'notifications',
                'messages', 'lists', 'bookmarks', 'verified']
  const [loginWindow, setLoginWindow] = useState(false)
  const loginPopupWindow = useRef(null);
  const [selected, setSelected] = useState(null)
  const location = useLocation();
  const [composePopup, setComposePopup] = useState(false)

  useEffect(() => {
    setSelected(location.pathname.slice(1))
  }, [location])

  useEffect(() => {
    function handleClickOutside(e) {
      if (loginPopupWindow.current && loginPopupWindow.current !== e.target) {
        setLoginWindow(false)
      }
    }
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [loginPopupWindow]);

  const loginPopup = () => {
    setLoginWindow(true)
  }

  const handleCompose = () => {
    setComposePopup(!composePopup)
  }

  return(
    <div id="sidebar">
      <div id='sidebarContent'>
        <div className="sidebarLinks">
          <Link to="/home" className="sidebarLink">
            <div className='sidebarLinkWrapper'>
              <div className='sidebarLinkContent'>
                <img src={logo} alt='logo' id='sidebarLogo'></img>
              </div>
            </div>
          </Link>
          {tabs.map(tab => {
            return(
              <Link 
                key={uniqid()}
                to={`/${tab}`} 
                className={`sidebarLink ${selected === tab ? 'active' : ''}`}  
                >
                <div className='sidebarLinkWrapper'>
                  <div className='sidebarLinkContent'>
                    <img src={eval(tab)} alt='logo' className='sidebarIcon'></img>
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </div>
                </div>
              </Link>
            )
          })}
          <Link 
            to={userState ? `/profile/${userState.profileName}` : "/profile"} 
            className={`sidebarLink ${selected && selected.includes(`profile`)  ? 'active' : ''}`}  
            >
            <div className='sidebarLinkWrapper'>
              <div className='sidebarLinkContent'>
                <img src={profile} alt='logo' className='sidebarIcon'></img>
                Profile
              </div>
            </div>
          </Link>
          <div 
            className={`sidebarLink ${selected === `more` ? 'active' : ''}`}  
            >
            <div className='sidebarLinkWrapper'>
              <div className='sidebarLinkContent'>
                <img src={more} alt='logo' className='sidebarIcon'></img>
                More
              </div>
            </div>
          </div>
          <button to="/compose" id='composeTweet' onClick={handleCompose}>Tweet</button>
        </div>
          {userState ?
              <>
                <div id="sidebarUserInfo" onClick={loginPopup} ref={loginPopupWindow}>
                  <div id='sidebarProfileBlock'>
                    <img src={userState.profilePic} alt='profilePic' id='profilePic'></img>
                    <div className='profileNames'>
                      <p id='realName'>{userState.realName}</p>
                      <p id='profileName'>@{userState.profileName}</p>
                    </div>
                  </div>
                  <p id='profileMenu'>&#8230;</p>
                  
                </div>
                {loginWindow ? 
                  <div className='loginPopup' >
                    <a id='logoutLink' onClick={signOutUser}>Log out @{userState.profileName}</a>
                  </div>
                  :
                  null
                }
              </>
            :
              <Link to="/login" id='toLoginPage'>Sign up or Log in</Link>
          }
        </div>
        {userState && composePopup ?
          <div id='composePopup'>
            <button onClick={handleCompose} className="closePopup">
              <img src={closeIcon} alt="x" className="closeIcon"></img>
            </button>
            <Compose userState={userState} where={"sidebar"} handleCompose={handleCompose}/>
          </div>
          :
          null
        }
      </div>
  )
}

export default Sidebar;