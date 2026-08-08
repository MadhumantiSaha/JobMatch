import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../App.css";

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
      const res = await fetch("http://localhost:8080/premium/my-membership", {
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
      const res = await fetch("http://localhost:8080/premium/deactivate", {
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
    <div className="register-container">
      <div className="register-card">
        <h2>My Profile</h2>

        {/* ========== Profile Image ========== */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "25px" }}>
          {user?.image ? (
            <img
              src={`http://localhost:8080/files/images/${user.image}`}
              alt="Profile"
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                objectFit: "cover",
                border: "3px solid #4f46e5",
                boxShadow: "0 4px 10px rgba(0,0,0,0.15)"
              }}
            />
          ) : (
            <div
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "2rem",
                fontWeight: "bold",
                boxShadow: "0 4px 10px rgba(0,0,0,0.15)"
              }}
            >
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
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "8px",
                marginTop: "6px",
              }}
            >
              {user.skills.map((skill) => (
                <span
                  key={skill}
                  style={{
                    background: "#e8f0fe",
                    color: "#1a73e8",
                    padding: "6px 14px",
                    borderRadius: "20px",
                    fontSize: "14px",
                    fontWeight: "500",
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <p style={{ color: "#888", marginTop: "6px" }}>No skills added yet</p>
          )}
        </div>

        {/* ========== Resume Section ========== */}
        {user?.role === "job_seeker" && (
          <div className="input-group">
            <label>Resume</label>
            {user?.resume ? (
              <a
                href={`http://localhost:8080/files/resumes/${user.resume}`}
                target="_blank"
                rel="noopener noreferrer"
                className="resume-link"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  color: "#4f46e5",
                  fontWeight: "600",
                  textDecoration: "none",
                  marginTop: "6px",
                  fontSize: "15px",
                }}
              >
                📄 View / Download Resume
              </a>
            ) : (
              <p style={{ color: "#888", marginTop: "6px", fontSize: "14px" }}>No resume uploaded yet</p>
            )}
          </div>
        )}

        {/* ========== Premium Section ========== */}
        {user?.role === "job_seeker" && (
          <div className="premium-section" style={{ marginTop: "30px" }}>
            <h3>Premium Membership</h3>

            {loadingPremium ? (
              <p>Loading premium details...</p>
            ) : premium ? (
              <>
                {/* <div className="input-group">
                  <label>Plan</label>
                  <input type="text" value={premium.membership} readOnly />
                </div> */}

                <div className="input-group">
                  <label>Status</label>
                  <input
                    type="text"
                    value={premium.membershipStatus}
                    readOnly
                    style={{ color: "green", fontWeight: "bold" }}
                  />
                </div>

                <div className="input-group">
                  <label>Valid Till</label>
                  <input type="text" value={premium.endDate} readOnly />
                </div>

                <button
                  className="register-btn"
                  style={{ backgroundColor: "#dc3545", marginTop: "10px" }}
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
          <button className="register-btn" style={{ marginTop: "25px" }}>
            Update Profile
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Profile;