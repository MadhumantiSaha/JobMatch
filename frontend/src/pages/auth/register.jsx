import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../config";
import logo from "../../assets/logo.png";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    email: "",
    password: "",
    role: "job_seeker",
    profilePicture: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Registration Data:", formData);

    const data = new FormData();
    data.append("name", formData.name);
    data.append("contact", formData.contact);
    data.append("email", formData.email);
    data.append("password", formData.password);
    data.append("role", formData.role);

    try {
      const response = await fetch(`${API_BASE_URL}/user`, {
        method: "POST",
        body: data,
      });
      if (!response.ok) {
        const text = await response.text();
        console.log(text);
        alert("Registration failed");
        return;
      }

      const result = await response.json();

      if (response.ok) {
        console.log("Registration successful:", result);
        alert("Registration successful!");
        navigate("/login");
      } else {
        console.log("Error:", result);
        alert(result.message || "Registration failed");
      }
    } catch (error) {
      console.error("Error:", error);
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
          <h1>Join JobMatch today</h1>
          <p>
            Whether you&apos;re hunting for your next role or hiring top talent —
            get started in minutes.
          </p>
          <ul className="auth-brand-points">
            <li>Free account for job seekers</li>
            <li>Post jobs and manage applicants</li>
            <li>Built-in messaging &amp; tracking</li>
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

          <h2>Create Account</h2>
          <p className="auth-card-sub">
            Fill in your details to get started
          </p>

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                placeholder="Jane Doe"
                value={formData.name}
                onChange={handleChange}
                required
                autoComplete="name"
              />
            </div>

            <div className="input-group">
              <label>Contact Number</label>
              <input
                type="tel"
                name="contact"
                placeholder="+91 98765 43210"
                value={formData.contact}
                onChange={handleChange}
                required
                autoComplete="tel"
              />
            </div>

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
                placeholder="Create a strong password"
                value={formData.password}
                onChange={handleChange}
                required
                autoComplete="new-password"
              />
            </div>

            <div className="input-group">
              <label>I am a</label>
              <div className="role-toggle">
                <label>
                  <input
                    type="radio"
                    name="role"
                    value="job_seeker"
                    checked={formData.role === "job_seeker"}
                    onChange={handleChange}
                  />
                  <span>Job Seeker</span>
                </label>
                <label>
                  <input
                    type="radio"
                    name="role"
                    value="job_provider"
                    checked={formData.role === "job_provider"}
                    onChange={handleChange}
                  />
                  <span>Job Provider</span>
                </label>
              </div>
            </div>

            <button type="submit" className="register-btn">
              Create Account
            </button>

            <div className="auth-footer">
              Already have an account?
              <Link to="/login">Sign in</Link>
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

export default Register;
