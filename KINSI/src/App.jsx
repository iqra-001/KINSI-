import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import Signup from "./Components/Signup"
import KinsiLandingPage from './Components/Landing';
import VendorHub from './Components/LocalVendors';
import AboutUsPage from './Components/AboutUs';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<KinsiLandingPage/>} />
        <Route path = "/localvendors" element = {<VendorHub/>}/>
        <Route path="/signup" element={<Signup />} />
        <Route path = "/aboutus" element = { <AboutUsPage/>}/>
      </Routes>
    </Router>  
  )
}

export default App
