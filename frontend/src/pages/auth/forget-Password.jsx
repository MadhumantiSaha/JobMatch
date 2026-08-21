import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../config";
import logo from "../../assets/logo.png";

function ForgetPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_BASE_URL}/user/forget-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (data.success) {
        alert("OTP sent successfully");
        navigate("/verify-otp", { state: { email } });
      } else {
        alert(data.error || "Failed to send OTP");
      }
    } catch (err) {
      console.log(err);
      alert("Something went wrong");
    }
  };

  return (
    <div className="register-container has-brand">
      <aside className="auth-brand-panel">
        <Link to="/">
          <img src={logo} alt="JobMatch" className="auth-brand-logo" />
        </Link>
        <div className="auth-brand-content">
          <h1>Forgot your password?</h1>
          <p>
            No worries — enter your email and we&apos;ll send a one-time code to
            reset it securely.
          </p>
        </div>
        <p className="auth-brand-footer">
          © {new Date().getFullYear()} JobMatch
        </p>
      </aside>

      <div className="auth-form-side">
        <div className="register-card">
          <div className="auth-card-logo">
            <Link to="/">
              <img src={logo} alt="JobMatch" />
            </Link>
          </div>

          <h2>Forgot Password</h2>
          <p className="auth-card-sub">
            We&apos;ll email you a verification code
          </p>

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <button type="submit" className="register-btn">
              Send OTP
            </button>

            <div className="auth-footer">
              Remember your password?
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
}

export default ForgetPassword;
