import { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import "../App.css";


const Dashboard = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
     try {

    const token = localStorage.getItem("token");

    console.log("TOKEN =", token);

    const response = await fetch(
      "http://localhost:8080/job"
    );

    const result = await response.json();

    console.log(result);

    if (result.success) {
      setJobs(result.data);
    }

  } catch (error) {
    console.error(error);
  }
};

  return (
    <>
      <Navbar />

      <div className="dashboard-container">
        <h1>Latest Openings</h1>

        <div className="job-grid">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="job-card"
            >
              <h2>{job.postName}</h2>

              <p>
                <strong>Description:</strong>
                <br />
                {job.description}
              </p>

              <p>
                <strong>Skills:</strong>{" "}
                {job.skills}
              </p>

              <p>
                <strong>Location:</strong>{" "}
                {job.location}
              </p>

              <p>
                <strong>Salary:</strong> ₹
                {job.salary}
              </p>

              <p>
                <strong>Posted:</strong>{" "}
                {new Date(
                  job.start_date
                ).toLocaleDateString()}
              </p>

              <button className="apply-btn">
                Apply Now
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Dashboard;