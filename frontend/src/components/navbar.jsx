import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import logo from "../assets/logo.png";
import premiumLogo from "../assets/premium-logo.png";
import recruiterLogo from "../assets/recruiter-logo.png";
import { API_BASE_URL } from "../config";

const Navbar = () => {
  const role = localStorage.getItem("role");
  const location = useLocation();
  const [isPremium, setIsPremium] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const token = localStorage.getItem("token");

  const brandLogo =
    role === "job_provider"
      ? recruiterLogo
      : isPremium
        ? premiumLogo
      : logo;

  useEffect(() => {
    if (!token) return;

    const fetchPlan = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/premium/status`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIsPremium(Boolean(res.data?.premium));
      } catch {
        try {
          const res = await axios.get(`${API_BASE_URL}/premium/me`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = res.data;
          const active =
            data &&
            (data.membershipStatus === "ACTIVE" ||
              data?.membershipStatus === "ACTIVE");
          setIsPremium(Boolean(active));
        } catch {
          setIsPremium(false);
        }
      }
    };

    fetchPlan();
  }, [location.pathname, token]);

  useEffect(() => {
    if (!token) return;

    const fetchUnread = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/messages/unread-count`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUnreadCount(res.data.count || 0);
      } catch {
        setUnreadCount(0);
      }
    };

    fetchUnread();
    const interval = setInterval(fetchUnread, 20000);
    const onMessagesRead = () => fetchUnread();
    window.addEventListener("messages-read", onMessagesRead);

    return () => {
      clearInterval(interval);
      window.removeEventListener("messages-read", onMessagesRead);
    };
  }, [token, location.pathname]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const MessagesLink = () => (
    <Link
      className={location.pathname.startsWith("/messages") ? "active" : ""}
      to="/messages"
      style={{ position: "relative" }}
    >
      Messages
      {unreadCount > 0 && (
        <span className="nav-unread-badge">
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      )}
    </Link>
  );

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to={role === "job_provider" ? "/my-jobs" : "/jobs"}>
          <img
            src={brandLogo}
            alt={
              role === "job_provider"
                ? "JobMatch for Recruiters"
                : isPremium
                  ? "JobMatch Premium"
                  : "JobMatch"
            }
            className={`logo-img ${
              role === "job_provider" ? "logo-img-recruiter" : ""
            } ${isPremium ? "logo-img-premium" : ""}`}
          />
        </Link>
      </div>

      <div className="nav-links">
        {role === "job_seeker" && (
          <>
            <Link
              className={location.pathname === "/jobs" ? "active" : ""}
              to="/jobs"
            >
              Jobs
            </Link>

            <Link
              className={location.pathname === "/applied-jobs" ? "active" : ""}
              to="/applied-jobs"
            >
              Applied Jobs
            </Link>

            <MessagesLink />

            {!isPremium && (
              <Link
                className={location.pathname === "/premium" ? "active" : ""}
                to="/premium"
              >
                ⭐ Upgrade
              </Link>
            )}
          </>
        )}

        {role === "job_provider" && (
          <>
            <Link
              className={location.pathname === "/my-jobs" ? "active" : ""}
              to="/my-jobs"
            >
              My Jobs
            </Link>

            <Link
              className={location.pathname === "/post-job" ? "active" : ""}
              to="/post-job"
            >
              Post Job
            </Link>

            <MessagesLink />
          </>
        )}

        <Link
          className={location.pathname === "/profile" ? "active" : ""}
          to="/profile"
        >
          Profile
        </Link>
      </div>

      <div className="nav-right">
        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
