import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";

const UpdateProfile = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;

  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    email: "",
    experienceYears: "",
  });

  const [skills, setSkills] = useState([]);          // current skills list
  const [newSkill, setNewSkill] = useState("");      // input for adding skill
  const [imageFile, setImageFile] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Load current user data
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        contact: user.contact || "",
        email: user.email || "",
        experienceYears: user.experienceYears ?? "",
      });

      // skills may come as array or null
      setSkills(user.skills ? [...user.skills] : []);
    }
  }, []);

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

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const formDataToSend = new FormData();

    // Basic fields
    formDataToSend.append("name", formData.name);
    formDataToSend.append("contact", formData.contact);
    formDataToSend.append("email", formData.email);

    // Experience years
    if (formData.experienceYears !== "") {
      formDataToSend.append("experienceYears", formData.experienceYears);
    }

    // ===== Multiple form fields for skills (Option A) =====
    skills.forEach((skill) => {
      formDataToSend.append("skills", skill);   // important: same name "skills"
    });
    // =====================================================

    // Files (optional)
    if (imageFile) formDataToSend.append("imageFile", imageFile);
    if (resumeFile) formDataToSend.append("resumeFile", resumeFile);

    try {
      const res = await fetch(`${API_BASE_URL}/user`, {  // change URL if needed
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      const data = await res.json();

      if (res.ok) {
        // Update localStorage with the latest data (including AI skills)
        localStorage.setItem("user", JSON.stringify(data.data));

        // Update the skills shown on the form immediately
        if (data.data.skills) {
          setSkills([...data.data.skills]);
        }

        if (resumeFile) {
          setMessage("Profile updated! Skills were automatically extracted from your resume.");
        } else {
          setMessage("Profile updated successfully!");
        }

        setTimeout(() => navigate("/profile"), 1800);
      } else {
        setMessage(data.message || "Update failed");
      }
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="register-container">
      <div className="register-card">
        <h2>Update Profile</h2>

        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div className="input-group">
            <label>Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          {/* Email */}
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          {/* Contact */}
          <div className="input-group">
            <label>Contact</label>
            <input
              type="text"
              value={formData.contact}
              onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
            />
          </div>

          {/* Experience Years */}
          <div className="input-group">
            <label>Years of Experience</label>
            <input
              type="number"
              min="0"
              max="50"
              value={formData.experienceYears}
              onChange={(e) =>
                setFormData({ ...formData, experienceYears: e.target.value })
              }
              placeholder="e.g. 3"
            />
          </div>

          {/* ===================== Skills Section ===================== */}
          <div className="input-group skills-field">
            <label>Skills</label>

            {/* Current skills as chips */}
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

            {/* Add new skill */}
            <div className="field-row">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Add a skill (e.g. Java)"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddSkill();
                  }
                }}
              />
              <button type="button" onClick={handleAddSkill} className="btn-secondary">
                Add
              </button>
            </div>
          </div>
          {/* ======================================================== */}

          {/* Image */}
          <div className="input-group">
            <label>Profile Image</label>
            <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} />
          </div>

          {/* Resume (only for job_seeker) */}
          {user.role === "job_seeker" && (
            <div className="input-group">
              <label>Resume (PDF)</label>
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => setResumeFile(e.target.files[0])}
              />
              <small className="state-message" style={{ padding: 0, textAlign: "left", display: "block", marginTop: "6px" }}>
                Upload your resume and skills will be extracted automatically using AI.
              </small>
            </div>
          )}

          <button type="submit" className="register-btn btn-block" disabled={loading}>
            {loading ? "Updating..." : "Update Profile"}
          </button>

          {message && (
            <p className={`auth-message ${message.toLowerCase().includes("success") ? "success" : "error"}`}>
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default UpdateProfile;