import React from "react";
import { LogOut, Shield } from "lucide-react";
import { roles } from "../mocks/roles.mock";
import { initials } from "../utils/roleUtils";

function Sidebar({ role, menu, user, activePage, open, onNavigate, onLogout }) {
  return (
    <>
      <aside className={`sidebar ${open ? "open" : ""}`}>
        <div className="brand">
          <div className="brand-mark">
            <Shield size={22} />
          </div>
          <div>
            <strong>HRTMS</strong>
            <span>{roles[role] || "Guest Portal"}</span>
          </div>
        </div>

        <nav className="nav-list">
          {menu.map((item) => {
            const Icon = item.icon;
            return (
              <button
                className={`nav-item ${activePage === item.id ? "active" : ""}`}
                key={item.id}
                onClick={() => onNavigate(item.id)}
                type="button"
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="user-chip">
            <span>{user ? initials(user.fullName) : "G"}</span>
            <div>
              <strong>{user?.fullName || "Guest user"}</strong>
              <small>{user?.email || "No session"}</small>
            </div>
          </div>
          {user && (
            <button className="ghost-button" onClick={onLogout} type="button">
              <LogOut size={16} />
              Logout
            </button>
          )}
        </div>
      </aside>
      {open && <button className="backdrop" onClick={() => onNavigate(activePage)} type="button" aria-label="Close menu" />}
    </>
  );
}

export default Sidebar;
