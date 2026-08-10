import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";

const NAV_SECTIONS = [
  {
    label: "HIRING",
    items: [
      { key: "analytics", label: "Analytics", icon: "📈", path: "/provider/analytics" },
      
      {
        key: "jobs",
        label: "Job Listings",
        icon: "💼",
        path: "/my-jobs",
        matchPrefixes: ["/my-jobs", "/view-applicant"],
        badgeKey: "jobs",
      },
      { key: "post", label: "Post a Job", icon: "➕", path: "/post-job" },
      {
        key: "all-applicants",
        label: "All Applicants",
        icon: "👥",
        path: "/provider/all-applicants",
        badgeKey: "applicants",
      },
      {
        key: "shortlisted",
        label: "Shortlisted",
        icon: "⭐",
        path: "/provider/shortlisted",
        badgeKey: "shortlisted",
      },
      {
        key: "interviews",
        label: "Interviews",
        icon: "🗓️",
        path: "/provider/interviews",
        badgeKey: "interviews",
      },
    ],
  },
  {
    label: "COMPANY",
    items: [
      { key: "company-profile", label: "Company Profile", icon: "🏢", path: "/profile" },
      {
        key: "notifications",
        label: "Notifications",
        icon: "🔔",
        path: "/provider/notifications",
      },
    ],
  },
];

const EMPTY_COUNTS = { jobs: 0, applicants: 0, shortlisted: 0, interviews: 0 };

const ProviderSidebar = () => {
  const location = useLocation();
  const [counts, setCounts] = useState(EMPTY_COUNTS);

  const userString = localStorage.getItem("user");
  const user = userString && userString !== "undefined" ? JSON.parse(userString) : null;

  useEffect(() => {
    fetchCounts();
  }, []);

  const fetchCounts = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const jobsRes = await axios.get("http://localhost:8080/job/my-jobs", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const jobs = jobsRes.data.data || [];

      const results = await Promise.allSettled(
        jobs.map((job) =>
          axios.get(`http://localhost:8080/application/job/${job.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
        )
      );

      let applicants = 0;
      let shortlisted = 0;
      let interviews = 0;

      results.forEach((result) => {
        if (result.status !== "fulfilled") return;
        const apps = result.value.data.data || [];
        applicants += apps.length;
        shortlisted += apps.filter((a) => a.status === "SHORTLISTED").length;
        interviews += apps.filter((a) => a.status === "INTERVIEW").length;
      });

      setCounts({ jobs: jobs.length, applicants, shortlisted, interviews });
    } catch (err) {
      console.error(err);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const isActive = (item) => {
    if (item.matchPrefixes) {
      return item.matchPrefixes.some((prefix) => location.pathname.startsWith(prefix));
    }
    return location.pathname === item.path;
  };

  const initial = (user?.name || "C").charAt(0).toUpperCase();

  return (
    <aside className="rp-sidebar">
      <div className="rp-company-chip">
        <div className="rp-company-avatar">{initial}</div>
        <div>
          <div className="rp-company-name">{user?.name || "Your Company"}</div>
          <div className="rp-company-plan">Employer Account</div>
        </div>
      </div>

      <nav className="rp-nav">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label}>
            <div className="rp-nav-section">{section.label}</div>
            {section.items.map((item) => {
              const badgeValue = item.badgeKey ? counts[item.badgeKey] : null;
              return (
                <Link
                  key={item.key}
                  to={item.path}
                  className={`rp-nav-item ${isActive(item) ? "active" : ""}`}
                >
                  <span className="rp-nav-icon">{item.icon}</span>
                  <span>{item.label}</span>
                  {badgeValue !== null && badgeValue !== undefined && (
                    <span className="rp-nav-badge">{badgeValue}</span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default ProviderSidebar;
