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
    description: "",
  });

  const [skills, setSkills] = useState([]);     // Skills as array
  const [newSkill, setNewSkill] = useState(""); // Input for adding skill

  const handleChange = (e) => {
    setJob({
      ...job,
      [e.target.name]: e.target.value,
    });
  };

  // Add skill
  const handleAddSkill = () => {
    const skill = newSkill.trim();
    if (skill && !skills.includes(skill)) {
      setSkills([...skills, skill]);
      setNewSkill("");
    }
  };

  // Remove skill
  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const postJob = async (e) => {
    e.preventDefault();

    if (skills.length === 0) {
      alert("Please add at least one skill");
      return;
    }

    try {
      const payload = {
        ...job,
        skills: skills, // Send as array → Spring will convert to Set
      };

      const response = await axios.post(
        "http://localhost:8080/job/jobpost",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log(response.data);
      alert("Job Posted Successfully!");

      // Reset form
      setJob({
        postName: "",
        location: "",
        salary: "",
        experience: "",
        jobType: "",
        description: "",
      });
      setSkills([]);
      setNewSkill("");
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
            name="company"
            placeholder="Company"
            value={job.company}
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
            placeholder="Experience (e.g. 2-4 years)"
            value={job.experience}
            onChange={handleChange}
            required
          />

          {/* ========== Skills Section ========== */}
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "6px", fontWeight: "500" }}>
              Required Skills
            </label>

            {/* Skills chips */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "8px",
                marginBottom: "10px",
              }}
            >
              {skills.map((skill) => (
                <span
                  key={skill}
                  style={{
                    background: "#e8f0fe",
                    color: "#1a73e8",
                    padding: "6px 12px",
                    borderRadius: "20px",
                    fontSize: "14px",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#d93025",
                      cursor: "pointer",
                      fontWeight: "bold",
                      fontSize: "16px",
                      lineHeight: 1,
                    }}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            {/* Add skill input */}
            <div style={{ display: "flex", gap: "8px" }}>
              <input
                type="text"
                placeholder="Add a skill (e.g. Java)"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddSkill();
                  }
                }}
                style={{ flex: 1 }}
              />
              <button type="button" onClick={handleAddSkill}>
                Add
              </button>
            </div>
          </div>
          {/* ==================================== */}

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

          <button type="submit">Post Job</button>
        </form>
      </div>
    </>
  );
};

export default PostJob;