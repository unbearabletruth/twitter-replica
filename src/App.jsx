import { useState, useEffect } from 'react'
import { onAuthStateChanged, getAuth } from 'firebase/auth';
import './App.css'
import Sidebar from './components/Sidebar';
import Content from './components/Content';
import { BrowserRouter } from 'react-router-dom';
import { getCurrentUser, db } from './firebase/connection';


function App() {
  const [userState, setUserState] = useState()

  useEffect(() => {
    const isUser = onAuthStateChanged(getAuth(), user => {
    if(user){
        async function getUser(){
          const userPromise = getCurrentUser(db, getAuth().currentUser.uid);
          const user = await userPromise;
          setUserState(user[0])
        }
        getUser()
    }else{
        setUserState(false);
      }
    });

    return () => isUser();
  }, []);

  return (
    <BrowserRouter>
      <Sidebar userState={userState}/>
      <Content userState={userState}/>
    </BrowserRouter>
  )
}

export default App
