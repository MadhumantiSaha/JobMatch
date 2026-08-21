import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../config";
import logo from "../../assets/logo.png";

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/user/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (res.ok) {
        alert("Password Reset Successful");
        navigate("/login");
      } else {
        const error = await res.text();
        alert(error);
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
          <h1>Choose a new password</h1>
          <p>
            Pick something strong and unique. You&apos;ll use it the next time
            you sign in.
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

          <h2>Reset Password</h2>
          <p className="auth-card-sub">
            Enter and confirm your new password
          </p>

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>New Password</label>
              <input
                type="password"
                placeholder="New password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
            </div>

            <div className="input-group">
              <label>Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
            </div>

            <button type="submit" className="register-btn">
              Reset Password
            </button>

            <div className="auth-footer">
              Ready to sign in?
              <Link to="/login">Go to login</Link>
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

export default ResetPassword;
