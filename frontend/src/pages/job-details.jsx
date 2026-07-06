import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/navbar";

const JobDetails = () => {

  const { id } = useParams();

  const token = localStorage.getItem("token");

  const [job, setJob] = useState(null);

  useEffect(() => {
    fetchJob();
  }, []);

  const fetchJob = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/job/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setJob(res.data.data);

    } catch (err) {
      console.log(err);
    }
  };

  const applyJob = async () => {
    try {
      await axios.post(
        `http://localhost:8080/application/apply/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Application Submitted");

    } catch (err) {
      console.log(err);
      alert("Unable to apply");
    }
  };

  if (!job) return <h2>Loading...</h2>;

  return (
    <>
      <Navbar />

      <div className="container">

        <h1>{job.postName}</h1>

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

        <p><b>Skills:</b> {job.skills}</p>
        <p><b>Job Type:</b> {job.jobType} </p>

        <button onClick={applyJob}>
          Apply Now
        </button>

      </div>
    </>
  );
};

export default JobDetails;