import { useState, useEffect, useRef } from "react";
import { query, collection, onSnapshot, where, and } from 'firebase/firestore';
import { db } from "../firebase/connection";
import '../assets/styles/Search.css'
import searchIcon from '../assets/images/search.svg'
import profileIcon from '../assets/images/sidebar/profile.png'
import { useNavigate } from "react-router-dom";

function Search({userState}){
  const [input, setInput] = useState('')
  const [results, setResults] = useState()
  const [searchPopup, setSearchPopup] = useState(false)
  const searchPopupRef = useRef(null)
  const search = useRef(null)
  const [searchActive, setSearchActive] = useState(false)
  const navigate = useNavigate();

  useEffect(() => {
    let lowerCase = input.toLowerCase()
    console.log(lowerCase)
    if(input.length > 0){
      const q = query(collection(db, "users"), 
                      and(where("lowercaseProfileName", '>=', lowerCase),
                          where("lowercaseProfileName", '<', `${lowerCase}\uf7ff`)));
      async function getUsers(){
        onSnapshot(q, (snapshot) => {
          let users = [];
          snapshot.forEach(doc => {
              let user = doc.data()
              users.push(user)
          })
          setResults(users)
        });
      }
      getUsers()
    } else{
      setResults()
    }
  }, [input])

  useEffect(() => {
    function handleClickOutside(e) {
      if (searchPopupRef.current && !searchPopupRef.current.contains(e.target)){
        setSearchPopup(false)
        setSearchActive(false)
      }
    }
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [searchPopupRef]);

  const handleInput = (e) => {
    setInput(e.target.value)
  }

  const handlePopup = () => {
    setSearchPopup(true)
    search.current.focus()
    setSearchActive(true)
  }

  const navigateProfile = (profileName) => {
    navigate(`/profile/${profileName}`)
    setInput('')
  }

  return(
    <div id="searchWrapper">
      <div id="searchBar" onClick={handlePopup} ref={searchPopupRef}>
        <div id="searchIconWrapper" className={searchActive ? 'active' : ''}>
          <img src={searchIcon} alt="search" id="searchIcon"></img>
        </div>
        <input 
          type='search' 
          id='search' 
          placeholder='Search Twitter'
          onChange={handleInput}
          autoComplete="off"
          ref={search}
          className={searchActive ? 'active' : ''}
          value={input}
        >
        </input>
      </div>
      {results && searchPopup ?
        <div id="searchResultsWrapper">
          {results.map(result => {
            return(
              <div key={result.uid} className="searchResult" onClick={() => navigateProfile(result.profileName)}>
                <img src={result.profilePic} className="searchResultProfilePicture"></img>
                <div className="searchResultNameBlock">
                  <span className="searchResultRealName">{result.realName}</span>
                  <span className="searchResultProfileName">{`@${result.profileName}`}</span>
                  {userState && userState.following.includes(result.profileName) ?
                    <div className="searchResultFollowingBlock">
                      <img src={profileIcon} alt="icon" className="searchResultFollowingIcon"></img>
                      <span className="searchResultFollowing">Following</span>
                    </div>
                    :
                    null
                  }
                </div>
              </div>
            )
          }
          )}
        </div>
      : searchPopup ?
        <div id="searchNoResultsWrapper">
          Try searching for people
        </div>
        :
        null
      }
    </div>
  )
}

export default Search;