import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  User,
  Mail,
  Lock,
  ArrowLeft,
  Sparkles,
  ChevronRight,
  Briefcase,
} from "lucide-react";
import KinsiDashboard from "./UserDashBoard";
import VendorDashboard from "./VendorDashBoard";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../contexts/AuthContext"; // ✅ to update context

function ModernSignup() {
  const [showPassword, setShowPassword] = useState(false);
  const [userRole, setUserRole] = useState("user"); // Default role
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "user",
  });
  const [loading, setLoading] = useState(false);

  const { setCurrentUser } = useAuth();
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle role selection
  const handleRoleChange = (role) => {
    setUserRole(role);
    setFormData({
      ...formData,
      role: role,
    });
  };

  // Submit signup to backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.email || !formData.password) {
      alert("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("http://localhost:5555/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.error || "Signup failed");
        return;
      }

      const data = await res.json();
      alert("Signup successful! 🎉");

      // Save user info locally
      localStorage.setItem("role", data.user.role);
      localStorage.setItem("user_id", data.user.id);
      localStorage.setItem("username", data.user.username);

      // Update AuthContext
      setCurrentUser({
        role: data.user.role,
        userId: data.user.id,
        username: data.user.username,
      });

      // Redirect based on role
      if (data.user.role === "user") {
        navigate("/userdashboard");
      } else if (data.user.role === "vendor") {
        navigate("/vendorpage");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error("Signup error:", err);
      alert("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Google signup
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const token = credentialResponse.credential;
      if (!token) {
        alert("Google signup failed. Try again.");
        return;
      }

      const res = await fetch("http://localhost:5555/api/google-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.error || "Google signup failed");
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

      alert("Google signup successful! 🎉");

      if (data.user.role === "user") {
        navigate("/userdashboard");
      } else if (data.user.role === "vendor") {
        navigate("/vendorpage");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error("Google signup error:", err);
      alert("Google signup failed. Please try again.");
    }
  };

  const handleGoogleError = () => {
    alert("Google signup failed. Please try again.");
  };

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
        onClick={() => navigate("/")}
        className="absolute top-8 left-8 flex items-center gap-2 text-amber-900 hover:text-orange-500 transition-colors duration-300 font-medium z-20 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Home
      </button>

      {/* Left Side - SVG Illustration */}
      <div className="flex-1 flex items-center justify-center p-8 relative">
        <div className="max-w-lg w-full">
          {/* Custom SVG Illustration */}
          <svg
            viewBox="0 0 500 400"
            className="w-full h-auto animate-float"
            style={{ animation: 'float 6s ease-in-out infinite' }}
          >
            {/* Background Circle */}
            <circle cx="250" cy="200" r="180" fill="url(#bgGradient)" opacity="0.1"/>
            
            {/* Main Planning Board */}
            <rect x="150" y="120" width="200" height="160" rx="20" fill="white" stroke="url(#borderGradient)" strokeWidth="2"/>
            
            {/* Pinterest-style Grid */}
            <rect x="170" y="140" width="45" height="45" rx="8" fill="url(#cardGradient1)"/>
            <rect x="225" y="140" width="45" height="45" rx="8" fill="url(#cardGradient2)"/>
            <rect x="280" y="140" width="45" height="45" rx="8" fill="url(#cardGradient3)"/>
            
            <rect x="170" y="195" width="45" height="45" rx="8" fill="url(#cardGradient4)"/>
            <rect x="225" y="195" width="45" height="45" rx="8" fill="url(#cardGradient5)"/>
            <rect x="280" y="195" width="45" height="45" rx="8" fill="url(#cardGradient6)"/>
            
            {/* Floating Elements */}
            <circle cx="120" cy="100" r="8" fill="#FF8A47" opacity="0.7">
              <animateTransform attributeName="transform" type="translate" values="0,0; 0,-10; 0,0" dur="3s" repeatCount="indefinite"/>
            </circle>
            <circle cx="380" cy="120" r="6" fill="#A8D5A8" opacity="0.8">
              <animateTransform attributeName="transform" type="translate" values="0,0; 0,8; 0,0" dur="4s" repeatCount="indefinite"/>
            </circle>
            <circle cx="100" cy="300" r="7" fill="#FFB366" opacity="0.6">
              <animateTransform attributeName="transform" type="translate" values="0,0; 0,-12; 0,0" dur="5s" repeatCount="indefinite"/>
            </circle>
            
            {/* Sparkle Effects */}
            <g opacity="0.8">
              <path d="M320 80 L325 90 L335 85 L325 95 L320 105 L315 95 L305 85 L315 90 Z" fill="#FF8A47">
                <animateTransform attributeName="transform" type="rotate" values="0 320 85; 360 320 85" dur="8s" repeatCount="indefinite"/>
              </path>
            </g>
            <g opacity="0.6">
              <path d="M400 280 L403 286 L409 283 L403 289 L400 295 L397 289 L391 283 L397 286 Z" fill="#A8D5A8">
                <animateTransform attributeName="transform" type="rotate" values="0 400 283; 360 400 283" dur="6s" repeatCount="indefinite"/>
              </path>
            </g>
            
            {/* Event Elements */}
            <circle cx="192" cy="162" r="15" fill="white" opacity="0.9"/>
            <text x="192" y="167" textAnchor="middle" fontSize="16" fill="#FF8A47">🎂</text>
            
            <circle cx="247" cy="162" r="15" fill="white" opacity="0.9"/>
            <text x="247" y="167" textAnchor="middle" fontSize="16" fill="#A8D5A8">💐</text>
            
            <circle cx="302" cy="162" r="15" fill="white" opacity="0.9"/>
            <text x="302" y="167" textAnchor="middle" fontSize="16" fill="#FFB366">✨</text>
            
            <circle cx="192" cy="217" r="15" fill="white" opacity="0.9"/>
            <text x="192" y="222" textAnchor="middle" fontSize="16" fill="#FF8A47">🌿</text>
            
            <circle cx="247" cy="217" r="15" fill="white" opacity="0.9"/>
            <text x="247" y="222" textAnchor="middle" fontSize="16" fill="#A8D5A8">🕯️</text>
            
            <circle cx="302" cy="217" r="15" fill="white" opacity="0.9"/>
            <text x="302" y="222" textAnchor="middle" fontSize="16" fill="#FFB366">💕</text>
            
            {/* Arrow connecting vision to reality */}
            <path d="M360 200 Q400 200 420 230" stroke="url(#arrowGradient)" strokeWidth="3" fill="none" opacity="0.7" strokeDasharray="5,5">
              <animate attributeName="stroke-dashoffset" values="0; -10; 0" dur="2s" repeatCount="indefinite"/>
            </path>
            <polygon points="415,225 420,230 415,235 425,230" fill="#FF8A47" opacity="0.7"/>
            
            {/* Celebration Elements */}
            <circle cx="450" cy="250" r="20" fill="url(#celebrationGradient)" opacity="0.8"/>
            <text x="450" y="257" textAnchor="middle" fontSize="20" fill="white">🎉</text>
            
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
              <linearGradient id="cardGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FEF7F0"/>
                <stop offset="100%" stopColor="#F0F9FF"/>
              </linearGradient>
              <linearGradient id="cardGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F0FDF4"/>
                <stop offset="100%" stopColor="#FEF7F0"/>
              </linearGradient>
              <linearGradient id="cardGradient3" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFBEB"/>
                <stop offset="100%" stopColor="#F0F9FF"/>
              </linearGradient>
              <linearGradient id="cardGradient4" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F0F9FF"/>
                <stop offset="100%" stopColor="#F0FDF4"/>
              </linearGradient>
              <linearGradient id="cardGradient5" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FEF7F0"/>
                <stop offset="100%" stopColor="#FFFBEB"/>
              </linearGradient>
              <linearGradient id="cardGradient6" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F0FDF4"/>
                <stop offset="100%" stopColor="#FEF7F0"/>
              </linearGradient>
              <linearGradient id="arrowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FF8A47"/>
                <stop offset="100%" stopColor="#A8D5A8"/>
              </linearGradient>
              <radialGradient id="celebrationGradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FF8A47"/>
                <stop offset="100%" stopColor="#FFB366"/>
              </radialGradient>
            </defs>
          </svg>
          
          {/* Text below SVG */}
          <div className="text-center mt-8">
            <h2 className="text-3xl font-black mb-4" style={{ color: '#3D2914' }}>
              Transform Your
              <span className="bg-gradient-to-r from-orange-500 to-green-400 bg-clip-text text-transparent block">
                Pinterest Dreams
              </span>
            </h2>
            <p className="text-lg leading-relaxed" style={{ color: '#8B6F47' }}>
              Join thousands who've brought their vision boards to life with KINSI's expert planning and local vendor network.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Signup Form */}
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
                  Join KINSI
                </h1>
              </div>
            </div>
            <p className="text-xl" style={{ color: '#8B6F47' }}>
              Start planning your dream events today
            </p>
          </div>

          {/* Role Selection */}
          <div className="mb-8">
            <label className="block text-lg mb-4" style={{ color: '#3D2914' }}>
              I am signing up as a:
            </label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => handleRoleChange("user")}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 transition-all duration-300 ${
                  userRole === "user" 
                    ? "border-orange-400 bg-orange-50 text-orange-700 shadow-md" 
                    : "border-green-200 bg-transparent text-gray-600 hover:border-orange-300"
                }`}
              >
                <User className="w-5 h-5" />
                <span>Event Planner</span>
              </button>
              <button
                type="button"
                onClick={() => handleRoleChange("vendor")}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 transition-all duration-300 ${
                  userRole === "vendor" 
                    ? "border-orange-400 bg-orange-50 text-orange-700 shadow-md" 
                    : "border-green-200 bg-transparent text-gray-600 hover:border-orange-300"
                }`}
              >
                <Briefcase className="w-5 h-5" />
                <span>Vendor</span>
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Name Field */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none z-10">
                <User className="w-5 h-5 transition-colors duration-300 group-focus-within:text-orange-500" style={{ color: '#8B6F47' }} />
              </div>
              <input
                type="text"
                name="username"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full pl-8 pr-0 py-4 bg-transparent border-0 border-b-2 border-green-200 focus:border-orange-400 focus:outline-none transition-colors duration-300 text-lg placeholder-gray-400"
                style={{ color: '#3D2914' }}
              />
            </div>

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
                minLength="6"
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

            {/* Submit Button */}
            <button
              type="submit"
              className="group w-full flex items-center justify-center gap-3 text-white py-4 rounded-2xl text-lg font-bold transition-all duration-300 hover:transform hover:-translate-y-1 shadow-lg hover:shadow-2xl relative overflow-hidden mt-12"
              style={{ 
                background: 'linear-gradient(135deg, #FF8A47 0%, #FF6B2B 100%)',
                boxShadow: '0 8px 25px rgba(255, 138, 71, 0.3)'
              }}
            >
              <span className="relative z-10">Create Your Account</span>
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

          {/* Google OAuth Button */}
          <div className="flex justify-center mb-6">
            <GoogleLogin 
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              useOneTap={false}
              theme="outline"
              size="large"
              width="384"
              text="signup_with"
            />
          </div>

          {/* Alternative: Your Custom Google Button */}
          {/* Uncomment this if you prefer to use your custom GoogleBtn component */}
          {/* <div className="flex justify-center mb-6">
            <GoogleBtn />
          </div> */}

          {/* Login Link */}
          <div className="text-center mt-8">
  <p className="text-lg" style={{ color: '#8B6F47' }}>
    Already have an account?{' '}
    <Link
      to="/signin"
      className="font-semibold hover:underline transition-all duration-300 underline-offset-4"
      style={{ color: '#FF8A47' }}
    >
      Sign In
    </Link>
  </p>
