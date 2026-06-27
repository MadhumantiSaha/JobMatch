import React, { useState } from "react";
import "../App.css";
import { Link } from "react-router-dom";

const Register = () => {
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

    // Create FormData for file upload
    const data = new FormData();
    data.append("name", formData.name);
    data.append("contact", formData.contact);
    data.append("email", formData.email);
    data.append("password", formData.password);
    data.append("role", formData.role);

    // Here you can send data to backend using axios or fetch
    try {
      const response = await fetch(
        "http://localhost:8080/user",
        {
          method: "POST",
          body: data,
        }
      );
      if (!response.ok) {
        const text = await response.text();
        console.log(text);
        return;
      }

      const result = await response.json();


      if (response.ok) {
        console.log("Registration successful:", result);
        alert("Registration successful!");
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
    <div className="register-container">
      <div className="register-card">
        <h2>Create Account</h2>
        {/* <p>Register!</p> */}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Contact Number</label>
            <input
              type="tel"
              name="contact"
              placeholder="Enter your contact number"
              value={formData.contact}
              onChange={handleChange}
              required
            />
          </div>

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
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="job_seeker">Job Seeker</option>
              <option value="job_provider">Job Provider</option>
            </select>
          </div>

          <button type="submit" className="register-btn">
            Register
          </button>
          
          <div className="auth-footer">
            Already Registered?{" "}
            <Link to="/login">
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;