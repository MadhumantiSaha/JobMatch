import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import ProviderLayout from "../../components/provider-layout";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../config";

const EMPTY_STATS = {
  total: 0,
  PENDING: 0,
  SHORTLISTED: 0,
  INTERVIEW: 0,
  HIRED: 0,
  REJECTED: 0,
};

const computeStats = (applications = []) => {
  const stats = { ...EMPTY_STATS, total: applications.length };
  applications.forEach((app) => {
    if (stats[app.status] !== undefined) stats[app.status] += 1;
  });
  return stats;
};

const formatSkills = (skills) => {
  if (!skills) return "—";
  if (Array.isArray(skills)) return skills.join(", ");
  if (skills instanceof Set) return Array.from(skills).join(", ");
  return skills;
};

const MyJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [jobStats, setJobStats] = useState({}); // jobId -> stats
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [locationFilter, setLocationFilter] = useState("ALL");

  const navigate = useNavigate();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    const token = localStorage.getItem("token");
    setLoading(true);

    try {
      const res = await axios.get(`${API_BASE_URL}/job/my-jobs`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const jobList = res.data.data || [];
      setJobs(jobList);
      fetchStatsForJobs(jobList);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Pull applicant counts (total / shortlisted / interview / hired ...) for every job
  // so the dashboard can show real analytics instead of just a job list.
  const fetchStatsForJobs = async (jobList) => {
    if (!jobList || jobList.length === 0) {
      setJobStats({});
      return;
    }

    const token = localStorage.getItem("token");
    setStatsLoading(true);

    try {
      const results = await Promise.allSettled(
        jobList.map((job) =>
          axios.get(`${API_BASE_URL}/application/job/${job.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
        )
      );

      const nextStats = {};
      results.forEach((result, index) => {
        const jobId = jobList[index].id;
        const apps =
          result.status === "fulfilled" ? result.value.data.data || [] : [];
        nextStats[jobId] = computeStats(apps);
      });

      setJobStats(nextStats);
    } catch (err) {
      console.error(err);
    } finally {
      setStatsLoading(false);
    }
  };

  const deleteJob = async (jobId) => {
    const token = localStorage.getItem("token");

    if (!window.confirm("Are you sure you want to delete this job?")) {
      return;
    }

    setDeletingId(jobId);
    try {
      await axios.delete(`${API_BASE_URL}/job/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Job deleted successfully.");
      fetchJobs();
    } catch (err) {
      console.error(err);
      alert("Unable to delete job.");
    } finally {
      setDeletingId(null);
    }
  };

  // Distinct dropdown options, derived straight from the jobs the recruiter has posted.
  const jobTypes = useMemo(
    () =>
      Array.from(new Set(jobs.map((j) => j.jobType).filter(Boolean))).sort(),
    [jobs]
  );

  const locations = useMemo(
    () =>
      Array.from(new Set(jobs.map((j) => j.location).filter(Boolean))).sort(),
    [jobs]
  );

  const filteredJobs = useMemo(() => {
    const query = search.trim().toLowerCase();

    return jobs.filter((job) => {
      const matchesSearch =
        !query ||
        String(job.id).toLowerCase().includes(query) ||
        (job.postName || "").toLowerCase().includes(query);

      const matchesType = typeFilter === "ALL" || job.jobType === typeFilter;
      const matchesLocation =
        locationFilter === "ALL" || job.location === locationFilter;

      return matchesSearch && matchesType && matchesLocation;
    });
  }, [jobs, search, typeFilter, locationFilter]);

  const hasActiveFilters =
    search.trim() !== "" || typeFilter !== "ALL" || locationFilter !== "ALL";

  const clearFilters = () => {
    setSearch("");
    setTypeFilter("ALL");
    setLocationFilter("ALL");
  };

  // Portfolio-wide totals across every posted job (independent of the filters/search
  // above, so the top cards always reflect the recruiter's whole pipeline).
  const overallStats = useMemo(() => {
    return jobs.reduce(
      (acc, job) => {
        const stats = jobStats[job.id] || EMPTY_STATS;
        acc.totalApplicants += stats.total;
        acc.shortlisted += stats.SHORTLISTED;
        acc.interview += stats.INTERVIEW;
        acc.hired += stats.HIRED;
        return acc;
      },
      { totalApplicants: 0, shortlisted: 0, interview: 0, hired: 0 }
    );
  }, [jobs, jobStats]);

  return (
    <ProviderLayout>
      <div className="rp-content">
        <div className="rp-page-header">
          <div>
            <h1>My Posted Jobs</h1>
            <p>Track applicants, shortlists and interviews across every job you've posted.</p>
          </div>
          <button className="rp-btn-primary" onClick={() => navigate("/post-job")}>
            + Post New Job
          </button>
        </div>

        {/* ---- Analytics overview ---- */}
        <div className="rp-stats-row">
          <div className="rp-stat-card rp-stat-white">
            <div className="rp-stat-top">
              <span className="rp-stat-icon">📋</span>
            </div>
            <div className="rp-stat-value">{jobs.length}</div>
            <div className="rp-stat-label">Total Jobs Posted</div>
          </div>

          <div className="rp-stat-card rp-stat-blue">
            <div className="rp-stat-top">
              <span className="rp-stat-icon">👥</span>
            </div>
            <div className="rp-stat-value">
              {statsLoading ? "…" : overallStats.totalApplicants}
            </div>
            <div className="rp-stat-label">Total Applicants</div>
          </div>

          <div className="rp-stat-card rp-stat-yellow">
            <div className="rp-stat-top">
              <span className="rp-stat-icon">⭐</span>
            </div>
            <div className="rp-stat-value">
              {statsLoading ? "…" : overallStats.shortlisted}
            </div>
            <div className="rp-stat-label">Shortlisted</div>
          </div>

          <div className="rp-stat-card rp-stat-purple">
            <div className="rp-stat-top">
              <span className="rp-stat-icon">🗓️</span>
            </div>
            <div className="rp-stat-value">
              {statsLoading ? "…" : overallStats.interview}
            </div>
            <div className="rp-stat-label">In Interview</div>
          </div>

          <div className="rp-stat-card rp-stat-green">
            <div className="rp-stat-top">
              <span className="rp-stat-icon">✅</span>
            </div>
            <div className="rp-stat-value">
              {statsLoading ? "…" : overallStats.hired}
            </div>
            <div className="rp-stat-label">Hired</div>
          </div>
        </div>

        {/* ---- Search & filters ---- */}
        <div className="rp-card rp-filterbar-card">
          <div className="rp-filterbar">
            <div className="rp-filter-search">
              <span className="rp-search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search by job ID or job name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <select
              className="rp-filter-select"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="ALL">All Job Types</option>
              {jobTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>

            <select
              className="rp-filter-select"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
            >
              <option value="ALL">All Locations</option>
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>

            {hasActiveFilters && (
              <button className="btn-secondary rp-btn-sm" onClick={clearFilters}>
                Clear
              </button>
            )}
          </div>

          {jobs.length > 0 && (
            <div className="rp-filter-result-count">
              Showing {filteredJobs.length} of {jobs.length} job
              {jobs.length !== 1 ? "s" : ""}
            </div>
          )}
        </div>

        {/* ---- Jobs table ---- */}
        {loading ? (
          <div className="rp-empty">
            <p>Loading your jobs…</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📋</div>
            <h3>No jobs posted yet</h3>
            <p>Jobs you post will show up here.</p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="rp-empty">
            <div className="rp-empty-icon">🔍</div>
            <h3>No jobs match your filters</h3>
            <p>Try a different search term or clear the filters.</p>
            <button className="rp-btn-primary" onClick={clearFilters}>
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="rp-card">
            <div className="rp-table-wrap">
              <table className="rp-table">
                <thead>
                  <tr>
                    <th>Job</th>
                    <th>Type</th>
                    <th>Location</th>
                    <th>Salary</th>
                    <th>Applicants</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredJobs.map((job) => {
                    const stats = jobStats[job.id] || EMPTY_STATS;
                    return (
                      <tr key={job.id}>
                        <td>
                          <div className="rp-job-title">{job.postName}</div>
                          <div className="rp-job-meta">
                            ID: {job.id} · {job.experience || "—"} exp
                          </div>
                          <div className="rp-job-meta">{formatSkills(job.skills)}</div>
                        </td>
                        <td>
                          <span className="rp-type-badge">{job.jobType || "—"}</span>
                        </td>
                        <td>{job.location || "—"}</td>
                        <td>₹{job.salary}</td>
                        <td>
                          {statsLoading ? (
                            <span className="rp-job-meta">Loading…</span>
                          ) : stats.total === 0 ? (
                            <span className="rp-job-meta">No applicants yet</span>
                          ) : (
                            <div className="rp-row-stats">
                              <div className="rp-row-stat">
                                <span className="rp-row-stat-value">{stats.total}</span>
                                <span className="rp-row-stat-label">Total</span>
                              </div>
                              <div className="rp-row-stat">
                                <span className="rp-row-stat-value blue">
                                  {stats.SHORTLISTED}
                                </span>
                                <span className="rp-row-stat-label">Shortlist</span>
                              </div>
                              <div className="rp-row-stat">
                                <span className="rp-row-stat-value purple">
                                  {stats.INTERVIEW}
                                </span>
                                <span className="rp-row-stat-label">Interview</span>
                              </div>
                              <div className="rp-row-stat">
                                <span className="rp-row-stat-value green">
                                  {stats.HIRED}
                                </span>
                                <span className="rp-row-stat-label">Hired</span>
                              </div>
                            </div>
                          )}
                        </td>
                        <td>
                          <div className="rp-row-actions">
                            <button
                              className="rp-btn-primary sm"
                              onClick={() => navigate(`/view-applicants/${job.id}`)}
                            >
                              View
                            </button>
                            <button
                              className="edit-btn rp-btn-sm"
                              onClick={() => navigate(`/edit-job/${job.id}`)}
                            >
                              Edit
                            </button>
                            <button
                              className="delete-btn rp-btn-sm"
                              disabled={deletingId === job.id}
                              onClick={() => deleteJob(job.id)}
                            >
                              {deletingId === job.id ? "…" : "Delete"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </ProviderLayout>
  );
};

export default MyJobs;