</div>

          {/* Social Proof */}
          <div className="mt-12 text-center">
            <p className="text-sm mb-4" style={{ color: '#8B6F47' }}>
              Trusted by event planners everywhere
            </p>
            <div className="flex justify-center items-center gap-6">
              <div className="text-center">
                <div className="text-2xl font-black" style={{ color: '#FF8A47' }}>2K+</div>
                <div className="text-xs" style={{ color: '#8B6F47' }}>Happy Clients</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-black" style={{ color: '#FF8A47' }}>500+</div>
                <div className="text-xs" style={{ color: '#8B6F47' }}>Events Planned</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-black" style={{ color: '#FF8A47' }}>98%</div>
                <div className="text-xs" style={{ color: '#8B6F47' }}>Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Decorative Elements */}
      <div className="absolute top-1/4 left-1/3 text-2xl opacity-20 animate-pulse pointer-events-none" style={{ animationDelay: '1.5s' }}>🎨</div>
      <div className="absolute bottom-1/3 right-1/3 text-2xl opacity-25 animate-pulse pointer-events-none" style={{ animationDelay: '2.5s' }}>💐</div>
      <div className="absolute top-2/3 left-1/5 text-2xl opacity-15 animate-pulse pointer-events-none" style={{ animationDelay: '0.5s' }}>🕯️</div>
    </div>
  );
}

export default ModernSignup;