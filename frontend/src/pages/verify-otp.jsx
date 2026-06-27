import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../App.css";


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
    <div>
      <h2>Verify OTP</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) =>
            setOtp(e.target.value)
          }
          required
        />

        <button type="submit">
          Verify OTP
        </button>
      </form>
    </div>
  );
}

export default VerifyOtp;