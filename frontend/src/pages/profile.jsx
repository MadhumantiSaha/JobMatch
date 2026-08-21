import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/navbar";
import { API_BASE_URL } from "../config";

const Profile = () => {
  const userString = localStorage.getItem("user");
  const token = localStorage.getItem("token");

  const [premium, setPremium] = useState(null);
  const [loadingPremium, setLoadingPremium] = useState(false);
  const [deactivating, setDeactivating] = useState(false);

  if (!userString || userString === "undefined") {
    return (
      <div className="register-container">
        <div className="register-card">
          <h2>User Not Found</h2>
          <p>Please login again.</p>
          <Link to="/login">
            <button className="register-btn">Go to Login</button>
          </Link>
        </div>
      </div>
    );
  }

  const user = JSON.parse(userString);

  // ---------- Always fetch latest premium from backend ----------
  useEffect(() => {
    if (user?.role === "job_seeker" && token) {
      fetchPremium();
    }
  }, []);

  const fetchPremium = async () => {
    setLoadingPremium(true);
    try {
      const res = await fetch(`${API_BASE_URL}/premium/my-membership`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setPremium(data);
      } else {
        setPremium(null);
      }
    } catch (err) {
      console.error("Error fetching premium:", err);
      setPremium(null);
    } finally {
      setLoadingPremium(false);
    }
  };

  // ---------- Deactivate ----------
  const handleDeactivate = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to deactivate your premium plan?"
    );
    if (!confirmed) return;

    setDeactivating(true);
    try {
      const res = await fetch(`${API_BASE_URL}/premium/deactivate`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (res.ok) {
        alert("Premium plan deactivated successfully!");
        setPremium(null);
      } else {
        alert(data.error || "Failed to deactivate");
      }
    } catch (err) {
      alert("Something went wrong");
    } finally {
      setDeactivating(false);
    }
  };

  return (
    <>
      <Navbar />
    
      <div className="register-container">
        <div className="register-card">
          <h2>My Profile</h2>

          {/* ========== Profile Image ========== */}
          <div className="profile-avatar-block">
            {user?.image ? (
              <div className="avatar avatar-lg">
                <img
                  src={`${API_BASE_URL}/files/images/${user.image}`}
                  alt="Profile"
                />
              </div>
            ) : (
              <div className="avatar avatar-lg">
                {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
              </div>
            )}
          </div>

          {/* ========== Basic Info ========== */}
          <div className="input-group">
            <label>Name</label>
            <input type="text" value={user?.name || ""} readOnly />
          </div>

          <div className="input-group">
            <label>Email</label>
            <input type="text" value={user?.email || ""} readOnly />
          </div>

          <div className="input-group">
            <label>Contact</label>
            <input type="text" value={user?.contact || ""} readOnly />
          </div>

          <div className="input-group">
            <label>Role</label>
            <input type="text" value={user?.role || ""} readOnly />
          </div>

          {/* ========== Experience Years ========== */}
          <div className="input-group">
            <label>Years of Experience</label>
            <input
              type="text"
              value={
                user?.experienceYears !== null && user?.experienceYears !== undefined
                  ? `${user.experienceYears} year${user.experienceYears !== 1 ? "s" : ""}`
                  : "Not set"
              }
              readOnly
            />
          </div>

          {/* ========== Skills ========== */}
          <div className="input-group">
            <label>Skills</label>
            {user?.skills && user.skills.length > 0 ? (
              <div className="skill-chip-group">
                {user.skills.map((skill) => (
                  <span key={skill} className="skill-chip">
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="state-message">No skills added yet</p>
            )}
          </div>

          {/* ========== Resume Section ========== */}
          {user?.role === "job_seeker" && (
            <div className="input-group">
              <label>Resume</label>
              {user?.resume ? (
                <a
                  href={`${API_BASE_URL}/files/resumes/${user.resume}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="resume-link"
                >
                  📄 View / Download Resume
                </a>
              ) : (
                <p className="state-message">No resume uploaded yet</p>
              )}
            </div>
          )}

          {/* ========== Premium Section ========== */}
          {user?.role === "job_seeker" && (
            <div className="premium-section">
              <h3>Premium Membership</h3>

              {loadingPremium ? (
                <p>Loading premium details...</p>
              ) : premium ? (
                <>
                  <div className="input-group">
                    <label>Status</label>
                    <input
                      type="text"
                      value={premium.membershipStatus}
                      readOnly
                      className="status-active-text"
                    />
                  </div>

                  <div className="input-group">
                    <label>Valid Till</label>
                    <input type="text" value={premium.endDate} readOnly />
                  </div>

                  <button
                    className="btn-danger btn-block"
                    onClick={handleDeactivate}
                    disabled={deactivating}
                  >
                    {deactivating ? "Deactivating..." : "Deactivate Premium"}
                  </button>
                </>
              ) : (
                <p>
                  You don't have an active premium plan.{" "}
                  <Link to="/premium">Buy Premium</Link>
                </p>
              )}
            </div>
          )}

          {/* ========== Update Button ========== */}
          <Link to="/update-profile">
            <button className="register-btn btn-block" style={{ marginTop: "25px" }}>
              Update Profile
            </button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Profile;