import { useState, useEffect } from 'react'
import { onAuthStateChanged, getAuth } from 'firebase/auth';
import './App.css'
import Sidebar from './components/Sidebar';
import Content from './components/Content';
import { BrowserRouter } from 'react-router-dom';


function App() {
  const [userState, setUserState] = useState()

  useEffect(() => {
    const isUser = onAuthStateChanged(getAuth(), user => {
      console.log("hey")
    if(user){
        setUserState(true);
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
