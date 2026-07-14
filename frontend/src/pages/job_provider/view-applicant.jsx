import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../../components/navbar";

const ViewApplicants = () => {
  const { jobId } = useParams();

  const [applications, setApplications] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchApplicants();
  }, []);

  const fetchApplicants = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/application/job/${jobId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setApplications(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  const updateStatus = async (applicationId, status) => {
    try {
      await axios.put(
        `http://localhost:8080/application/${applicationId}/status`,
        null,
        {
          params: { status },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchApplicants();
    } catch (err) {
      console.log(err);
      alert("Unable to update status");
    }
  };

  const statusColor = (status) => {
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

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-100 py-8">
        <div className="max-w-6xl mx-auto px-4">

          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">
              Applicants
            </h1>

            <div className="bg-blue-600 text-white px-5 py-2 rounded-xl shadow">
              Total Applicants : {applications.length}
            </div>
          </div>

          {applications.length === 0 ? (
            <div className="bg-white rounded-xl shadow p-10 text-center">
              No applicants yet.
            </div>
          ) : (
            <div className="space-y-5">
              {applications.map((application) => (
                <div
                  key={application.id}
                  className="bg-white rounded-2xl shadow-md hover:shadow-lg transition p-6"
                >
                  <div className="flex justify-between">

                    <div>
                      <h2 className="text-2xl font-semibold">
                        {application.name}
                      </h2>

                      <p className="text-gray-600 mt-2">
                        📧 {application.email}
                      </p>

                      <p className="text-gray-600">
                        📞 {application.contact}
                      </p>

                      <p className="text-gray-600">
                        Applied :
                        {" "}
                        {new Date(application.appliedAt).toLocaleDateString()}
                      </p>

                      {application.resume && (
                      <a
                        href={`http://localhost:8080/files/resumes/${application.resume}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-block mt-4 text-blue-600 hover:underline font-medium flex items-center gap-2"
                      >
                        📄 View/Download Resume
                      </a>
                    )}
                    </div>

                    <div className="text-right">

                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColor(
                          application.status
                        )}`}
                      >
                        {application.status}
                      </span>

                      <div className="mt-5">

                        <select
                          className="border rounded-lg px-3 py-2 w-52"
                          value={application.status}
                          onChange={(e) =>
                            updateStatus(
                              application.id,
                              e.target.value
                            )
                          }
                        >
                          <option value="PENDING">
                            Pending
                          </option>

                          <option value="SHORTLISTED">
                            Shortlisted
                          </option>

                          <option value="INTERVIEW">
                            Interview
                          </option>

                          <option value="REJECTED">
                            Rejected
                          </option>

                          <option value="HIRED">
                            Hired
                          </option>
                        </select>

                      </div>

                    </div>

                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ViewApplicants;