import { useState, useEffect, useRef } from "react";
import { query, collection, onSnapshot, orderBy, where, and } from 'firebase/firestore';
import { db } from "../firebase/connection";

function Search(){
  const [input, setInput] = useState('')
  const [results, setResults] = useState()
  const [searchPopup, setSearchPopup] = useState(false)
  const searchPopupRef = useRef(null)

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
    setSearchPopup(!searchPopup)
  }
  console.log(searchPopup)
  return(
    <div id="searchWrapper">
      <input 
        type='search' 
        id='search' 
        placeholder='Search Twitter'
        onChange={handleInput}
        autoComplete="off"
        ref={searchPopupRef}
        onClick={handlePopup}
      >
      </input>
      {results && searchPopup ?
        <div id="searchResultsWrapper">
          {results.map(result => {
            return(
              <div key={result.uid} className="searchResult">
                <img src={result.profilePic} className="searchResultProfilePicture"></img>
                <div className="searchResultNameBlock">
                  <span>{result.realName}</span>
                  <span>{result.profileName}</span>
                </div>
              </div>
            )
          }
          )}
        </div>
      : searchPopup ?
        <div id="searchResultsWrapper">
          Try searching for people
        </div>
        :
        null
      }
    </div>
  )
}

export default Search;