import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/navbar";
import { useNavigate } from "react-router-dom";

const MyJobs = () => {
  const [jobs, setJobs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    const token = localStorage.getItem("token");

    try {
      const res = await axios.get(
        "http://localhost:8080/job/my-jobs",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setJobs(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteJob = async (jobId) => {
    const token = localStorage.getItem("token");

    if (!window.confirm("Are you sure you want to delete this job?")) {
      return;
    }

    try {
      await axios.delete(
        `http://localhost:8080/job/${jobId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Job deleted successfully.");
      fetchJobs();
    } catch (err) {
      console.error(err);
      alert("Unable to delete job.");
    }
  };

  return (
    <>
      <Navbar />

      <div className="container">
        <h1>My Posted Jobs</h1>

        {jobs.length === 0 ? (
          <p>No jobs posted yet.</p>
        ) : (
          jobs.map((job) => (
            <div className="job-card" key={job.id}>
              <h2>{job.postName}</h2>

              <p><strong>Location:</strong> {job.location}</p>
              <p><strong>Salary:</strong> ₹{job.salary}</p>
              <p><strong>Experience:</strong> {job.experience}</p>
              <p><strong>Type:</strong> {job.jobType}</p>
              <p><strong>Skills:</strong> {job.skills}</p>

              <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
                <button
                  onClick={() => navigate(`/edit-job/${job.id}`)}
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteJob(job.id)}
                >
                  Delete
                </button>

                <button
                  onClick={() => navigate(`/view-applicants/${job.id}`)}
                >
                  View Applicants
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default MyJobs;