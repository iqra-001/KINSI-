import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import KinsiLandingPage from './Components/Landing';
import LocalVendorsPage from './Components/LocalVendors';
import AboutUsPage from './Components/AboutUs';
import ModernSignup from './Components/Signup';
import KinsiDashboard from './Components/UserDashBoard';
import VisionsPage from './Components/VisionsPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<KinsiLandingPage/>} />
        <Route path = "/localvendors" element = {<LocalVendorsPage/>}/>
        <Route path="/signup" element={<ModernSignup />} />
        <Route path = "/aboutus" element = { <AboutUsPage/>}/>
        <Route path = "userdashboard" element = {<KinsiDashboard/>}/>
        <Route path = "/visionspage" element = {<VisionsPage/>}/>
       
      </Routes>
    </Router>  
  )
}

export default App
