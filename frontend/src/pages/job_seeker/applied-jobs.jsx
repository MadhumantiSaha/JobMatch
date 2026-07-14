import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/navbar";

const AppliedJobs = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

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

      console.log("Applications:", res.data.data);
      setApplications(res.data.data || []);
    } catch (err) {
      console.error("Error fetching applications:", err);
      alert("Failed to load your applications.");
    } finally {
      setLoading(false);
    }
  };

  const withdrawApplication = async (applicationId) => {
    if (!window.confirm("Are you sure you want to withdraw this application?")) {
      return;
    }

    try {
      await axios.delete(
        `http://localhost:8080/application/${applicationId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Application withdrawn successfully.");
      fetchApplications(); // Refresh list
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Unable to withdraw application.");
    }
  };

  const viewJobDetails = (jobId) => {
    window.location.href = `/job/${jobId}`; // or use navigate if using useNavigate
  };

  if (loading) return <h2>Loading your applications...</h2>;

  return (
    <>
      <Navbar />

      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">My Applied Jobs</h1>

        {applications.length === 0 ? (
          <div className="text-center py-10 bg-gray-100 rounded-xl">
            <p className="text-xl text-gray-600">You haven't applied to any jobs yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {applications.map((application) => (
              <div
                key={application.id}
                className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-semibold">
                      {application.job?.postName || "Job Title"}
                    </h2>
                    <p className="text-gray-600 mt-1">
                      {application.job?.companyName}
                    </p>

                    <div className="mt-3 space-y-1 text-sm text-gray-600">
                      <p><strong>Job ID:</strong> {application.job?.id}</p>
                      <p><strong>Location:</strong> {application.job?.location}</p>
                      <p><strong>Salary:</strong> {application.job?.salary}</p>
                      <p><strong>Applied On:</strong> {new Date(application.appliedAt).toLocaleDateString()}</p>
                    </div>

                    <p className="mt-3">
                      <span className="font-medium">Status: </span>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(application.status)}`}>
                        {application.status}
                      </span>
                    </p>
                  </div>

                  <div className="flex flex-col gap-3">
                    <button
                      onClick={() => viewJobDetails(application.job?.id)}
                      className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                      View Job Details
                    </button>

                    <button
                      onClick={() => withdrawApplication(application.id)}
                      className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700 transition"
                    >
                      Withdraw Application
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

// Helper function for status colors
const getStatusColor = (status) => {
  switch (status) {
    case "PENDING":
      return "bg-yellow-100 text-yellow-700";
    case "SHORTLISTED":
      return "bg-blue-100 text-blue-700";
    case "INTERVIEW":
      return "bg-purple-100 text-purple-700";
    case "HIRED":
      return "bg-green-100 text-green-700";
    case "REJECTED":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

export default AppliedJobs;