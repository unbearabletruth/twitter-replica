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
import composeIcon from '../assets/images/write.svg'

function Sidebar({userState}) {
  const tabs = [
    {title:'home', img: home},
    {title:'explore', img: explore},
    {title:'notifications', img: notifications},
    {title:'messages', img: messages},
    {title:'lists', img: lists},
    {title:'bookmarks', img: bookmarks},
    {title:'verified', img: verified},
  ]
  const [loginWindow, setLoginWindow] = useState(false)
  const logoutPopupRef = useRef(null);
  const [selected, setSelected] = useState(null)
  const location = useLocation();
  const [composePopup, setComposePopup] = useState(false)
  const [width, setWidth] = useState(window.innerWidth)

  useEffect(() => {
    setSelected(location.pathname.slice(1))
  }, [location])

  useEffect(() => {
    const handleWindowResize = () => {
      setWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleWindowResize);
    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, [])

  useEffect(() => {
    function handleClickOutside(e) {
      if (logoutPopupRef.current && !logoutPopupRef.current.contains(e.target)){
        setLoginWindow(false)
      }
    }
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [logoutPopupRef]);

  const loginPopup = () => {
    setLoginWindow(true)
  }

  const handleCompose = () => {
    setComposePopup(!composePopup)
  }
  console.log(width)
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
                to={`/${tab.title}`} 
                className={`sidebarLink ${selected === tab.title ? 'active' : ''}`}  
                >
                <div className='sidebarLinkWrapper'>
                  <div className='sidebarLinkContent'>
                    <img src={tab.img} alt='logo' className='sidebarIcon'></img>
                    <p className='sidebarText'>{tab.title.charAt(0).toUpperCase() + tab.title.slice(1)}</p>
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
                <p className='sidebarText'>Profile</p>
              </div>
            </div>
          </Link>
          <div 
            className={`sidebarLink ${selected === `more` ? 'active' : ''}`}  
            >
            <div className='sidebarLinkWrapper'>
              <div className='sidebarLinkContent'>
                <img src={more} alt='logo' className='sidebarIcon'></img>
                <p className='sidebarText'>More</p>
              </div>
            </div>
          </div>
          {width > 1300 ?
            <button to="/compose" id='composeTweet' onClick={handleCompose}>Tweet</button>
            :
            <button to="/compose" id='composeTweet' onClick={handleCompose}>
              <img src={composeIcon} alt='compose' id='composeIcon'></img>
            </button>
          }
        </div>
          {userState ?
              <>
                {width > 1300 ?
                  <div id="sidebarUserInfo" onClick={loginPopup} ref={logoutPopupRef}>
                    <div id='sidebarProfileBlock'>
                      <img src={userState.profilePic} alt='profilePic' id='profilePic'></img>
                      <div className='profileNames'>
                        <p id='realName'>{userState.realName}</p>
                        <p id='profileName'>@{userState.profileName}</p>
                      </div>
                    </div>
                    <p id='profileMenu'>&#8230;</p>
                  </div>
                :
                  <div id="sidebarUserInfo" onClick={loginPopup} ref={logoutPopupRef}>
                    <img src={userState.profilePic} alt='profilePic' id='profilePic'></img>
                  </div>
                }
                {loginWindow ? 
                  <div className='loginPopup'>
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
          <div id='popupBackground'>
            <div id='composePopup'>
              <button onClick={handleCompose} className="closePopup">
                <img src={closeIcon} alt="x" className="closeIcon"></img>
              </button>
              <Compose userState={userState} where={"sidebar"} handleCompose={handleCompose}/>
            </div>
          </div>
          :
          null
        }
      </div>
  )
}

export default Sidebar;