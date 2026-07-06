import React, { useState } from "react";
import "../App.css";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:8080/user/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const result = await response.json();

      console.log("Login Response:", result);

      if (response.ok && result.success) {
        localStorage.setItem("token", result.token);

        localStorage.setItem(
          "user",
          JSON.stringify(result.data)
        );

        // Store the role separately
        localStorage.setItem(
          "role",
          result.data.role
        );

        alert("Login Successful!");
        navigate("/dashboard");
      } else {
        alert(result.Error || result.message || "Invalid credentials");
      }
    } catch (error) {
      console.error("Login Error:", error);
      alert("Something went wrong!");
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2>Welcome Back</h2>
        <p>Login to continue.</p>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="forgot-password">
            <Link to="/forget-password">
              Forgot Password?
            </Link>
          </div>

          <button type="submit" className="register-btn">
            Login
          </button>

          <div className="login-footer">
            Don't have an account?{" "}
            <Link to="/register">Register</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;