import { useMemo } from "react";
import ProviderLayout from "../../components/provider-layout";
import { useProviderData } from "../../hooks/useProviderData";

const DAYS_TO_SHOW = 14;

const dayKey = (date) => date.toISOString().slice(0, 10);

const buildTimeline = (applications) => {
  const days = [];
  for (let i = DAYS_TO_SHOW - 1; i >= 0; i--) {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - i);
    days.push({ key: dayKey(d), date: d, count: 0 });
  }

  const byKey = Object.fromEntries(days.map((d) => [d.key, d]));
  applications.forEach((app) => {
    if (!app.appliedAt) return;
    const key = dayKey(new Date(app.appliedAt));
    if (byKey[key]) byKey[key].count += 1;
  });

  return days;
};

const Analytics = () => {
  const { jobs, applications, loading } = useProviderData();

  const statusCounts = useMemo(() => {
    const counts = { PENDING: 0, SHORTLISTED: 0, INTERVIEW: 0, HIRED: 0, REJECTED: 0 };
    applications.forEach((app) => {
      if (counts[app.status] !== undefined) counts[app.status] += 1;
    });
    return counts;
  }, [applications]);

  const timeline = useMemo(() => buildTimeline(applications), [applications]);

  const hireRate = applications.length
    ? Math.round((statusCounts.HIRED / applications.length) * 100)
    : 0;

  // Distinct job types among the recruiter's posted jobs, with applicant totals.
  const typeBreakdown = useMemo(() => {
    const byType = {};
    jobs.forEach((job) => {
      const type = job.jobType || "Other";
      byType[type] = byType[type] || { jobs: 0, applicants: 0 };
      byType[type].jobs += 1;
    });
    applications.forEach((app) => {
      const type = app.jobType || "Other";
      byType[type] = byType[type] || { jobs: 0, applicants: 0 };
      byType[type].applicants += 1;
    });
    return Object.entries(byType).sort((a, b) => b[1].applicants - a[1].applicants);
  }, [jobs, applications]);

  // ---- SVG line chart geometry ----
  const chartWidth = 680;
  const chartHeight = 160;
  const maxCount = Math.max(1, ...timeline.map((d) => d.count));
  const points = timeline.map((d, i) => {
    const x = (i / (timeline.length - 1)) * (chartWidth - 20) + 10;
    const y = chartHeight - 10 - (d.count / maxCount) * (chartHeight - 30);
    return `${x},${y}`;
  });

  const pipelineColors = {
    PENDING: "#94a3b8",
    SHORTLISTED: "#3b82f6",
    INTERVIEW: "#8b5cf6",
    HIRED: "#22c55e",
    REJECTED: "#ef4444",
  };

  return (
    <ProviderLayout>
      <div className="rp-content">
        <div className="rp-page-header">
          <div>
            <h1>Analytics</h1>
            <p>How your job postings are performing over time.</p>
          </div>
        </div>

        <div className="rp-charts-row">
          <div className="rp-card">
            <div className="rp-card-header">
              <div>
                <h3>Applications — last {DAYS_TO_SHOW} days</h3>
                <p>New applications received per day</p>
              </div>
              <div className="rp-legend">
                <span className="rp-legend-item">
                  <span className="dot blue" /> Applications
                </span>
              </div>
            </div>

            {loading ? (
              <p className="rp-job-meta">Loading…</p>
            ) : (
              <div className="rp-line-chart">
                <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} preserveAspectRatio="none">
                  <polyline
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="2.5"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    points={points.join(" ")}
                  />
                  {timeline.map((d, i) => {
                    const [x, y] = points[i].split(",");
                    return d.count > 0 ? (
                      <circle key={d.key} cx={x} cy={y} r="3" fill="#3b82f6" />
                    ) : null;
                  })}
                </svg>
                <div className="rp-chart-x">
                  <span>{timeline[0].date.toLocaleDateString(undefined, { month: "short", day: "numeric" })}</span>
                  <span>Today</span>
                </div>
              </div>
            )}
          </div>

          <div className="rp-card">
            <div className="rp-card-header">
              <div>
                <h3>Hire Rate</h3>
                <p>Hired vs. total applicants</p>
              </div>
            </div>
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <div style={{ fontSize: "42px", fontWeight: 700, color: "#16a34a" }}>
                {loading ? "…" : `${hireRate}%`}
              </div>
              <div className="rp-job-meta">
                {statusCounts.HIRED} hired out of {applications.length} applicants
              </div>
            </div>
          </div>
        </div>

        <div className="rp-bottom-row">
          <div className="rp-card">
            <div className="rp-card-header">
              <div>
                <h3>Applicant Pipeline</h3>
                <p>Where candidates stand across every job</p>
              </div>
            </div>

            {loading ? (
              <p className="rp-job-meta">Loading…</p>
            ) : applications.length === 0 ? (
              <p className="rp-job-meta">No applicants yet.</p>
            ) : (
              <div className="rp-pipeline">
                {Object.entries(statusCounts).map(([status, count]) => {
                  const width = applications.length
                    ? Math.max(count > 0 ? 4 : 0, Math.round((count / applications.length) * 100))
                    : 0;
                  return (
                    <div className="rp-pipeline-row" key={status}>
                      <div className="rp-pipeline-label">{status}</div>
                      <div className="rp-pipeline-bar-wrap">
                        <div
                          className="rp-pipeline-bar"
                          style={{ width: `${width}%`, background: pipelineColors[status] }}
                        />
                      </div>
                      <div className="rp-job-meta">{count}</div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="rp-card">
            <div className="rp-card-header">
              <div>
                <h3>By Job Type</h3>
                <p>Jobs posted vs. applicants received</p>
              </div>
            </div>

            {loading ? (
              <p className="rp-job-meta">Loading…</p>
            ) : typeBreakdown.length === 0 ? (
              <p className="rp-job-meta">Post a job to see this breakdown.</p>
            ) : (
              <div className="rp-pipeline">
                {typeBreakdown.map(([type, data]) => (
                  <div className="rp-pipeline-row" key={type}>
                    <div className="rp-pipeline-label">{type}</div>
                    <div className="rp-job-meta">
                      {data.jobs} job{data.jobs !== 1 ? "s" : ""} · {data.applicants} applicant
                      {data.applicants !== 1 ? "s" : ""}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </ProviderLayout>
  );
};

export default Analytics;
