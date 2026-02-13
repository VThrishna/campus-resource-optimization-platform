import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/layout.css";

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      <nav className="navbar">
        <h3>Campus Admin</h3>

        <div className="nav-links">
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/admin/resources"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Resources
          </NavLink>

          <NavLink
            to="/admin/bookings"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Bookings
          </NavLink>
        </div>

        <div className="profile">
          <div className="avatar">
            {user?.name?.charAt(0)?.toUpperCase()}
          </div>

          <div className="profile-info">
            <span className="profile-name">{user?.name}</span>
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

export default AdminLayout;
