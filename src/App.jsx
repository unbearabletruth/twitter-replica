import { useState, useEffect } from 'react'
import { onAuthStateChanged, getAuth } from 'firebase/auth';
import './App.css'
import Sidebar from './components/Sidebar';
import Content from './components/Content';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { getCurrentUser, db } from './firebase/connection';
import Login from './components/Login';
import { query, collection, where, onSnapshot } from 'firebase/firestore';

function App() {
  const [userState, setUserState] = useState()

  useEffect(() => {
    const isUser = onAuthStateChanged(getAuth(), user => {
    if(user){
      const q = query(collection(db, "users"), where("uid", "==", getAuth().currentUser.uid));
      onSnapshot(q, (snapshot) => {
          snapshot.forEach(doc => {
              let user = doc.data()
              setUserState(user)
          })
      });
        /*async function getUser(){
          const userPromise = getCurrentUser(db, getAuth().currentUser.uid);
          const user = await userPromise;
          setUserState(user[0])
        }
        getUser()*/
    }else{
        setUserState(false);
      }
    });

    return () => isUser();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/*' element={<><Sidebar userState={userState}/>
                                    <Content userState={userState}/></>} />
        <Route path="/login" element={<Login />} />                            
      </Routes>
    </BrowserRouter>
  )
}

export default App
