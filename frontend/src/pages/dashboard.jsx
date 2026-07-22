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
  const [seats, setSeats] = useState("");

  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);


  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [location, salary]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 100
      ) {
        fetchJobs();
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () =>
      window.removeEventListener("scroll", handleScroll);

  }, [page, hasMore, loading]);


  const fetchJobs = async () => {
    if (loading || !hasMore) return;

    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      let url =
        role === "job_provider"
          ? "http://localhost:8080/job/my-jobs"
          : `http://localhost:8080/job?page=${page}&size=6`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (role === "job_provider") {
        // my-jobs endpoint still returns {success,data}
        if (result.success) {
          setJobs(result.data);
          setFilteredJobs(result.data);
        }
      } else {
        // pagination endpoint
        setJobs((prev) => [...prev, ...result.content]);
        setFilteredJobs((prev) => [...prev, ...result.content]);

        setHasMore(!result.last);
        setPage((prev) => prev + 1);
      }
    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  };

  const searchJobs = async (keyword) => {
    try {
      const token = localStorage.getItem("token");

      if (keyword.trim() === "") {
        fetchJobs();
        return;
      }

      const response = await fetch(
        `http://localhost:8080/job/search?keyword=${encodeURIComponent(keyword)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (result.success) {
        setJobs(result.data);
        setFilteredJobs(result.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const applyFilters = () => {
    let filtered = [...jobs];

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
    fetchJobs();
  };

  const locations = [...new Set(jobs.map((job) => job.location))];

  return (
    <>
      <Navbar />

      <div className="dashboard-container">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search by title, skills, location..."
            value={search}
            // onChange={(e) => setSearch(e.target.value)}
            // onKeyDown={(e) => {
            //   if (e.key === "Enter") {
            //     searchJobs();
            //   }
            onChange={(e) => {
              const value = e.target.value;
              setSearch(value);
              searchJobs(value);
            }}
          />
        </div>

        <div className="filter-container">
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          >
            <option value="">All Locations</option>

            {locations.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>

          <select
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
          >
            <option value="">Minimum Salary</option>
            <option value="300000">₹3 LPA+</option>
            <option value="500000">₹5 LPA+</option>
            <option value="800000">₹8 LPA+</option>
            <option value="1200000">₹12 LPA+</option>
          </select>

          <button onClick={resetFilters}>
            Reset
          </button>
        </div>

        <h3>{filteredJobs.length} Jobs Found</h3>

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
                <strong>Skills:</strong> {job.skills}
              </p>

              <p>
                <strong>Location:</strong> {job.location}
              </p>

              <p>
                <strong>Salary:</strong> ₹{job.salary}
              </p>

              <p>
                <strong>Posted:</strong>{" "}
                {new Date(job.start_date).toLocaleDateString()}
              </p>

              <button
                className="apply-btn"
                onClick={() => {
                  if (role === "job_seeker") {
                    navigate(`/job/${job.id}`);
                  } else {
                    navigate(`/view-applicants/${job.id}`);
                  }
                }}
              >
                {role === "job_seeker"
                  ? "Apply Now"
                  : "View Applicants"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Dashboard;ort default Dashboard;
