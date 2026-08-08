import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../../components/navbar";

const ViewApplicants = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [messagingId, setMessagingId] = useState(null);

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

  return (
    <>
      <Navbar />

      <div className="applicants-page">
        <div className="applicants-container">
          <div className="applicants-header">
            <div>
              <h1>Applicants</h1>
              <p className="applicants-subtitle">
                Review candidates and message them directly
              </p>
            </div>
            <div className="applicants-count">
              Total: {applications.length}
            </div>
          </div>

          {applications.length === 0 ? (
            <div className="applicants-empty">
              <p>No applicants yet.</p>
            </div>
          ) : (
            <div className="applicants-list">
              {applications.map((application) => {
                const seekerId = getSeekerId(application);
                return (
                  <div key={application.id} className="applicant-card">
                    <div className="applicant-main">
                      <div className="applicant-avatar">
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
                          : "💬 Message Applicant"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ViewApplicants;
