import { Link } from "react-router-dom";

const Navbar = () => {
  const logout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <nav className="navbar">
      <h2>Online Job Portal</h2>

      <div>
        <Link to="/profile">
          👤 Profile
        </Link>
      </div>
      <button onClick={logout}>Logout</button>
    </nav>
  );
};

export default Navbar;