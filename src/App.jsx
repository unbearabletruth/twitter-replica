import { useState, useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth';
import './App.css'
import Sidebar from './components/Sidebar';
import Content from './components/Content';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { db, auth } from './firebase/connection';
import Login from './components/Login';
import { doc, onSnapshot } from 'firebase/firestore';

function App() {
  const [userState, setUserState] = useState()

  useEffect(() => {
    let unsubscribe;
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        unsubscribe = onSnapshot(docRef, (doc) => {
          //console.log(user.uid);   sometimes onSnapshot gets wrong user data on follow 
          //console.log(doc.data().uid);
          setUserState(doc.data());
        });
      } else {
        setUserState(false);
      }
    });
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
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
