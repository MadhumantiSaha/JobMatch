import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar";

const JobSeekerDashboard = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);

  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [salary, setSalary] = useState("");

  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [location, salary, jobs]);

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
    return () => window.removeEventListener("scroll", handleScroll);
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
        if (result.success) {
          setJobs(result.data || []);
          setFilteredJobs(result.data || []);
        }
      } else {
        // pagination
        const newJobs = result.content || [];
        setJobs((prev) => [...prev, ...newJobs]);
        setFilteredJobs((prev) => [...prev, ...newJobs]);

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
        // reset to original list
        setFilteredJobs(jobs);
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
        setJobs(result.data || []);
        setFilteredJobs(result.data || []);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const applyFilters = () => {
    let filtered = [...jobs];

    if (location) {
      filtered = filtered.filter((job) => job.location === location);
    }

    if (salary) {
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
    setFilteredJobs(jobs);
  };

  // Clean locations (remove null/undefined/empty + unique)
  const locations = [
    ...new Set(
      jobs
        .map((job) => job.location)
        .filter((loc) => loc && loc.trim() !== "")
    ),
  ];

  return (
    <>
      <Navbar />

      <div className="dashboard-container">
        {/* Search */}
        <div className="search-container">
          <input
            type="text"
            placeholder="Search by title, skills, location..."
            value={search}
            onChange={(e) => {
              const value = e.target.value;
              setSearch(value);
              searchJobs(value);
            }}
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

          <button className="btn-secondary" onClick={resetFilters}>Reset</button>
        </div>

        <h3 className="jobs-found-heading">{filteredJobs.length} Jobs Found</h3>

        {/* Job Cards */}
        <div className="job-grid">
          {filteredJobs.map((job) => (
            <div key={job.id} className="job-card">
              <h2>{job.postName}</h2>

              <p>
                <strong>Job ID:</strong> {job.id}
              </p>

              <p>
                <strong>Company:</strong> {job.company}
              </p>

              <p>
                <strong>Description:</strong>
                <br />
                {job.description}
              </p>

              {/* Skills */}
              <p><strong>Skills:</strong></p>
              {job.skills && job.skills.length > 0 ? (
                <div className="job-card-skills">
                  {Array.from(job.skills).map((skill) => (
                    <span key={skill} className="skill-chip">
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p>Not specified</p>
              )}

              <p>
                <strong>Location:</strong> {job.location || "Not specified"}
              </p>

              <p>
                <strong>Salary:</strong> ₹{job.salary?.toLocaleString() || "N/A"}
              </p>

              <p>
                <strong>Posted by:</strong> {job.postedBy || "Unknown"}
              </p>

              <p>
                <strong>Posted:</strong>{" "}
                {job.start_date
                  ? new Date(job.start_date).toLocaleDateString()
                  : "N/A"}
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
                {role === "job_seeker" ? "Apply Now" : "View Applicants"}
              </button>
            </div>
          ))}
        </div>

        {loading && <p style={{ textAlign: "center" }}>Loading more jobs...</p>}
      </div>
    </>
  );
};

export default JobSeekerDashboard;