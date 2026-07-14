import { useState } from "react";

const UpdateProfile = () => {
  const userString = localStorage.getItem("user");
  const user = userString
    ? JSON.parse(userString)
    : null;

  const [name, setName] = useState(
    user?.name || ""
  );

  const [contact, setContact] = useState(
    user?.contact || ""
  );

  const [imageFile, setImage] = useState(null);
  const [resumeFile, setResume] = useState(null);
  const [companyFile, setCompanyDetails] =
    useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token =
        localStorage.getItem("token");

      const formData = new FormData();

      const updatedUser = {
        name,
        contact,
      };

      formData.append(
        "user",
        new Blob(
          [JSON.stringify(updatedUser)],
          {
            type: "application/json",
          }
        )
      );

      if (imageFile) {
        formData.append("image", imageFile);
      }

      if (resumeFile) {
        formData.append("resume", resumeFile);
      }

      if (companyFile) {
        formData.append(
          "companyDetails",
          companyFile
        );
      }

      if (!user) {
        return <h2>No user data found. Please login again.</h2>;
      }

      const response = await fetch(
        "http://localhost:8080/user",
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const result =
        await response.json();

      console.log(result);

      if (result.success) {
        alert("Profile Updated Successfully");

        localStorage.setItem(
          "user",
          JSON.stringify(result.data)
        );
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error(error);
      alert("Update Failed");
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2>Update Profile</h2>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
            />
          </div>

          <div className="input-group">
            <label>Contact</label>
            <input
              type="text"
              value={contact}
              onChange={(e) =>
                setContact(e.target.value)
              }
            />
          </div>

          <div className="input-group">
            <label>Profile Image</label>
            <input
              type="file"
              onChange={(e) =>
                setImage(
                  e.target.files[0]
                )
              }
            />
          </div>

          {user?.role ===
            "job_seeker" && (
            <div className="input-group">
              <label>Resume</label>
              <input
                type="file"
                onChange={(e) =>
                  setResume(
                    e.target.files[0]
                  )
                }
              />
            </div>
          )}

          {user?.role ===
            "job_provider" && (
            <div className="input-group">
              <label>
                Company Details
              </label>
              <input
                type="file"
                onChange={(e) =>
                  setCompanyDetails(
                    e.target.files[0]
                  )
                }
              />
            </div>
          )}

          <button
            type="submit"
            className="register-btn"
          >
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfile;