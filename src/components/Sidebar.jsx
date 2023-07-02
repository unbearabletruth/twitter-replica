import '../assets/styles/Sidebar.css'
import { Link } from 'react-router-dom';
import logo from '../assets/images/twitter-icon.svg'
import { getUserName, getProfilePicUrl } from '../firebase/connection';
import { useEffect, useState, useRef } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { signIn, signOutUser } from "../firebase/connection";
import uniqid from "uniqid";


function Sidebar({userState}) {
  const tabs = ['home', 'explore', 'notifications',
                'messages', 'lists', 'bookmarks', 'verified']
  const [loginWindow, setLoginWindow] = useState(false)
  const loginPopupWindow = useRef(null);
  const [selected, setSelected] = useState(null)
  

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

  const handleSelected = (e) => {
    setSelected(e.currentTarget.id)
  }

  const loginPopup = () => {
    setLoginWindow(true)
  }
  console.log(selected)
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
                className={`sidebarLink ${selected === `${tab}Link` ? 'active' : ''}`}  
                id={`${tab}Link`}
                onClick={handleSelected}
                >
                <div className='sidebarLinkWrapper'>
                  <div className='sidebarLinkContent'>
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </div>
                </div>
              </Link>
            )
          })}
          <Link 
            to={userState ? `/profile/${userState.profileName}` : "/profile"} 
            className={`sidebarLink ${selected === `profileLink` ? 'active' : ''}`}  
            id='profileLink'
            onClick={handleSelected}
            >
            <div className='sidebarLinkWrapper'>
              <div className='sidebarLinkContent'>
                Profile
              </div>
            </div>
          </Link>
          <div 
            className={`sidebarLink ${selected === `moreLink` ? 'active' : ''}`}  
            id='moreLink'
            onClick={handleSelected}
            >
            <div className='sidebarLinkWrapper'>
              <div className='sidebarLinkContent'>
                More
              </div>
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