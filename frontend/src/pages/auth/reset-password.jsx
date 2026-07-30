import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../../App.css";


function ResetPassword() {
  const [password, setPassword] =
    useState("");

  const [confirmPassword,
    setConfirmPassword] = useState("");

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
      const res = await fetch(
        "http://localhost:8080/user/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

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
    <div>
      <h2>Reset Password</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          required
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) =>
            setConfirmPassword(
              e.target.value
            )
          }
          required
        />

        <button type="submit">
          Reset Password
        </button>
      </form>
    </div>
  );
}

export default ResetPassword;