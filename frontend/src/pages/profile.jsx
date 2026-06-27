import React from "react";
import { Link } from "react-router-dom";

const Profile = () => {
  const userString = localStorage.getItem("user");

  if (!userString || userString === "undefined") {
    return (
      <div className="register-container">
        <div className="register-card">
          <h2>User Not Found</h2>
          <p>Please login again.</p>

          <Link to="/login">
            <button className="register-btn">
              Go to Login
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const user = JSON.parse(userString);

  return (
    <div className="register-container">
      <div className="register-card">
        <h2>My Profile</h2>

        <div className="input-group">
          <label>Name</label>
          <input
            type="text"
            value={user?.name || ""}
            readOnly
          />
        </div>

        <div className="input-group">
          <label>Email</label>
          <input
            type="text"
            value={user?.email || ""}
            readOnly
          />
        </div>

        <div className="input-group">
          <label>Contact</label>
          <input
            type="text"
            value={user?.contact || ""}
            readOnly
          />
        </div>

        <div className="input-group">
          <label>Role</label>
          <input
            type="text"
            value={user?.role || ""}
            readOnly
          />
        </div>

        <Link to="/update-profile">
          <button className="register-btn">
            Update Profile
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Profile;