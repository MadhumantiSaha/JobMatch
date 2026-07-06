import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/navbar";

const MyJobs = () => {
  const [jobs, setJobs] = useState([]);



  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    const token = localStorage.getItem("token");
    console.log(16, token)
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
      console.log(err);
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

              <button>Edit</button>

              <button>Delete</button>

              <button>View Applicants</button>
            </div>
            
          ))
        )}
      </div>
    </>
  );
};

export default MyJobs;