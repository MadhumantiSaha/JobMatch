import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const role = localStorage.getItem("role");
  const location = useLocation();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");

    window.location.href = "/login";
  };

  return (
    <nav className="navbar">

      <div className="logo">
        <h2>Online Job Portal</h2>
      </div>

      <div className="nav-links">

        {/* Common */}
        <Link
          className={location.pathname === "/dashboard" ? "active" : ""}
          to="/dashboard"
        >
          🏠 Dashboard
        </Link>

        {/* Job Seeker */}
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
          </>
        )}

        {/* Job Provider */}
        {role === "job_provider" && (
          <>
            <Link
              className={location.pathname === "/post-job" ? "active" : ""}
              to="/post-job"
            >
              ➕ Post Job
            </Link>

            <Link
              className={location.pathname === "/my-jobs" ? "active" : ""}
              to="/my-jobs"
            >
              📋 My Jobs
            </Link>
          </>
        )}

        {/* Common */}
        <Link
          className={location.pathname === "/profile" ? "active" : ""}
          to="/profile"
        >
          👤 Profile
        </Link>

      </div>

      <button className="logout-btn" onClick={logout}>
        Logout
      </button>

    </nav>
  );
};

export default Navbar;