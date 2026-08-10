import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ProviderLayout from "../../components/provider-layout";
import { useProviderData, getSeekerId } from "../../hooks/useProviderData";

const TABS = [
  { key: "ALL", label: "All" },
  { key: "PENDING", label: "Pending" },
  { key: "SHORTLISTED", label: "Shortlisted" },
  { key: "INTERVIEW", label: "Interview" },
  { key: "HIRED", label: "Hired" },
  { key: "REJECTED", label: "Rejected" },
];

const statusColor = (status) => {
  switch (status) {
    case "PENDING": return "status-pending";
    case "SHORTLISTED": return "status-shortlisted";
    case "INTERVIEW": return "status-interview";
    case "HIRED": return "status-hired";
    case "REJECTED": return "status-rejected";
    default: return "status-default";
  }
};

// Shared cross-job applicants list. `lockedStatus` pins the page to one
// status (used for the Shortlisted and Interviews sidebar links); leave it
// undefined for the full "All Applicants" view with tabs for every status.
const ApplicantsAggregate = ({ lockedStatus, title, subtitle, icon }) => {
  const { jobs, applications, loading, refetch } = useProviderData();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState(lockedStatus || "ALL");
  const [search, setSearch] = useState("");
  const [jobFilter, setJobFilter] = useState("ALL");
  const [messagingId, setMessagingId] = useState(null);
  const token = localStorage.getItem("token");

  const counts = useMemo(() => {
    const base = { ALL: applications.length, PENDING: 0, SHORTLISTED: 0, INTERVIEW: 0, HIRED: 0, REJECTED: 0 };
    applications.forEach((app) => {
      if (base[app.status] !== undefined) base[app.status] += 1;
    });
    return base;
  }, [applications]);

  const visible = useMemo(() => {
    const query = search.trim().toLowerCase();
    const statusToMatch = lockedStatus || activeTab;

    return applications.filter((app) => {
      const matchesStatus = statusToMatch === "ALL" || app.status === statusToMatch;
      const matchesJob = jobFilter === "ALL" || String(app.jobId) === String(jobFilter);
      const matchesSearch =
        !query ||
        (app.name || "").toLowerCase().includes(query) ||
        (app.email || "").toLowerCase().includes(query) ||
        (app.jobTitle || "").toLowerCase().includes(query);
      return matchesStatus && matchesJob && matchesSearch;
    });
  }, [applications, activeTab, lockedStatus, jobFilter, search]);

  const updateStatus = async (applicationId, status) => {
    try {
      await axios.put(
        `http://localhost:8080/application/${applicationId}/status`,
        null,
        { params: { status }, headers: { Authorization: `Bearer ${token}` } }
      );
      refetch();
    } catch (err) {
      console.error(err);
      alert("Unable to update status");
    }
  };

  const messageApplicant = async (seekerId) => {
    if (!seekerId) {
      alert("Applicant user id is missing.");
      return;
    }
    setMessagingId(seekerId);
    try {
      const res = await axios.post(
        `http://localhost:8080/messages/start/${seekerId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate(`/messages?conversationId=${res.data.data.id}`);
    } catch (err) {
      alert(err.response?.data?.error || "Unable to start conversation.");
    } finally {
      setMessagingId(null);
    }
  };

  return (
    <ProviderLayout>
      <div className="applicants-page">
        <div className="applicants-header">
          <div>
            <h1>{icon} {title}</h1>
            <p className="applicants-subtitle">{subtitle}</p>
          </div>
          <span className="count-badge">{visible.length} shown</span>
        </div>

        {applications.length === 0 && !loading ? (
          <div className="applicants-empty">
            <p>No applicants yet — they'll show up here once candidates apply to your jobs.</p>
          </div>
        ) : (
          <>
            <div className="applicants-toolbar">
              {!lockedStatus && (
                <div className="applicants-tabs">
                  {TABS.map((tab) => (
                    <button
                      key={tab.key}
                      className={`applicants-tab ${activeTab === tab.key ? "active" : ""}`}
                      onClick={() => setActiveTab(tab.key)}
                    >
                      {tab.label} ({counts[tab.key]})
                    </button>
                  ))}
                </div>
              )}

              <select
                className="rp-filter-select"
                value={jobFilter}
                onChange={(e) => setJobFilter(e.target.value)}
              >
                <option value="ALL">All Jobs</option>
                {jobs.map((job) => (
                  <option key={job.id} value={job.id}>
                    {job.postName}
                  </option>
                ))}
              </select>

              <div className="applicants-search">
                <span>🔍</span>
                <input
                  type="text"
                  placeholder="Search by name, email or job..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            {loading ? (
              <div className="applicants-empty"><p>Loading applicants…</p></div>
            ) : visible.length === 0 ? (
              <div className="applicants-empty"><p>No applicants match this filter.</p></div>
            ) : (
              <div className="applicants-list">
                {visible.map((application) => {
                  const seekerId = getSeekerId(application);
                  return (
                    <div key={application.id} className="applicant-card">
                      <div className="applicant-main">
                        <div className="avatar">{(application.name || "?").charAt(0).toUpperCase()}</div>
                        <div className="applicant-info">
                          <h2>{application.name}</h2>
                          <p>📧 {application.email}</p>
                          <p>📞 {application.contact}</p>
                          <p>
                            Applied for{" "}
                            <button
                              className="rp-link-btn"
                              onClick={() => navigate(`/view-applicant/${application.jobId}`)}
                            >
                              {application.jobTitle}
                            </button>
                          </p>
                          {application.resume && (
                            <a
                              href={`http://localhost:8080/files/resumes/${application.resume}`}
                              target="_blank"
                              rel="noreferrer"
                              className="resume-link"
                            >
                              📄 View / Download Resume
                            </a>
                          )}
                        </div>
                      </div>

                      <div className="applicant-actions">
                        <span className={`status-pill ${statusColor(application.status)}`}>
                          {application.status}
                        </span>

                        <select
                          className="status-select"
                          value={application.status}
                          onChange={(e) => updateStatus(application.id, e.target.value)}
                        >
                          <option value="PENDING">Pending</option>
                          <option value="SHORTLISTED">Shortlisted</option>
                          <option value="INTERVIEW">Interview</option>
                          <option value="REJECTED">Rejected</option>
                          <option value="HIRED">Hired</option>
                        </select>

                        <button
                          className="btn-message"
                          disabled={messagingId === seekerId || !seekerId}
                          onClick={() => messageApplicant(seekerId)}
                        >
                          {messagingId === seekerId ? "Opening..." : "💬 Message"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </ProviderLayout>
  );
};

export default ApplicantsAggregate;
