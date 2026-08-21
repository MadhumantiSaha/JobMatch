import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../config";
import logo from "../../assets/logo.png";

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
      const response = await fetch(`${API_BASE_URL}/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      console.log("Login Response:", result);

      if (response.ok && result.success) {
        localStorage.setItem("token", result.token);
        localStorage.setItem("user", JSON.stringify(result.data));
        localStorage.setItem("role", result.data.role);

        alert("Login Successful!");
        if (result.data.role === "job_seeker") {
          navigate("/jobs");
        } else {
          navigate("/my-jobs");
        }
      } else {
        alert(result.Error || result.message || "Invalid credentials");
      }
    } catch (error) {
      console.error("Login Error:", error);
      alert("Something went wrong!");
    }
  };

  return (
    <div className="register-container has-brand">
      {/* Brand panel — desktop */}
      <aside className="auth-brand-panel">
        <Link to="/">
          <img src={logo} alt="JobMatch" className="auth-brand-logo" />
        </Link>

        <div className="auth-brand-content">
          <h1>Welcome back to JobMatch</h1>
          <p>
            Sign in to continue your job search or manage openings — everything
            in one place.
          </p>
          <ul className="auth-brand-points">
            <li>Smart job matching tailored to you</li>
            <li>Track applications in real time</li>
            <li>Message recruiters instantly</li>
          </ul>
        </div>

        <p className="auth-brand-footer">
          © {new Date().getFullYear()} JobMatch
        </p>
      </aside>

      {/* Form side */}
      <div className="auth-form-side">
        <div className="register-card">
          <div className="auth-card-logo">
            <Link to="/">
              <img src={logo} alt="JobMatch" />
            </Link>
          </div>

          <h2>Welcome Back</h2>
          <p className="auth-card-sub">Sign in to your account to continue</p>

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                autoComplete="email"
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
                autoComplete="current-password"
              />
            </div>

            <div className="forgot-password">
              <Link to="/forget-password">Forgot Password?</Link>
            </div>

            <button type="submit" className="register-btn">
              Sign In
            </button>

            <div className="login-footer">
              Don&apos;t have an account?
              <Link to="/register">Create one</Link>
            </div>
          </form>

          <div className="auth-back-home">
            <Link to="/">← Back to home</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
