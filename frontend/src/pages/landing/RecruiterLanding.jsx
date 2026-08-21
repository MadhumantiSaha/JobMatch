import { Link } from "react-router-dom";
import logo from "../../assets/recruiter-logo.png";
import brandLogo from "../../assets/logo.png";

export default function RecruiterLanding() {
  return (
    <div className="landing recruiter-landing">
      {/* ========== NAVBAR ========== */}
      <header className="landing-nav recruiter-nav">
        <div className="landing-nav-inner">
          <Link to="/employers" className="landing-brand">
            <img src={logo} alt="JobMatch for Recruiters" className="landing-logo recruiter" />
          </Link>

          <nav className="landing-nav-links">
            <Link to="/" className="nav-text-link">
              For Candidates
            </Link>
            <Link to="/login" className="btn-ghost">
              Sign In
            </Link>
            <Link to="/register" className="btn-primary-sm recruiter-cta">
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
      <section className="hero recruiter-hero">
        <div className="hero-content">
          <p className="hero-eyebrow recruiter">Built for hiring teams</p>
          <h1 className="hero-title">
            Hire top talent{" "}
            <span className="gradient-text recruiter">faster</span>
          </h1>
          <p className="hero-subtitle">
            Post jobs in minutes, reach qualified candidates, and manage the
            entire pipeline — from application to offer — in one place.
          </p>

          <div className="hero-actions">
            <Link to="/post-job" className="btn-primary-lg recruiter-cta">
              Post a Job
            </Link>
            <Link to="/register" className="btn-outline-lg">
              Create employer account
            </Link>
          </div>

          <div className="hero-stats">
            <div className="stat">
              <strong>48h</strong>
              <span>Avg. time to first hire</span>
            </div>
            <div className="stat">
              <strong>5×</strong>
              <span>More qualified applicants</span>
            </div>
            <div className="stat">
              <strong>2k+</strong>
              <span>Active recruiters</span>
            </div>
          </div>
        </div>

        <div className="hero-visual recruiter-visual" aria-hidden="true">
          <div className="pipeline-card">
            <div className="pipeline-header">
              <span>Active pipeline</span>
              <span className="pipeline-count">24 applicants</span>
            </div>
            <div className="pipeline-stages">
              <div className="stage">
                <span className="stage-dot pending" />
                Pending
                <strong>12</strong>
              </div>
              <div className="stage">
                <span className="stage-dot shortlist" />
                Shortlisted
                <strong>7</strong>
              </div>
              <div className="stage">
                <span className="stage-dot interview" />
                Interview
                <strong>4</strong>
              </div>
              <div className="stage">
                <span className="stage-dot hired" />
                Hired
                <strong>1</strong>
              </div>
            </div>
          </div>
          <div className="floating-card card-r1">
            <p className="fc-title">New applicant</p>
            <p className="fc-meta">Priya S. · React Developer</p>
          </div>
        </div>
      </section>

      {/* ========== VALUE PROPS ========== */}
      <section className="features">
        <div className="section-inner">
          <h2 className="section-title">Everything you need to hire well</h2>
          <p className="section-sub">
            From posting to offer letters — designed for recruiters and hiring
            managers.
          </p>
          <div className="feature-grid">
            <article className="feature-card">
              <div className="feature-icon">📢</div>
              <h3>Post jobs instantly</h3>
              <p>
                Create rich job posts with skills, salary, and location. Go live
                in under two minutes.
              </p>
            </article>
            <article className="feature-card">
              <div className="feature-icon">👥</div>
              <h3>Screen applicants fast</h3>
              <p>
                Review profiles, resumes, and status in a single pipeline view.
                Shortlist or reject in one click.
              </p>
            </article>
            <article className="feature-card">
              <div className="feature-icon">💬</div>
              <h3>Message candidates</h3>
              <p>
                Built-in messaging keeps conversations organized — no more lost
                email threads.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* ========== CTA ========== */}
      <section className="cta-band recruiter-cta-band">
        <div className="section-inner cta-inner">
          <div>
            <h2>Ready to fill your next role?</h2>
            <p>Join thousands of recruiters who hire smarter with JobMatch.</p>
          </div>
          <div className="cta-actions">
            <Link to="/post-job" className="btn-primary-lg recruiter-cta">
              Post a Job
            </Link>
            <Link to="/" className="btn-outline-lg light">
              Looking for a job?
            </Link>
          </div>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer className="landing-footer">
        <div className="section-inner footer-inner">
          <div className="footer-brand">
            <img src={brandLogo} alt="JobMatch" className="landing-logo sm" />
            <p>Connecting talent with opportunity.</p>
          </div>
          <div className="footer-links">
            <Link to="/">For Candidates</Link>
            <Link to="/login">Sign In</Link>
            <Link to="/register">Sign Up</Link>
          </div>
          <p className="footer-copy">
            © {new Date().getFullYear()} JobMatch. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
