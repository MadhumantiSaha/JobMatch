import { useState } from "react";
import axios from "axios";
import Navbar from "../../components/navbar";

const PostJob = () => {
  const token = localStorage.getItem("token");

  const [job, setJob] = useState({
    postName: "",
    location: "",
    salary: "",
    experience: "",
    jobType: "",
    skills: "",
    description: "",
  });

  const handleChange = (e) => {
    setJob({
      ...job,
      [e.target.name]: e.target.value,
    });
  };

  const postJob = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:8080/job/jobpost",
        job,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response.data);
      alert("Job Posted Successfully!");

      setJob({
        postName: "",
        location: "",
        salary: "",
        experience: "",
        jobType: "",
        skills: "",
        description: "",
      });
    } catch (err) {
      console.error(err.response?.data || err);
      alert(err.response?.data?.error || "Unable to post job");
    }
  };

  return (
    <>
      <Navbar />

      <div className="container">
        <h1>Post a Job</h1>

        <form onSubmit={postJob}>

          <input
            type="text"
            name="postName"
            placeholder="Job Title"
            value={job.postName}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="location"
            placeholder="Location"
            value={job.location}
            onChange={handleChange}
            required
          />

          <input
            type="number"
            name="salary"
            placeholder="Salary"
            value={job.salary}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="experience"
            placeholder="Experience"
            value={job.experience}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="skills"
            placeholder="Skills (Java, React, SQL)"
            value={job.skills}
            onChange={handleChange}
            required
          />

          <select
            name="jobType"
            value={job.jobType}
            onChange={handleChange}
            required
          >
            <option value="">Select Job Type</option>
            <option value="FULL_TIME">Full Time</option>
            <option value="PART_TIME">Part Time</option>
            <option value="INTERNSHIP">Internship</option>
            <option value="REMOTE">Remote</option>
          </select>

          <textarea
            name="description"
            placeholder="Job Description"
            rows="8"
            value={job.description}
            onChange={handleChange}
            required
          />

          <button type="submit">
            Post Job
          </button>

        </form>
      </div>
    </>
  );
};

export default PostJob;