import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../config";
import logo from "../../assets/logo.png";

function VerifyOtp() {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_BASE_URL}/user/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      if (data.success) {
        alert("OTP verified");
        navigate("/reset-password", { state: { email } });
      } else {
        alert(data.message || "Invalid OTP");
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
          <h1>Check your inbox</h1>
          <p>
            Enter the 6-digit code we sent to your email to verify it&apos;s
            really you.
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

          <h2>Verify OTP</h2>
          <p className="auth-card-sub">
            {email
              ? `Code sent to ${email}`
              : "Enter the code from your email"}
          </p>

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>One-time password</label>
              <input
                type="text"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                maxLength={6}
                inputMode="numeric"
                autoComplete="one-time-code"
              />
            </div>

            <button type="submit" className="register-btn">
              Verify OTP
            </button>

            <div className="auth-footer">
              Didn&apos;t get a code?
              <Link to="/forget-password">Resend</Link>
            </div>
          </form>

          <div className="auth-back-home">
            <Link to="/login">← Back to sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VerifyOtp;
