import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar";
import "../../App.css";

const Jobs = () => {
  const navigate = useNavigate();

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
      const response = await fetch("http://localhost:8080/job");

      const result = await response.json();

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

    // Location
    if (location !== "") {
      filtered = filtered.filter(
        (job) => job.location === location
      );
    }

    // Salary
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

      <div className="jobs-page">

        <h1>Find Your Dream Job</h1>

        {/* Search */}

        <div className="search-container">

          <input
            type="text"
            placeholder="Search by title, skills, location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

        </div>

        {/* Filters */}

        <div className="filter-container">

          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          >
            <option value="">All Locations</option>

            {locations.map((loc) => (
              <option key={loc}>
                {loc}
              </option>
            ))}

          </select>

          <select
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
          >
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

            <div
              key={job.id}
              className="job-card"
            >

              <h2>{job.postName}</h2>

              <p>

                <strong>Location:</strong>{" "}

                {job.location}

              </p>

              <p>

                <strong>Salary:</strong>

                ₹{job.salary}

              </p>

              <p>

                <strong>Skills:</strong>

                {job.skills}

              </p>

              <p>

                {job.description.length > 120

                  ? job.description.substring(0, 120) + "..."

                  : job.description}

              </p>

              <button
                className="apply-btn"
                onClick={() =>
                  navigate(`/job/${job.id}`)
                }
              >
                View Details
              </button>

            </div>

          ))}

        </div>

      </div>
    </>
  );
};

export default Jobs;