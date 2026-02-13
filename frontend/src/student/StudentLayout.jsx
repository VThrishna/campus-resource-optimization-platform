import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/layout.css";

const StudentLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      <nav className="navbar">
        <h3>Student Portal</h3>

        <div className="nav-links">
          <NavLink
            to="/student/dashboard"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/student/resources"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Book Resources
          </NavLink>
        </div>

        <div className="profile">
          <div className="avatar">
            {user?.name?.charAt(0)?.toUpperCase() ||
              user?.email?.charAt(0)?.toUpperCase()}
          </div>

          <div className="profile-info">
            <span className="profile-name">
              {user?.name || user?.email}
            </span>
            <span className="profile-role">
              {user?.role?.toUpperCase()}
            </span>
          </div>

          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      <div className="page-container">
        <Outlet />
      </div>
    </>
  );
};

export default StudentLayout;
