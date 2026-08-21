import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";

export default function CandidateLanding() {
  const navigate = useNavigate();
  const [jobTitle, setJobTitle] = useState("");
  const [location, setLocation] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    // Send users to the jobs page (auth-gated); store intent for after login
    const params = new URLSearchParams();
    if (jobTitle.trim()) params.set("q", jobTitle.trim());
    if (location.trim()) params.set("location", location.trim());
    const query = params.toString();
    sessionStorage.setItem("pendingSearch", query);
    navigate(query ? `/jobs?${query}` : "/jobs");
  };

  return (
    <div className="landing candidate-landing">
      {/* ========== NAVBAR ========== */}
      <header className="landing-nav">
        <div className="landing-nav-inner">
          <Link to="/" className="landing-brand">
            <img src={logo} alt="JobMatch" className="landing-logo" />
          </Link>

          <nav className="landing-nav-links">
            <Link to="/employers" className="nav-text-link">
              For Employers
            </Link>
            <Link to="/login" className="btn-ghost">
              Sign In
            </Link>
            <Link to="/register" className="btn-primary-sm">
              Sign Up
            </Link>
          </nav>

          <button
            className="landing-menu-btn"
            aria-label="Menu"
            onClick={() =>
              document
                .querySelector(".landing-nav-links")
                ?.classList.toggle("open")
            }
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      {/* ========== HERO ========== */}
      <section className="hero">
        <div className="hero-content">
          <p className="hero-eyebrow">The smarter way to get hired</p>
          <h1 className="hero-title">
            Find Your <span className="gradient-text">Dream Job</span>
          </h1>
          <p className="hero-subtitle">
            Discover thousands of opportunities from top companies. Search by
            role, location, or skills — and land the role that matches you.
          </p>

          <form className="search-bar" onSubmit={handleSearch}>
            <div className="search-field">
              <svg
                className="search-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
              <input
                type="text"
                placeholder="Job title, keywords, or company"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                aria-label="Job title"
              />
            </div>
            <div className="search-divider" />
            <div className="search-field">
              <svg
                className="search-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <input
                type="text"
                placeholder="City, state, or remote"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                aria-label="Location"
              />
            </div>
            <button type="submit" className="search-btn">
              Search
            </button>
          </form>

          <div className="hero-stats">
            <div className="stat">
              <strong>12k+</strong>
              <span>Open roles</span>
            </div>
            <div className="stat">
              <strong>3.2k+</strong>
              <span>Companies</span>
            </div>
            <div className="stat">
              <strong>98%</strong>
              <span>Match rate</span>
            </div>
          </div>
        </div>

        <div className="hero-visual" aria-hidden="true">
          <div className="floating-card card-1">
            <div className="fc-badge">New</div>
            <p className="fc-title">Senior Product Designer</p>
            <p className="fc-meta">Remote · $120k–$150k</p>
          </div>
          <div className="floating-card card-2">
            <div className="fc-badge success">Matched</div>
            <p className="fc-title">Full-Stack Engineer</p>
            <p className="fc-meta">Bangalore · $90k–$110k</p>
          </div>
          <div className="floating-card card-3">
            <div className="fc-badge">Featured</div>
            <p className="fc-title">Data Analyst</p>
            <p className="fc-meta">Hybrid · $70k–$95k</p>
          </div>
        </div>
      </section>

      {/* ========== FEATURES ========== */}
      <section className="features">
        <div className="section-inner">
          <h2 className="section-title">Why job seekers choose JobMatch</h2>
          <p className="section-sub">
            Built for candidates who want clarity, speed, and better matches.
          </p>
          <div className="feature-grid">
            <article className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>Smart matching</h3>
              <p>
                Our matching engine surfaces roles that fit your skills and
                experience — not just keyword spam.
              </p>
            </article>
            <article className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Apply in seconds</h3>
              <p>
                One-click applications with your saved profile and resume. No
                more filling the same form ten times.
              </p>
            </article>
            <article className="feature-card">
              <div className="feature-icon">📈</div>
              <h3>Track every step</h3>
              <p>
                See application status, interview invites, and messages in one
                clean dashboard.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* ========== PREMIUM PREVIEW ========== */}
      <section className="landing-premium">
        <div className="section-inner landing-premium-inner">
          <div className="landing-premium-copy">
            <p className="hero-eyebrow">JobMatch Premium</p>
            <h2 className="section-title" style={{ textAlign: "left" }}>
              Stand out. Get hired faster.
            </h2>
            <p className="section-sub" style={{ textAlign: "left", margin: "0 0 24px" }}>
              Priority visibility, AI-powered matching, and exclusive benefits —
              the same upgrade candidates use inside the app.
            </p>
            <Link to="/register" className="btn-primary-lg">
              Get started free
            </Link>
          </div>

          <div className="premium-preview-card">
            <div className="premium-badge">⭐ PREMIUM MEMBERSHIP</div>
            <h3>Unlock Premium</h3>
            <p className="premium-preview-sub">
              Get priority visibility, AI-powered job matching and exclusive
              premium benefits.
            </p>
            <p className="premium-preview-price">
              ₹499<span>/30 Days</span>
            </p>
            <ul className="premium-preview-features">
              <li>Resume Parsing with AI</li>
              <li>Matched Jobs every 4 Days via Email</li>
              <li>Priority in Recruiter Search</li>
              <li>Featured Candidate Profile</li>
              <li>Faster Job Recommendations</li>
              <li>Early Access to New Jobs</li>
            </ul>
            <Link to="/premium" className="btn-primary-lg full">
              Upgrade to Premium
            </Link>
          </div>
        </div>
      </section>

      {/* ========== CTA ========== */}
      <section className="cta-band">
        <div className="section-inner cta-inner">
          <div>
            <h2>Ready to land your next role?</h2>
            <p>Create a free account and start applying in minutes.</p>
          </div>
          <div className="cta-actions">
            <Link to="/register" className="btn-primary-lg">
              Create free account
            </Link>
            <Link to="/login" className="btn-outline-lg">
              Sign in
            </Link>
          </div>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer className="landing-footer">
        <div className="section-inner footer-inner">
          <div className="footer-brand">
            <img src={logo} alt="JobMatch" className="landing-logo sm" />
            <p>Connecting talent with opportunity.</p>
          </div>
          <div className="footer-links">
            <Link to="/employers">For Employers</Link>
            <Link to="/login">Sign In</Link>
            <Link to="/register">Sign Up</Link>
          </div>
          <p className="footer-copy">© {new Date().getFullYear()} JobMatch. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
