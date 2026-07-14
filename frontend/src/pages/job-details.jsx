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

  if (!job) return <h2>Loading...</h2>;

  return (
    <>
      <Navbar />

      <div className="container">
        <h1>{job.postName}</h1>
        <p>
          <b>Job ID:</b> {job.id}
        </p>
        <p>
          <b>Location:</b> {job.location}
        </p>
        <p>
          <b>Salary:</b> {job.salary}
        </p>
        <p>
          <b>Experience:</b> {job.experience}
        </p>

        <h3>Description</h3>
        <p>{job.description}</p>
        <p>
          <b>Skills:</b> {job.skills}
        </p>
        <p>
          <b>Job Type:</b> {job.jobType}{" "}
        </p>
        <p>
          <b>Company:</b> {job.companyName}{" "}
        </p>

        {/* Resume Upload Section */}
        <div style={{ margin: "20px 0" }}>
          <h3>Upload Resume (PDF/DOC/DOCX)</h3>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => setResume(e.target.files[0])}
            style={{ marginBottom: "10px" }}
          />
          {resume && <p>Selected: {resume.name}</p>}
        </div>

        <button onClick={applyJob} disabled={isApplying || !resume}>
          {isApplying ? "Applying..." : "Apply Now"}
        </button>
      </div>
    </>
  );
};

export default JobDetails;