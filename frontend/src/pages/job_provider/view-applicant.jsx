import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ProviderLayout from "../../components/provider-layout";

const TABS = [
  { key: "ALL", label: "All" },
  { key: "PENDING", label: "Pending" },
  { key: "SHORTLISTED", label: "Shortlisted" },
  { key: "INTERVIEW", label: "Interview" },
  { key: "HIRED", label: "Hired" },
  { key: "REJECTED", label: "Rejected" },
];

const ViewApplicants = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [messagingId, setMessagingId] = useState(null);
  const [activeTab, setActiveTab] = useState("ALL");
  const [search, setSearch] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchApplicants();
  }, [jobId]);

  const fetchApplicants = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/application/job/${jobId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setApplications(res.data.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  const updateStatus = async (applicationId, status) => {
    try {
      await axios.put(
        `http://localhost:8080/application/${applicationId}/status`,
        null,
        {
          params: { status },
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchApplicants();
    } catch (err) {
      console.log(err);
      alert("Unable to update status");
    }
  };

  const messageApplicant = async (seekerId) => {
    if (!seekerId) {
      alert(
        "Applicant user id is missing. Please ensure the backend exposes jobSeekerId."
      );
      return;
    }
    setMessagingId(seekerId);
    try {
      const res = await axios.post(
        `http://localhost:8080/messages/start/${seekerId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const conversation = res.data.data;
      navigate(`/messages?conversationId=${conversation.id}`);
    } catch (err) {
      alert(err.response?.data?.error || "Unable to start conversation.");
    } finally {
      setMessagingId(null);
    }
  };

  const statusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "status-pending";
      case "SHORTLISTED":
        return "status-shortlisted";
      case "INTERVIEW":
        return "status-interview";
      case "HIRED":
        return "status-hired";
      case "REJECTED":
        return "status-rejected";
      default:
        return "status-default";
    }
  };

  const getSeekerId = (application) =>
    application.jobSeekerId ||
    application.jobSeeker?.id ||
    application.job_seeker_id ||
    null;

  // Counts per status power both the summary chips and the filter tab badges.
  const counts = useMemo(() => {
    const base = {
      ALL: applications.length,
      PENDING: 0,
      SHORTLISTED: 0,
      INTERVIEW: 0,
      HIRED: 0,
      REJECTED: 0,
    };
    applications.forEach((app) => {
      if (base[app.status] !== undefined) base[app.status] += 1;
    });
    return base;
  }, [applications]);

  const visibleApplications = useMemo(() => {
    const query = search.trim().toLowerCase();
    return applications.filter((app) => {
      const matchesTab = activeTab === "ALL" || app.status === activeTab;
      const matchesSearch =
        !query ||
        (app.name || "").toLowerCase().includes(query) ||
        (app.email || "").toLowerCase().includes(query);
      return matchesTab && matchesSearch;
    });
  }, [applications, activeTab, search]);

  return (
    <ProviderLayout>
      <div className="applicants-page">
        <button className="applicants-back" onClick={() => navigate("/my-jobs")}>
          ← Back to My Jobs
        </button>

        <div className="applicants-header">
          <div>
            <h1>Applicants</h1>
            <p className="applicants-subtitle">
              Review candidates, track their pipeline stage and message them directly
            </p>
          </div>
          <span className="count-badge">{applications.length} Total Applicants</span>
        </div>

        {applications.length > 0 && (
          <div className="app-stats-row">
            <div className="app-stat-chip">
              <div className="app-stat-chip-value">{counts.ALL}</div>
              <div className="app-stat-chip-label">Total</div>
            </div>
            <div className="app-stat-chip pending">
              <div className="app-stat-chip-value">{counts.PENDING}</div>
              <div className="app-stat-chip-label">Pending</div>
            </div>
            <div className="app-stat-chip shortlisted">
              <div className="app-stat-chip-value">{counts.SHORTLISTED}</div>
              <div className="app-stat-chip-label">Shortlisted</div>
            </div>
            <div className="app-stat-chip interview">
              <div className="app-stat-chip-value">{counts.INTERVIEW}</div>
              <div className="app-stat-chip-label">Interview</div>
            </div>
            <div className="app-stat-chip hired">
              <div className="app-stat-chip-value">{counts.HIRED}</div>
              <div className="app-stat-chip-label">Hired</div>
            </div>
            <div className="app-stat-chip rejected">
              <div className="app-stat-chip-value">{counts.REJECTED}</div>
              <div className="app-stat-chip-label">Rejected</div>
            </div>
          </div>
        )}

        {applications.length === 0 ? (
          <div className="applicants-empty">
            <p>No applicants yet.</p>
          </div>
        ) : (
          <>
            <div className="applicants-toolbar">
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

              <div className="applicants-search">
                <span>🔍</span>
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            {visibleApplications.length === 0 ? (
              <div className="applicants-empty">
                <p>No applicants match this filter.</p>
              </div>
            ) : (
              <div className="applicants-list">
                {visibleApplications.map((application) => {
                  const seekerId = getSeekerId(application);
                  return (
                    <div key={application.id} className="applicant-card">
                      <div className="applicant-main">
                        <div className="avatar">
                          {(application.name || "?").charAt(0).toUpperCase()}
                        </div>
                        <div className="applicant-info">
                          <h2>{application.name}</h2>
                          <p>📧 {application.email}</p>
                          <p>📞 {application.contact}</p>
                          <p>
                            Applied:{" "}
                            {application.appliedAt
                              ? new Date(
                                  application.appliedAt
                                ).toLocaleDateString()
                              : "—"}
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
                        <span
                          className={`status-pill ${statusColor(
                            application.status
                          )}`}
                        >
                          {application.status}
                        </span>

                        <select
                          className="status-select"
                          value={application.status}
                          onChange={(e) =>
                            updateStatus(application.id, e.target.value)
                          }
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
                          title={
                            !seekerId
                              ? "Applicant id unavailable"
                              : "Message this applicant"
                          }
                        >
                          {messagingId === seekerId
                            ? "Opening..."
                            : "💬 Message"}
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

export default ViewApplicants;
