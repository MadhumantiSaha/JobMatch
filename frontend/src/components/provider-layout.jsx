import Navbar from "./navbar";
import ProviderSidebar from "./provider-sidebar";

// Shared shell for every job_provider page: top Navbar, the new left
// sidebar (job listings / applicants / analytics nav), and the page's
// own content dropped in as children.
const ProviderLayout = ({ children }) => {
  return (
    <>
      <Navbar />
      <div className="rp-shell">
        <ProviderSidebar />
        <div className="rp-shell-main">{children}</div>
      </div>
    </>
  );
};

export default ProviderLayout;
