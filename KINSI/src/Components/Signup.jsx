import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { Eye, EyeOff, User, Mail, Lock, ArrowLeft, Sparkles } from "lucide-react";

function Signup() {
  const navigate = useNavigate("");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Here you can send data to backend
    alert("Signup successful!");
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #F5F1E8 0%, #E8E0D4 100%)' }}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-20 h-20 bg-green-200 rounded-full opacity-30 animate-bounce" style={{ animationDelay: '0s' }}></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-orange-200 rounded-full opacity-40 animate-bounce" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-40 left-20 w-12 h-12 bg-green-300 rounded-full opacity-50 animate-bounce" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 right-10 w-14 h-14 bg-amber-200 rounded-full opacity-35 animate-bounce" style={{ animationDelay: '3s' }}></div>
      </div>

      {/* Back Button */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 flex items-center gap-2 text-amber-900 hover:text-orange-500 transition-colors duration-300 font-medium z-10"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Home
      </button>

      {/* Signup Card */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div 
          className="bg-white rounded-3xl shadow-2xl p-8 border-4 relative overflow-hidden"
          style={{ 
            borderColor: 'rgba(168, 213, 168, 0.3)',
            animation: 'float 6s ease-in-out infinite'
          }}
        >
          {/* Gradient Border Effect */}
          <div className="absolute -inset-3 bg-gradient-to-r from-green-200 to-orange-200 rounded-3xl opacity-20 -z-10"></div>
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div 
                className="w-16 h-16 bg-gradient-to-r from-orange-500 to-green-400 rounded-full flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #FF8A47, #A8D5A8)' }}
              >
                <Sparkles className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-black mb-2" style={{ color: '#3D2914' }}>
              Join KINSI
            </h1>
            <p className="text-lg" style={{ color: '#8B6F47' }}>
              Start planning your dream events
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="w-5 h-5" style={{ color: '#8B6F47' }} />
              </div>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full pl-12 pr-4 py-4 border-2 border-green-200 rounded-2xl focus:border-orange-400 focus:outline-none transition-colors duration-300 text-lg"
                style={{ 
                  backgroundColor: '#FEF7F0',
                  color: '#3D2914'
                }}
              />
            </div>

            {/* Email Field */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="w-5 h-5" style={{ color: '#8B6F47' }} />
              </div>
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full pl-12 pr-4 py-4 border-2 border-green-200 rounded-2xl focus:border-orange-400 focus:outline-none transition-colors duration-300 text-lg"
                style={{ 
                  backgroundColor: '#FEF7F0',
                  color: '#3D2914'
                }}
              />
            </div>

            {/* Password Field */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="w-5 h-5" style={{ color: '#8B6F47' }} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full pl-12 pr-12 py-4 border-2 border-green-200 rounded-2xl focus:border-orange-400 focus:outline-none transition-colors duration-300 text-lg"
                style={{ 
                  backgroundColor: '#FEF7F0',
                  color: '#3D2914'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center"
                style={{ color: '#8B6F47' }}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full text-white py-4 rounded-2xl text-lg font-bold transition-all duration-300 hover:transform hover:-translate-y-1 shadow-lg hover:shadow-2xl relative overflow-hidden group"
              style={{ 
                background: 'linear-gradient(135deg, #FF8A47 0%, #FF6B2B 100%)',
                boxShadow: '0 8px 25px rgba(255, 138, 71, 0.3)'
              }}
            >
              <span className="relative z-10">Create Your Account</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            </button>
          </form>

          {/* Login Link */}
          <div className="text-center mt-6">
            <p className="text-sm" style={{ color: '#8B6F47' }}>
              Already have an account?{' '}
              <button 
                onClick={() => navigate("/login")}
                className="font-semibold hover:underline transition-all duration-300"
                style={{ color: '#FF8A47' }}
              >
                Sign In
              </button>
            </p>
          </div>
        </div>

        {/* Floating Decorative Elements */}
        <div className="absolute -top-4 -right-4 text-4xl animate-bounce" style={{ animationDelay: '0s' }}>💕</div>
        <div className="absolute top-1/2 -left-6 text-4xl animate-bounce" style={{ animationDelay: '1s' }}>✨</div>
        <div className="absolute -bottom-4 right-8 text-4xl animate-bounce" style={{ animationDelay: '2s' }}>🌿</div>
      </div>

      {/* Additional floating elements for atmosphere */}
      <div className="absolute top-1/4 left-1/4 text-2xl opacity-30 animate-pulse" style={{ animationDelay: '1.5s' }}>🎨</div>
      <div className="absolute bottom-1/3 right-1/4 text-2xl opacity-40 animate-pulse" style={{ animationDelay: '2.5s' }}>💐</div>
      <div className="absolute top-2/3 left-1/6 text-2xl opacity-35 animate-pulse" style={{ animationDelay: '0.5s' }}>🕯️</div>
    </div>
  );
}

export default Signup;