import { useCallback, useEffect, useState } from "react";
import axios from "axios";

// Fetches every job the recruiter has posted, then every application for
// each job, and flattens the applications into one array where each entry
// is tagged with its job's id/title/location/type. Every provider page that
// needs a cross-job view (Dashboard, Analytics, All Applicants, Shortlisted,
// Interviews) shares this single hook instead of re-fetching independently.
export const useProviderData = () => {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAll = useCallback(async () => {
    const token = localStorage.getItem("token");
    setLoading(true);
    setError(null);

    try {
      const jobsRes = await axios.get("http://localhost:8080/job/my-jobs", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const jobList = jobsRes.data.data || [];
      setJobs(jobList);

      if (jobList.length === 0) {
        setApplications([]);
        return;
      }

      const results = await Promise.allSettled(
        jobList.map((job) =>
          axios.get(`http://localhost:8080/application/job/${job.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
        )
      );

      const allApplications = [];
      results.forEach((result, index) => {
        if (result.status !== "fulfilled") return;
        const job = jobList[index];
        const apps = result.value.data.data || [];
        apps.forEach((app) => {
          allApplications.push({
            ...app,
            jobId: job.id,
            jobTitle: job.postName,
            jobLocation: job.location,
            jobType: job.jobType,
          });
        });
      });

      setApplications(allApplications);
    } catch (err) {
      console.error(err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return { jobs, applications, loading, error, refetch: fetchAll };
};

export const getSeekerId = (application) =>
  application.jobSeekerId ||
  application.jobSeeker?.id ||
  application.job_seeker_id ||
  null;

export const timeAgo = (dateString) => {
  if (!dateString) return "—";
  const date = new Date(dateString);
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `${weeks}w ago`;
  return date.toLocaleDateString();
};
