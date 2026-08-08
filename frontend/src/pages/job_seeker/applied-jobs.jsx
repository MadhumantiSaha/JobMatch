import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../../components/navbar";

const AppliedJobs = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false);
  const [messagingId, setMessagingId] = useState(null);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    fetchApplications();
    checkPremium();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8080/application/my-applications",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setApplications(res.data.data || []);
    } catch (err) {
      console.error("Error fetching applications:", err);
      alert("Failed to load your applications.");
    } finally {
      setLoading(false);
    }
  };

  const checkPremium = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8080/premium/my-membership",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsPremium(res.data?.membershipStatus === "ACTIVE");
    } catch {
      setIsPremium(false);
    }
  };

  const withdrawApplication = async (applicationId) => {
    if (!window.confirm("Are you sure you want to withdraw this application?")) {
      return;
    }
    try {
      await axios.delete(`http://localhost:8080/application/${applicationId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Application withdrawn successfully.");
      fetchApplications();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Unable to withdraw application.");
    }
  };

  const startMessageWithRecruiter = async (recruiterId) => {
    if (!recruiterId) {
      alert("Recruiter information is not available for this job.");
      return;
    }
    setMessagingId(recruiterId);
    try {
      const res = await axios.post(
        `http://localhost:8080/messages/start/${recruiterId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const conversation = res.data.data;
      navigate(`/messages?conversationId=${conversation.id}`);
    } catch (err) {
      const status = err.response?.status;
      const msg = err.response?.data?.error || "Unable to start conversation.";
      if (status === 403) {
        alert("Only Premium members can message recruiters. Upgrade to unlock direct chat.");
        navigate("/premium");
      } else {
        alert(msg);
      }
    } finally {
      setMessagingId(null);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="applied-page">
          <div className="applied-loading">Loading your applications...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="applied-page">
        <div className="applied-header">
          <div>
            <h1>My Applied Jobs</h1>
            <p className="applied-subtitle">
              Track applications and message recruiters
              {isPremium ? " with Premium" : ""}
            </p>
          </div>
          <div className="applied-count-badge">
            {applications.length} Application{applications.length !== 1 ? "s" : ""}
          </div>
        </div>

        {applications.length === 0 ? (
          <div className="applied-empty">
            <div className="applied-empty-icon">📝</div>
            <h3>No applications yet</h3>
            <p>You haven't applied to any jobs. Browse openings and apply!</p>
            <button className="btn-primary" onClick={() => navigate("/jobs")}>
              Browse Jobs
            </button>
          </div>
        ) : (
          <div className="applied-grid">
            {applications.map((application) => {
              const job = application.job || {};
              const recruiterId = job.recruiter?.id;
              const company = job.company || job.Company || "Company";

              return (
                <div key={application.id} className="applied-card">
                  <div className="applied-card-top">
                    <div className="applied-card-title-block">
                      <h2>{job.postName || "Job Title"}</h2>
                      <p className="applied-company">{company}</p>
                    </div>
                    <span
                      className={`status-pill ${getStatusClass(application.status)}`}
                    >
                      {application.status}
                    </span>
                  </div>

                  <div className="applied-meta">
                    <div className="meta-item">
                      <span className="meta-label">Location</span>
                      <span>{job.location || "—"}</span>
                    </div>
                    <div className="meta-item">
                      <span className="meta-label">Salary</span>
                      <span>
                        {job.salary != null
                          ? `₹${Number(job.salary).toLocaleString()}`
                          : "—"}
                      </span>
                    </div>
                    <div className="meta-item">
                      <span className="meta-label">Applied</span>
                      <span>
                        {application.appliedAt
                          ? new Date(application.appliedAt).toLocaleDateString()
                          : "—"}
                      </span>
                    </div>
                    {job.jobType && (
                      <div className="meta-item">
                        <span className="meta-label">Type</span>
                        <span>{String(job.jobType).replace("_", " ")}</span>
                      </div>
                    )}
                  </div>

                  {job.skills && job.skills.length > 0 && (
                    <div className="applied-skills">
                      {(Array.isArray(job.skills)
                        ? job.skills
                        : Array.from(job.skills)
                      )
                        .slice(0, 6)
                        .map((skill) => (
                          <span key={skill} className="skill-chip">
                            {skill}
                          </span>
                        ))}
                    </div>
                  )}

                  <div className="applied-actions">
                    <button
                      className="btn-secondary"
                      onClick={() => navigate(`/job/${job.id}`)}
                    >
                      View Job
                    </button>

                    {isPremium ? (
                      <button
                        className="btn-message"
                        disabled={messagingId === recruiterId}
                        onClick={() => startMessageWithRecruiter(recruiterId)}
                      >
                        {messagingId === recruiterId
                          ? "Opening..."
                          : "💬 Direct Message Recruiter"}
                      </button>
                    ) : (
                      <button
                        className="btn-upgrade"
                        onClick={() => navigate("/premium")}
                      >
                        ⭐ Upgrade to Chat with Recruiter
                      </button>
                    )}

                    <button
                      className="btn-danger-outline"
                      onClick={() => withdrawApplication(application.id)}
                    >
                      Withdraw
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

const getStatusClass = (status) => {
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

export default AppliedJobs;
