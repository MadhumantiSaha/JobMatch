import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";


function VerifyOtp() {
  const [otp, setOtp] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        "http://localhost:8080/user/verify-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            otp,
          }),
        }
      );

      if (res.ok) {
        alert("OTP Verified");

        navigate("/reset-password", {
          state: { email },
        });
      } else {
        const error = await res.text();
        alert(error);
      }
    } catch (err) {
      console.log(err);
      alert("Error verifying OTP");
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2>Verify OTP</h2>
        <p>Enter the OTP sent to {email || "your email"}.</p>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>OTP</label>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value)
              }
              required
            />
          </div>

          <button type="submit" className="register-btn">
            Verify OTP
          </button>
        </form>
      </div>
    </div>
  );
}

export default VerifyOtp;