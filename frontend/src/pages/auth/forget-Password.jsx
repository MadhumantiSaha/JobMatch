import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function ForgetPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        "http://localhost:8080/user/forget-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await res.json();

      if (data.success) {
        alert("OTP sent successfully");
        navigate("/verify-otp", {
          state: { email },
        });
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.log(err);
      alert("Something went wrong");
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2>Forgot Password</h2>
        <p>Enter your email and we'll send you an OTP.</p>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
            />
          </div>

          <button type="submit" className="register-btn">
            Send OTP
          </button>

          <div className="login-footer">
            Remembered your password? <Link to="/login">Login</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ForgetPassword;