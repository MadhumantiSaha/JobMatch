import { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import "../App.css";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);

  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [salary, setSalary] = useState("");

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    filterJobs();
  }, [jobs, search, location, salary]);

  const fetchJobs = async () => {
    try {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");

      console.log("TOKEN =", token);
      console.log("ROLE =", role);

      let url;

      if (role === "job_provider") {
        url = "http://localhost:8080/job/my-jobs";
      } else {
        // Default: job seeker
        url = "http://localhost:8080/job";
      }

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      console.log(result);

      if (result.success) {
        setJobs(result.data);
        setFilteredJobs(result.data);
      }

    } catch (error) {
      console.error(error);
    }
  };
  const filterJobs = () => {
  let filtered = [...jobs];

    if (search !== "") {
      filtered = filtered.filter((job) => {
        const keyword = search.toLowerCase();

        return (
          job.postName?.toLowerCase().includes(keyword) ||
          job.skills?.toLowerCase().includes(keyword) ||
          job.location?.toLowerCase().includes(keyword) ||
          job.description?.toLowerCase().includes(keyword) ||
          job.jobType?.toLowerCase().includes(keyword)
        );
      });
    }

    if (location !== "") {
      filtered = filtered.filter(
        (job) => job.location === location
      );
    }

    if (salary !== "") {
      filtered = filtered.filter(
        (job) => Number(job.salary) >= Number(salary)
      );
    }

    setFilteredJobs(filtered);
  };

  const resetFilters = () => {
    setSearch("");
    setLocation("");
    setSalary("");
  };

  const locations = [...new Set(jobs.map((job) => job.location))];


  return (
    <>
      <Navbar />
      
      <div className="dashboard-container">

        {/* Search */}
        <div className="search-container"></div>

        <input
          type="text"
          placeholder="Search by title, role, skills, location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              filterJobs();
            }
          }}
        />

        {/* Filter container */}
        <div className="filter-container">
          <select
            value = {location}
            onChange={(e) => setLocation(e.target.value)}
          >
            <option value="">All Locations</option>

            {locations.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}

          </select>
          <select value={salary} onChange={(e) => setSalary(e.target.value)}>
            <option value="">Minimum Salary</option>

            <option value="300000">
              ₹3 LPA+
            </option>

            <option value="500000">
              ₹5 LPA+
            </option>

            <option value="800000">
              ₹8 LPA+
            </option>

            <option value="1200000">
              ₹12 LPA+
            </option>

          </select>

          <button onClick={resetFilters}>
            Reset
          </button>

        </div>
        <h3>
          {filteredJobs.length} Jobs Found
        </h3>

        <div className="job-grid">
          {filteredJobs.map((job) => (

            <div key={job.id} className="job-card">
              <h2>{job.postName}</h2>

              <p>
                <strong>Job ID:</strong> {job.id}
              </p>

              <p>
                <strong>Description:</strong>
                <br />
                {job.description}
              </p>

              <p>
                <strong>Skills:</strong>{" "}
                {job.skills}
              </p>

              <p>
                <strong>Location:</strong>{" "}
                {job.location}
              </p>

              <p>
                <strong>Salary:</strong> ₹
                {job.salary}
              </p>

              <p>
                <strong>Posted:</strong>{" "}
                {new Date(
                  job.start_date
                ).toLocaleDateString()}
              </p>
              

              <button className="apply-btn"
                onClick={() => {
                  if (role === "job_seeker") {
                    navigate(`/job/${job.id}`);
                  } else {
                    navigate(`/view-applicants/${job.id}`);
                  }
                }}
              >
                {role === "job_seeker" ? "Apply Now" : "View Applicants"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Dashboard;