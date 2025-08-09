

// ********************* TO BE COMPLETED *****************/
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";

function Signup(){
    const navigate = useNavigate("")

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

  return (<>
    <div style={{ maxWidth: "400px", margin: "40px auto", textAlign: "center" }}>
      <h1>Signup</h1>

      <form onSubmit={handleSubmit}>
        {/* Name */}
        <div style={{ marginBottom: "15px" }}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
            style={{ padding: "10px", width: "100%" }}
          />
        </div>

        {/* Email */}
        <div style={{ marginBottom: "15px" }}>
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
            style={{ padding: "10px", width: "100%" }}
          />
        </div>

        {/* Password */}
        <div style={{ marginBottom: "15px" }}>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            style={{ padding: "10px", width: "100%" }}
          />
        </div>

        {/* Submit button */}
        <button
          type="submit"
          style={{
            padding: "10px 20px",
            background: "#4CAF50",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          Sign Up
        </button>
      </form>

      {/* Back button */}
      <button
        onClick={() => navigate("/")}
        style={{
          marginTop: "15px",
          padding: "10px 20px",
          background: "#f44336",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer"
        }}
      >
        ✖️
      </button>
    </div>
    </>
)
}

export default Signup