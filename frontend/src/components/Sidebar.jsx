import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import "./Sidebar.css";

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const role = user?.role;
  const username = user?.username || "User";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="sidebar">

      <div className="sidebar-header">
        ⚡ <span>Billing System</span>
      </div>

      <div className="sidebar-profile">
        <div className="profile-avatar">
          {username.charAt(0).toUpperCase()}
        </div>
        <div className="profile-info">
          <div className="profile-name">{username}</div>
          <div className="profile-role">{role}</div>
        </div>
      </div>

      <nav className="sidebar-menu">

        <NavLink to="/" end className="menu-item">
          <span>🏠</span> Dashboard
        </NavLink>

        {role === "ADMIN" && (
          <>
            <NavLink to="/clients" className="menu-item">
              👥 Clients
            </NavLink>

            <NavLink to="/products" className="menu-item">
              📦 Products
            </NavLink>

            <NavLink to="/invoice/new" className="menu-item">
              ➕ Create Invoice
            </NavLink>

            <NavLink to="/invoices" className="menu-item">
              📄 Invoices
            </NavLink>

            <NavLink to="/payments" className="menu-item">
              💳 Payments
            </NavLink>
          </>
        )}

        {role === "ACCOUNTANT" && (
          <>
            <NavLink to="/invoice/new" className="menu-item">
              ➕ Create Invoice
            </NavLink>

            <NavLink to="/invoices" className="menu-item">
              📄 Invoices
            </NavLink>

            <NavLink to="/payments" className="menu-item">
              💳 Payments
            </NavLink>
          </>
        )}

        {role === "CLIENT" && (
          <>
            <NavLink to="/invoices" className="menu-item">
              📄 My Invoices
            </NavLink>

            <NavLink to="/payments" className="menu-item">
              💳 My Payments
            </NavLink>
          </>
        )}

      </nav>

      <div className="sidebar-footer">
        <button onClick={handleLogout} className="logout-btn">
          🚪 Logout
        </button>
      </div>
    </div>
  );
}

