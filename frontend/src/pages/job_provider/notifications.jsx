import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import ProviderLayout from "../../components/provider-layout";
import { useProviderData, timeAgo } from "../../hooks/useProviderData";

// There's no notifications endpoint on the backend yet, so this feed is
// derived from real application data (newest applications first) rather
// than being a separate, disconnected data source.
const Notifications = () => {
  const { applications, loading } = useProviderData();
  const navigate = useNavigate();

  const feed = useMemo(() => {
    return [...applications]
      .sort((a, b) => new Date(b.appliedAt || 0) - new Date(a.appliedAt || 0))
      .slice(0, 30);
  }, [applications]);

  return (
    <ProviderLayout>
      <div className="rp-content">
        <div className="rp-page-header">
          <div>
            <h1>Notifications</h1>
            <p>Recent applicant activity across all your jobs.</p>
          </div>
        </div>

        <div className="rp-card">
          {loading ? (
            <p className="rp-job-meta">Loading…</p>
          ) : feed.length === 0 ? (
            <p className="rp-job-meta">Nothing to show yet — you'll see new applications here.</p>
          ) : (
            <div className="rp-pipeline" style={{ gap: 0 }}>
              {feed.map((app) => (
                <button
                  key={app.id}
                  onClick={() => navigate(`/view-applicant/${app.jobId}`)}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                    background: "transparent",
                    border: "none",
                    borderBottom: "1px solid #f1f5f9",
                    padding: "14px 4px",
                    textAlign: "left",
                    cursor: "pointer",
                  }}
                >
                  <div>
                    <div className="rp-job-title">
                      🆕 {app.name} applied for {app.jobTitle}
                    </div>
                    <div className="rp-job-meta">
                      Status: {app.status}
                      {app.status === "PENDING" ? " · needs review" : ""}
                    </div>
                  </div>
                  <div className="rp-job-meta">{timeAgo(app.appliedAt)}</div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProviderLayout>
  );
};

export default Notifications;
