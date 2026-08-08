import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import logo from "../assets/1.png";

const Navbar = () => {
  const role = localStorage.getItem("role");
  const location = useLocation();
  const [currentPlan, setCurrentPlan] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const fetchPlan = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8080/premium/my-membership",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.data && res.data.membershipStatus === "ACTIVE") {
          setCurrentPlan("PREMIUM");
        } else {
          setCurrentPlan(null);
        }
      } catch {
        setCurrentPlan(null);
      }
    };

    fetchPlan();
  }, [location.pathname]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <img src={logo} alt="JobMatch Logo" className="logo-img" />
      </div>

      <div className="nav-links">
        {role === "job_seeker" && (
          <>
            <Link
              className={location.pathname === "/jobs" ? "active" : ""}
              to="/jobs"
            >
              💼 Jobs
            </Link>

            <Link
              className={location.pathname === "/applied-jobs" ? "active" : ""}
              to="/applied-jobs"
            >
              📝 Applied Jobs
            </Link>

            <Link
              className={
                location.pathname.startsWith("/messages") ? "active" : ""
              }
              to="/messages"
            >
              💬 Messages
            </Link>

            <Link
              className={location.pathname === "/premium" ? "active" : ""}
              to="/premium"
            >
              ⭐ Upgrade
            </Link>
          </>
        )}

        {role === "job_provider" && (
          <>
            <Link
              className={location.pathname === "/my-jobs" ? "active" : ""}
              to="/my-jobs"
            >
              📋 My Jobs
            </Link>

            <Link
              className={location.pathname === "/post-job" ? "active" : ""}
              to="/post-job"
            >
              ➕ Post Job
            </Link>

            <Link
              className={location.pathname.startsWith("/messages") ? "active" : ""}
              to="/messages"
            >
              💬 Messages
            </Link>
          </>
        )}

        <Link
          className={location.pathname === "/profile" ? "active" : ""}
          to="/profile"
        >
          👤 Profile
        </Link>
      </div>

      <div className="nav-right">
        {currentPlan && (
          <span className="plan-badge" style={{ backgroundColor: "#4f46e5" }}>
            ⭐ PREMIUM
          </span>
        )}

        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
