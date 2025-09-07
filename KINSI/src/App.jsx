import React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";

// Pages
import KinsiLandingPage from "./Components/Landing";
import LocalVendorsPage from "./Components/LocalVendors";
import AboutUsPage from "./Components/AboutUs";
import ModernSignup from "./Components/Signup";
import KinsiDashboard from "./Components/UserDashBoard";
import VisionsPage from "./Components/VisionsPage";
import VendorDashboard from "./Components/VendorDashBoard";
import ModernLogin from "./Components/LogIn";
import ProtectedRoute from "./Components/ProtectedRoute";
import LogoutButton from "./Components/LogOutButton";

// Optional Unauthorized page
const Unauthorized = () => (
  <div className="flex items-center justify-center h-screen">
    <h1 className="text-2xl font-bold">Unauthorized Access</h1>
  </div>
);

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<KinsiLandingPage />} />
      <Route path="/signup" element={<ModernSignup />} />
      <Route path="/signin" element={<ModernLogin />} />
      <Route path="/aboutus" element={<AboutUsPage />} />
      <Route path="/visionspage" element={<VisionsPage />} />
      <Route path="/localvendors" element={<LocalVendorsPage />} />
      <Route path= "/logout" element = {<LogoutButton/>}/>
      {/* Unauthorized Fallback */}
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute allowedRoles={["user"]} />}>
        <Route path="/userdashboard" element={<KinsiDashboard />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["vendor"]} />}>
        <Route path="/vendorpage" element={<VendorDashboard />} />
      </Route>
    </Routes>
  );
}

export default App;
