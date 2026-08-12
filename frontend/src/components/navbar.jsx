import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import logo from "../assets/logo.png";

const Navbar = () => {
  const role = localStorage.getItem("role");
  const location = useLocation();
  const [currentPlan, setCurrentPlan] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  const token = localStorage.getItem("token");

  // Fetch premium plan (existing)
  useEffect(() => {
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
  }, [location.pathname, token]);

  // Fetch unread message count
  useEffect(() => {
    if (!token) return;

    const fetchUnread = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8080/messages/unread-count",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUnreadCount(res.data.count || 0);
      } catch {
        setUnreadCount(0);
      }
    };

    // Initial load + when route changes
  fetchUnread();

  // Poll every 20 seconds as a safety net
  const interval = setInterval(fetchUnread, 20000);

  // Instant refresh when user opens a conversation
  const onMessagesRead = () => fetchUnread();
  window.addEventListener("messages-read", onMessagesRead);

    return () => clearInterval(interval);
  }, [token, location.pathname]); // also refresh when user navigates


  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  // Helper to render Messages link with badge
  const MessagesLink = () => (
    <Link
      className={
        location.pathname.startsWith("/messages") ? "active" : ""
      }
      to="/messages"
      style={{ position: "relative" }}
    >
      💬 Messages
      {unreadCount > 0 && (
        <span className="nav-unread-badge">
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      )}
    </Link>
  );

  const fetchConversations = async () => {
    try {
      setLoadingList(true);
      const res = await axios.get(
        "http://localhost:8080/messages/my-conversations",
        authHeaders()
      );
      setConversations(res.data.data || []);
      // optional: refresh badge when inbox opens
      window.dispatchEvent(new Event("messages-read"));
    } catch (err) {
      // ...
    } finally {
      setLoadingList(false);
    }
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

            <MessagesLink />

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

            <MessagesLink />
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