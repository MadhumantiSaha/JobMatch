import { useState } from "react";
import axios from "axios";
import ProviderLayout from "../../components/provider-layout";

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
    <ProviderLayout>
      <div className="container">
        <h1>Post a Job</h1>

        <form className="post-job-form" onSubmit={postJob}>
          <div className="input-group">
            <label>Job Title</label>
            <input
              type="text"
              name="postName"
              placeholder="e.g. Senior Backend Engineer"
              value={job.postName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Company</label>
            <input
              type="text"
              name="company"
              placeholder="Company name"
              value={job.company}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Location</label>
            <input
              type="text"
              name="location"
              placeholder="e.g. Bengaluru / Remote"
              value={job.location}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Salary</label>
            <input
              type="number"
              name="salary"
              placeholder="Annual salary"
              value={job.salary}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Experience</label>
            <input
              type="text"
              name="experience"
              placeholder="e.g. 2-4 years"
              value={job.experience}
              onChange={handleChange}
              required
            />
          </div>

          {/* ========== Skills Section ========== */}
          <div className="input-group skills-field">
            <label>Required Skills</label>

            {skills.length > 0 && (
              <div className="skills-chip-list">
                {skills.map((skill) => (
                  <span key={skill} className="skill-chip">
                    {skill}
                    <button
                      type="button"
                      className="chip-remove"
                      onClick={() => handleRemoveSkill(skill)}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}

            <div className="field-row">
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
              />
              <button type="button" className="btn-secondary" onClick={handleAddSkill}>
                Add
              </button>
            </div>
          </div>
          {/* ==================================== */}

          <div className="input-group">
            <label>Job Type</label>
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
          </div>

          <div className="input-group">
            <label>Job Description</label>
            <textarea
              name="description"
              placeholder="Describe the role, responsibilities and requirements..."
              rows="8"
              value={job.description}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn-primary btn-block">Post Job</button>
        </form>
      </div>
    </ProviderLayout>
  );
};

export default PostJob;