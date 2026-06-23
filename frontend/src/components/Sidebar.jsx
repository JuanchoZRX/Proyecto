import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Sidebar.css";

const NAV_ITEMS = [
  { to: "/dashboard",   label: "Dashboard",    icon: "⚡" },
  { to: "/carreras",    label: "Carreras",      icon: "🏁" },
  { to: "/circuitos",   label: "Circuitos",     icon: "🗺️" },
  { to: "/conductores", label: "Conductores",   icon: "🧑‍✈️" },
  { to: "/equipos",     label: "Equipos",       icon: "🔧" },
  { to: "/autos",       label: "Autos",         icon: "🚗" },
];

const ADMIN_ITEMS = [
  { to: "/usuarios", label: "Usuarios", icon: "👥" },
];

export default function Sidebar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <span className="sidebar-logo-accent">F1</span>
        <span className="sidebar-logo-text">Stats</span>
      </div>

      {/* Nav */}
      <nav className="sidebar-nav">
        <p className="sidebar-section-label">General</p>
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              "sidebar-link" + (isActive ? " active" : "")
            }
          >
            <span className="sidebar-icon">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}

        {isAdmin() && (
          <>
            <p className="sidebar-section-label" style={{ marginTop: 24 }}>Administración</p>
            {ADMIN_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  "sidebar-link" + (isActive ? " active" : "")
                }
              >
                <span className="sidebar-icon">{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
          </>
        )}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-avatar">
            {user?.username?.[0]?.toUpperCase()}
          </div>
          <div className="sidebar-user-info">
            <p className="sidebar-username">{user?.username}</p>
            <span className={`badge ${isAdmin() ? "badge-admin" : "badge-user"}`}>
              {user?.role}
            </span>
          </div>
        </div>
        <button className="sidebar-logout" onClick={handleLogout} title="Cerrar sesión">
          ⏻
        </button>
      </div>
    </aside>
  );
}
