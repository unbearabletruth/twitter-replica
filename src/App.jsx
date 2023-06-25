import { useState } from 'react'

import './App.css'
import Sidebar from './components/Sidebar';
import Content from './components/Content';
import { BrowserRouter } from 'react-router-dom';


function App() {
  return (
    <BrowserRouter>
      <Sidebar/>
      <Content/>
    </BrowserRouter>
  )
}

export default App
