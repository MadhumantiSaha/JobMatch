import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/navbar";

const JobDetails = () => {
  const { id } = useParams();
  const token = localStorage.getItem("token");

  const [job, setJob] = useState(null);
  const [resume, setResume] = useState(null);
  const [isApplying, setIsApplying] = useState(false);

  useEffect(() => {
    fetchJob();
  }, []);

  const fetchJob = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/job/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setJob(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  const applyJob = async () => {
    if (!resume) {
      alert("Please upload a resume before applying.");
      return;
    }

    setIsApplying(true);
    const formData = new FormData();
    formData.append("resume", resume);

    try {
      await axios.post(
        `http://localhost:8080/application/apply/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("Application Submitted Successfully!");
      setResume(null); // Reset file input
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.error || "Unable to apply");
    } finally {
      setIsApplying(false);
    }
  };

  if (!job) return <p className="state-message">Loading job details...</p>;

  return (
    <>
      <Navbar />

      <div className="container">
        <div className="job-details-card">
          <h1>{job.postName}</h1>
          {job.companyName && (
            <p className="job-details-company">{job.companyName}</p>
          )}

          <div className="job-details-meta">
            <div className="meta-item">
              <span className="meta-label">Job ID</span>
              <span>{job.id}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Location</span>
              <span>{job.location}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Salary</span>
              <span>₹{job.salary}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Experience</span>
              <span>{job.experience}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Job Type</span>
              <span>{job.jobType}</span>
            </div>
          </div>

          <div className="job-details-section">
            <h3>Description</h3>
            <p>{job.description}</p>
          </div>

          {job.skills && job.skills.length > 0 && (
            <div className="job-details-section">
              <h3>Skills</h3>
              <div className="job-card-skills">
                {Array.from(job.skills).map((skill) => (
                  <span key={skill} className="skill-chip">{skill}</span>
                ))}
              </div>
            </div>
          )}

          {/* Resume Upload Section */}
          <div className="resume-upload-block">
            <h3>Upload Resume (PDF/DOC/DOCX)</h3>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => setResume(e.target.files[0])}
            />
            {resume && <p className="resume-selected">Selected: {resume.name}</p>}
          </div>

          <button className="btn-primary btn-block" onClick={applyJob} disabled={isApplying || !resume}>
            {isApplying ? "Applying..." : "Apply Now"}
          </button>
        </div>
      </div>
    </>
  );
};

export default JobDetails;