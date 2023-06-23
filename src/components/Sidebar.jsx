import '../assets/styles/Sidebar.css'
import { Link } from 'react-router-dom';
import logo from '../assets/images/twitter-icon.svg'

function Sidebar() {
  return(
    <div id="sidebar">
      <img 
        src={logo} 
        alt='logo'
        id='sidebarLogo'
      >
      </img>
      <div className="sidebarLinks">
        <Link to="/" className="sidebarLink">Home</Link>
        <Link to="/explore" className="sidebarLink">Explore</Link>
        <Link to="/notifications" className="sidebarLink">Notifications</Link>
        <Link to="/messages" className="sidebarLink">Messages</Link>
        <Link to="/lists" className="sidebarLink">Lists</Link>
        <Link to="/bookmarks" className="sidebarLink">Bookmarks</Link>
        <Link to="/verified" className="sidebarLink">Verified</Link>
        <Link to="/profile" className="sidebarLink">Profile</Link>
        <div className="sidebarLink">More</div>
        <Link to="/compose" id='composeTweet'></Link>
      </div>
      <div className="sidebarUserInfo">
        <img></img>
        <div>
          <p>Name</p>
          <p>profile name</p>
        </div>
        <img></img>
      </div>
    </div>
  )
}

export default Sidebar;