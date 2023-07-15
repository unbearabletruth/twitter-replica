import { useState, useEffect } from "react";
import { query, collection, onSnapshot, orderBy, where, and } from 'firebase/firestore';
import { db } from "../firebase/connection";

function Search(){
  const [input, setInput] = useState('')
  const [results, setResults] = useState()

  useEffect(() => {
    let lowerCase = input.toLowerCase()
    console.log(lowerCase)
    if(input.length >= 2){
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
    }
  }, [input])

  const handleInput = (e) => {
    setInput(e.target.value)
  }

  return(
    <>
      <input 
        type='search' 
        id='search' 
        placeholder='Search Twitter'
        onChange={handleInput}
      >
      </input>
      <div id="searchResultsWrapper">
        {results ?
          <>
            {results.map(result => {
              return(
                <div key={result.uid}>{result.realName}</div>
              )
            }
            )}
          </>
        :
        null
        }
      </div>
    </>
  )
}

export default Search;