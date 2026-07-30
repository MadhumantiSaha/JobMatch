import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

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
      const res = await fetch("http://localhost:8080/user", {  // change URL if needed
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          // Do NOT set Content-Type → browser will set multipart/form-data automatically
        },
        body: formDataToSend,
      });

      const data = await res.json();

      if (res.ok) {
        // Update localStorage with new data
        localStorage.setItem("user", JSON.stringify(data.data));
        setMessage("Profile updated successfully!");
        setTimeout(() => navigate("/profile"), 1500);
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

  if (!user) {
    return <div>Please login first</div>;
  }

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
          <div className="input-group">
            <label>Skills</label>

            {/* Current skills as chips */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "10px" }}>
              {skills.map((skill) => (
                <span
                  key={skill}
                  style={{
                    background: "#e0e0e0",
                    padding: "5px 12px",
                    borderRadius: "20px",
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
                      color: "red",
                      cursor: "pointer",
                      fontWeight: "bold",
                    }}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            {/* Add new skill */}
            <div style={{ display: "flex", gap: "8px" }}>
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
              <button type="button" onClick={handleAddSkill} className="register-btn">
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
              <label>Resume</label>
              <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => setResumeFile(e.target.files[0])} />
            </div>
          )}

          <button type="submit" className="register-btn" disabled={loading}>
            {loading ? "Updating..." : "Update Profile"}
          </button>

          {message && (
            <p style={{ marginTop: "15px", color: message.includes("success") ? "green" : "red" }}>
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default UpdateProfile;