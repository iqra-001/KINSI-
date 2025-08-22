import { useNavigate } from "react-router-dom";
import  { useState } from "react";


function Signup(){
  const [isSignUp, setIsSignUp] = useState(true);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isSignUp ? "/api/signup" : "/api/login";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const result = await response.json();

      if (!response.ok) {
        alert(result.message || "Something went wrong");
      } else {
        alert(isSignUp ? "Signup successful!" : "Login successful!");
        // You can redirect or store tokens here
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Server error, please try again later.");
    }
  };
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-orange-100 to-orange-200 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        {/* Logo / Title */}
        <div className="text-center mb-6">
          <div className="text-3xl font-bold text-orange-600">KINSI</div>
          <p className="text-gray-500 mt-1">
            {isSignUp ? "Create your account" : "Welcome back"}
          </p>
        </div>

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          {isSignUp && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          {isSignUp && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-3 rounded-lg font-medium hover:bg-orange-600 transition duration-200 shadow-md"
          >
            {isSignUp ? "Sign Up" : "Log In"}
          </button>
        </form>

        {/* Extra options */}
        <div className="mt-4 text-center text-sm">
          {isSignUp ? (
            <p>
              Already have an account? {" "}
              <button
                onClick={() => setIsSignUp(false)}
                className="text-orange-600 font-medium hover:underline"
              >
                Log In
              </button>
            </p>
          ) : (
            <p>
              Don’t have an account? {" "}
              <button
                onClick={() => setIsSignUp(true)}
                className="text-orange-600 font-medium hover:underline"
              >
                Sign Up
              </button>
            </p>
          )}
        </div>

        {/* Forgot Password */}
        {!isSignUp && (
          <div className="mt-4 text-center">
            <button className="text-sm text-gray-500 hover:underline">
              Forgot password?
            </button>
          </div>
        )}

         {/* Return to Home */}
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate("/")}
            className="text-sm text-gray-600 hover:underline"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}


export default Signup
