import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // ✅ routing
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowLeft,
  Sparkles,
  ChevronRight,
  CheckCircle,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext"; // ✅ context
import { GoogleLogin } from "@react-oauth/google"; // ✅ Google button

function ModernLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const { setCurrentUser } = useAuth();
  const navigate = useNavigate();

  // Handle form input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle email/password login
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      alert("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("http://localhost:5555/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.error || "Login failed");
        setLoading(false);
        return;
      }

      const data = await res.json();

      // Save token & user info
      localStorage.setItem("accessToken", data.access_token);
      localStorage.setItem("role", data.user.role);
      localStorage.setItem("user_id", data.user.id);
      localStorage.setItem("username", data.user.username);

      // Update AuthContext
      setCurrentUser({
        role: data.user.role,
        userId: data.user.id,
        username: data.user.username,
      });

      alert("Login successful! 🎉");

      // Redirect based on role
      if (data.user.role === "user") {
        navigate("/userdashboard");
      } else if (data.user.role === "vendor") {
        navigate("/vendorpage");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Google login
  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const token = credentialResponse.credential;
      if (!token) {
        alert("Google login failed. Try again.");
        return;
      }

      const res = await fetch("http://localhost:5555/auth/google-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.error || "Google login failed");
        return;
      }

      const data = await res.json();

      // Save token & user info
      localStorage.setItem("accessToken", data.access_token);
      localStorage.setItem("role", data.user.role);
      localStorage.setItem("user_id", data.user.id);
      localStorage.setItem("username", data.user.username);

      setCurrentUser({
        role: data.user.role,
        userId: data.user.id,
        username: data.user.username,
      });

      alert("Google login successful! 🎉");

      if (data.user.role === "user") {
        navigate("/userdashboard");
      } else if (data.user.role === "vendor") {
        navigate("/vendorpage");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error("Google login error:", err);
      alert("Google login failed. Please try again.");
    }
  };

  // Placeholder for Facebook (no backend endpoint yet)
  const handleFacebookSuccess = () => {
    alert("Facebook login not implemented yet");
  };

  const navigateHome = () => {
    console.log("Navigate to home");
  };

  const navigateSignup = () => {
    console.log("Navigate to signup");
  };
  {
    return (
    <div 
      className="min-h-screen flex relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #F5F1E8 0%, #E8E0D4 100%)' }}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-20 h-20 bg-green-200 rounded-full opacity-20 animate-bounce" style={{ animationDelay: '0s' }}></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-orange-200 rounded-full opacity-30 animate-bounce" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-40 left-20 w-12 h-12 bg-green-300 rounded-full opacity-25 animate-bounce" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 right-10 w-14 h-14 bg-amber-200 rounded-full opacity-20 animate-bounce" style={{ animationDelay: '3s' }}></div>
      </div>

      {/* Back Button */}
      <button
        onClick={navigateHome}
        className="absolute top-8 left-8 flex items-center gap-2 text-amber-900 hover:text-orange-500 transition-colors duration-300 font-medium z-20 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Home
      </button>

      {/* Left Side - SVG Illustration */}
      <div className="flex-1 flex items-center justify-center p-8 relative">
        <div className="max-w-lg w-full">
          {/* Login-themed SVG Illustration */}
          <svg
            viewBox="0 0 500 400"
            className="w-full h-auto"
            style={{ animation: 'float 6s ease-in-out infinite' }}
          >
            {/* Background Circle */}
            <circle cx="250" cy="200" r="180" fill="url(#bgGradient)" opacity="0.1"/>
            
            {/* Welcome Back Illustration - Calendar/Event Management Theme */}
            <rect x="120" y="100" width="260" height="200" rx="25" fill="white" stroke="url(#borderGradient)" strokeWidth="3"/>
            
            {/* Calendar Header */}
            <rect x="120" y="100" width="260" height="50" rx="25" fill="url(#headerGradient)"/>
            <text x="250" y="130" textAnchor="middle" fontSize="18" fill="white" fontWeight="bold">Welcome Back!</text>
            
            {/* Calendar Grid */}
            <rect x="140" y="170" width="35" height="30" rx="5" fill="url(#dayGradient1)"/>
            <rect x="185" y="170" width="35" height="30" rx="5" fill="url(#dayGradient2)"/>
            <rect x="230" y="170" width="35" height="30" rx="5" fill="url(#dayGradient3)"/>
            <rect x="275" y="170" width="35" height="30" rx="5" fill="url(#dayGradient4)"/>
            <rect x="320" y="170" width="35" height="30" rx="5" fill="url(#dayGradient5)"/>
            
            <rect x="140" y="210" width="35" height="30" rx="5" fill="url(#dayGradient6)"/>
            <rect x="185" y="210" width="35" height="30" rx="5" fill="url(#activeGradient)"/>
            <rect x="230" y="210" width="35" height="30" rx="5" fill="url(#dayGradient7)"/>
            <rect x="275" y="210" width="35" height="30" rx="5" fill="url(#dayGradient8)"/>
            <rect x="320" y="210" width="35" height="30" rx="5" fill="url(#dayGradient9)"/>
            
            <rect x="140" y="250" width="35" height="30" rx="5" fill="url(#dayGradient10)"/>
            <rect x="185" y="250" width="35" height="30" rx="5" fill="url(#dayGradient11)"/>
            <rect x="230" y="250" width="35" height="30" rx="5" fill="url(#dayGradient12)"/>
            <rect x="275" y="250" width="35" height="30" rx="5" fill="url(#dayGradient13)"/>
            <rect x="320" y="250" width="35" height="30" rx="5" fill="url(#dayGradient14)"/>
            
            {/* Event Indicators */}
            <circle cx="157" cy="185" r="3" fill="#FF8A47"/>
            <circle cx="202" cy="225" r="3" fill="#A8D5A8"/>
            <circle cx="247" cy="185" r="3" fill="#FFB366"/>
            <circle cx="292" cy="265" r="3" fill="#FF8A47"/>
            <circle cx="337" cy="225" r="3" fill="#A8D5A8"/>
            
            {/* Today's highlight */}
            <circle cx="202" cy="225" r="12" fill="none" stroke="#FF8A47" strokeWidth="2" strokeDasharray="2,2">
              <animate attributeName="stroke-dashoffset" values="0; -8; 0" dur="3s" repeatCount="indefinite"/>
            </circle>
            
            {/* Floating Success Elements */}
            <g opacity="0.8">
              <circle cx="80" cy="150" r="20" fill="url(#successGradient)">
                <animateTransform attributeName="transform" type="translate" values="0,0; 0,-15; 0,0" dur="4s" repeatCount="indefinite"/>
              </circle>
              <text x="80" y="156" textAnchor="middle" fontSize="16" fill="white">✓</text>
            </g>
            
            <g opacity="0.7">
              <circle cx="420" cy="180" r="15" fill="url(#calendarGradient)">
                <animateTransform attributeName="transform" type="translate" values="0,0; 0,10; 0,0" dur="3.5s" repeatCount="indefinite"/>
              </circle>
              <text x="420" y="186" textAnchor="middle" fontSize="14" fill="white">📅</text>
            </g>
            
            {/* Connecting Lines */}
            <path d="M380 200 Q420 220 440 280" stroke="url(#flowGradient)" strokeWidth="2" fill="none" opacity="0.6" strokeDasharray="3,3">
              <animate attributeName="stroke-dashoffset" values="0; -12; 0" dur="2.5s" repeatCount="indefinite"/>
            </path>
            
            {/* Success Checkmarks */}
            <g opacity="0.9">
              <circle cx="450" cy="290" r="18" fill="url(#checkGradient)"/>
              <path d="M443 290 L449 296 L457 284" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            </g>
            
            {/* Floating Sparkles */}
            <g opacity="0.7">
              <path d="M90 280 L95 290 L105 285 L95 295 L90 305 L85 295 L75 285 L85 290 Z" fill="#FF8A47">
                <animateTransform attributeName="transform" type="rotate" values="0 90 285; 360 90 285" dur="8s" repeatCount="indefinite"/>
              </path>
            </g>
            <g opacity="0.6">
              <path d="M400 120 L403 126 L409 123 L403 129 L400 135 L397 129 L391 123 L397 126 Z" fill="#A8D5A8">
                <animateTransform attributeName="transform" type="rotate" values="0 400 123; 360 400 123" dur="6s" repeatCount="indefinite"/>
              </path>
            </g>
            
            {/* Progress Indicator */}
            <rect x="140" y="320" width="220" height="8" rx="4" fill="#F0F9FF"/>
            <rect x="140" y="320" width="165" height="8" rx="4" fill="url(#progressGradient)">
              <animate attributeName="width" values="0; 165; 0" dur="4s" repeatCount="indefinite"/>
            </rect>
            
            {/* Gradient Definitions */}
            <defs>
              <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FF8A47"/>
                <stop offset="100%" stopColor="#A8D5A8"/>
              </linearGradient>
              <linearGradient id="borderGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FF8A47" stopOpacity="0.3"/>
                <stop offset="100%" stopColor="#A8D5A8" stopOpacity="0.3"/>
              </linearGradient>
              <linearGradient id="headerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FF8A47"/>
                <stop offset="100%" stopColor="#FFB366"/>
              </linearGradient>
              <linearGradient id="activeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FF8A47" stopOpacity="0.3"/>
                <stop offset="100%" stopColor="#FFB366" stopOpacity="0.3"/>
              </linearGradient>
              <linearGradient id="successGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#A8D5A8"/>
                <stop offset="100%" stopColor="#85C785"/>
              </linearGradient>
              <linearGradient id="calendarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFB366"/>
                <stop offset="100%" stopColor="#FF8A47"/>
              </linearGradient>
              <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#A8D5A8"/>
                <stop offset="100%" stopColor="#FF8A47"/>
              </linearGradient>
              <linearGradient id="checkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#A8D5A8"/>
                <stop offset="100%" stopColor="#6BB66B"/>
              </linearGradient>
              <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#A8D5A8"/>
                <stop offset="100%" stopColor="#FF8A47"/>
              </linearGradient>
              
              {/* Day gradients */}
              <linearGradient id="dayGradient1"><stop offset="0%" stopColor="#FEF7F0"/><stop offset="100%" stopColor="#F0F9FF"/></linearGradient>
              <linearGradient id="dayGradient2"><stop offset="0%" stopColor="#F0FDF4"/><stop offset="100%" stopColor="#FEF7F0"/></linearGradient>
              <linearGradient id="dayGradient3"><stop offset="0%" stopColor="#FFFBEB"/><stop offset="100%" stopColor="#F0F9FF"/></linearGradient>
              <linearGradient id="dayGradient4"><stop offset="0%" stopColor="#F0F9FF"/><stop offset="100%" stopColor="#F0FDF4"/></linearGradient>
              <linearGradient id="dayGradient5"><stop offset="0%" stopColor="#FEF7F0"/><stop offset="100%" stopColor="#FFFBEB"/></linearGradient>
              <linearGradient id="dayGradient6"><stop offset="0%" stopColor="#F0FDF4"/><stop offset="100%" stopColor="#FEF7F0"/></linearGradient>
              <linearGradient id="dayGradient7"><stop offset="0%" stopColor="#FFFBEB"/><stop offset="100%" stopColor="#F0FDF4"/></linearGradient>
              <linearGradient id="dayGradient8"><stop offset="0%" stopColor="#F0F9FF"/><stop offset="100%" stopColor="#FFFBEB"/></linearGradient>
              <linearGradient id="dayGradient9"><stop offset="0%" stopColor="#FEF7F0"/><stop offset="100%" stopColor="#F0F9FF"/></linearGradient>
              <linearGradient id="dayGradient10"><stop offset="0%" stopColor="#F0FDF4"/><stop offset="100%" stopColor="#FEF7F0"/></linearGradient>
              <linearGradient id="dayGradient11"><stop offset="0%" stopColor="#FFFBEB"/><stop offset="100%" stopColor="#F0FDF4"/></linearGradient>
              <linearGradient id="dayGradient12"><stop offset="0%" stopColor="#F0F9FF"/><stop offset="100%" stopColor="#FFFBEB"/></linearGradient>
              <linearGradient id="dayGradient13"><stop offset="0%" stopColor="#FEF7F0"/><stop offset="100%" stopColor="#F0F9FF"/></linearGradient>
              <linearGradient id="dayGradient14"><stop offset="0%" stopColor="#F0FDF4"/><stop offset="100%" stopColor="#FEF7F0"/></linearGradient>
            </defs>
          </svg>
          
          {/* Text below SVG */}
          <div className="text-center mt-8">
            <h2 className="text-3xl font-black mb-4" style={{ color: '#3D2914' }}>
              Continue Your
              <span className="bg-gradient-to-r from-orange-500 to-green-400 bg-clip-text text-transparent block">
                Event Journey
              </span>
            </h2>
            <p className="text-lg leading-relaxed" style={{ color: '#8B6F47' }}>
              Welcome back! Your perfectly planned events and trusted vendor connections are waiting for you.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-md w-full">
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div 
                className="w-12 h-12 bg-gradient-to-r from-orange-500 to-green-400 rounded-2xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #FF8A47, #A8D5A8)' }}
              >
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-black" style={{ color: '#3D2914' }}>
                  Welcome Back
                </h1>
              </div>
            </div>
            <p className="text-xl" style={{ color: '#8B6F47' }}>
              Sign in to continue planning amazing events
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Email Field */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none z-10">
                <Mail className="w-5 h-5 transition-colors duration-300 group-focus-within:text-orange-500" style={{ color: '#8B6F47' }} />
              </div>
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full pl-8 pr-0 py-4 bg-transparent border-0 border-b-2 border-green-200 focus:border-orange-400 focus:outline-none transition-colors duration-300 text-lg placeholder-gray-400"
                style={{ color: '#3D2914' }}
              />
            </div>

            {/* Password Field */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none z-10">
                <Lock className="w-5 h-5 transition-colors duration-300 group-focus-within:text-orange-500" style={{ color: '#8B6F47' }} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full pl-8 pr-8 py-4 bg-transparent border-0 border-b-2 border-green-200 focus:border-orange-400 focus:outline-none transition-colors duration-300 text-lg placeholder-gray-400"
                style={{ color: '#3D2914' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center transition-colors duration-300 hover:text-orange-500"
                style={{ color: '#8B6F47' }}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Forgot Password Link */}
            <div className="text-right">
              <button
                type="button"
                className="text-sm transition-colors duration-300 hover:text-orange-500"
                style={{ color: '#8B6F47' }}
              >
                Forgot your password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="group w-full flex items-center justify-center gap-3 text-white py-4 rounded-2xl text-lg font-bold transition-all duration-300 hover:transform hover:-translate-y-1 shadow-lg hover:shadow-2xl relative overflow-hidden mt-8"
              style={{ 
                background: 'linear-gradient(135deg, #FF8A47 0%, #FF6B2B 100%)',
                boxShadow: '0 8px 25px rgba(255, 138, 71, 0.3)'
              }}
            >
              <span className="relative z-10">Sign In to KINSI</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-8">
            <div className="flex-1 h-px bg-green-200"></div>
            <span className="px-4 text-sm" style={{ color: '#8B6F47' }}>or continue with</span>
            <div className="flex-1 h-px bg-green-200"></div>
          </div>

          {/* OAuth Buttons */}
          <div className="flex flex-col gap-4 mb-6">
            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={() => alert("Google login failed. Please try again.")}
              useOneTap
              render={(renderProps) => (
                <button
                  onClick={renderProps.onClick}
                  disabled={renderProps.disabled}
                  className="flex items-center justify-center gap-3 bg-white border-2 border-gray-300 hover:border-orange-400 px-6 py-3 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md"
                  >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                  <span style={{ color: '#3D2914' }}>Continue with Google</span>
                </button>
              )}/>

            {/* Facebook OAuth Button */}
            <button
              onClick={handleFacebookSuccess}
              className="flex items-center justify-center gap-3 bg-white border-2 border-gray-300 hover:border-blue-500 px-6 py-3 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#1877F2">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span style={{ color: '#3D2914' }}>Continue with Facebook</span>
            </button>
          </div>

          {/* Signup Link */}
          <div className="text-center mt-8">
  <p className="text-lg" style={{ color: '#8B6F47' }}>
    Don't have an account?{' '}
    <Link
      to="/signup"
      className="font-semibold hover:underline transition-all duration-300 underline-offset-4"
      style={{ color: '#FF8A47' }}
    >
      Sign Up
    </Link>
  </p>
</div>

          {/* Trust Indicators */}
          <div className="mt-12 text-center">
            <p className="text-sm mb-4" style={{ color: '#8B6F47' }}>
              Secure login with industry-standard encryption
            </p>
            <div className="flex justify-center items-center gap-8">
              <div className="flex items-center gap-2 text-sm" style={{ color: '#8B6F47' }}>
                <CheckCircle className="w-4 h-4 text-green-500" />
                Secure
              </div>
              <div className="flex items-center gap-2 text-sm" style={{ color: '#8B6F47' }}>
                <CheckCircle className="w-4 h-4 text-green-500" />
                Encrypted
              </div>
              <div className="flex items-center gap-2 text-sm" style={{ color: '#8B6F47' }}>
                <CheckCircle className="w-4 h-4 text-green-500" />
                Protected
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Decorative Elements */}
      <div className="absolute top-1/4 left-1/3 text-2xl opacity-20 animate-pulse pointer-events-none" style={{ animationDelay: '1.5s' }}>🗓️</div>
      <div className="absolute bottom-1/3 right-1/3 text-2xl opacity-25 animate-pulse pointer-events-none" style={{ animationDelay: '2.5s' }}>✅</div>
      <div className="absolute top-2/3 left-1/5 text-2xl opacity-15 animate-pulse pointer-events-none" style={{ animationDelay: '0.5s' }}>🎯</div>

      {/* CSS Animation Styles */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </div>
  );}
}

export default ModernLogin;