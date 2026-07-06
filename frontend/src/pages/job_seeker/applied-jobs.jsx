import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/navbar";

const AppliedJobs = () => {
  const [applications, setApplications] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8080/application/my-applications",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(res.data.data);
      setApplications(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Navbar />

      <div className="container">
        <h1>Applied Jobs</h1>

        {applications.length === 0 ? (
          <p>You haven't applied to any jobs.</p>
        ) : (
          applications.map((application) => (
            <div className="job-card" key={application.id}>
              <h2>{application.job.postName}</h2>

              <p>{application.job.location}</p>
              <p>{application.job.description}</p>
              <p>{application.job.skills}</p>
              <p>{application.job.salary}</p>
              <p>Status : {application.status}</p> 

              <button onClick={() => applyJob(application.job.id)}>View Details</button>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default AppliedJobs;