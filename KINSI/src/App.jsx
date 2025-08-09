import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import Signup from "./Components/Signup"
import KinsiLandingPage from './Components/Landing';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<KinsiLandingPage/>} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>  
  )
}

export default App
