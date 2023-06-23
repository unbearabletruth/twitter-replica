import { useState } from 'react'

import './App.css'
import Sidebar from './components/Sidebar';
import Main from './components/Main';
import { BrowserRouter } from 'react-router-dom';


function App() {
  return (
    <BrowserRouter>
      <Sidebar/>
      <Main/>
    </BrowserRouter>
  )
}

export default App
