import React, { useState } from "react";
import { Bell, Menu, Search, UserCog } from "lucide-react";
import { demoAccounts } from "../mocks/accounts.mock";
import { roles } from "../mocks/roles.mock";

function TopBar({ role, user, onMenu, onRoleSwitch, onLogout }) {
  const [rolePickerOpen, setRolePickerOpen] = useState(false);

  return (
    <header className="topbar">
      <button className="icon-button mobile-only" onClick={onMenu} type="button" aria-label="Open menu">
        <Menu size={20} />
      </button>
      <div className="search-box">
        <Search size={18} />
        <input placeholder="Search races, horses, accounts, reports..." />
      </div>
      <div className="topbar-actions">
        <button className="icon-button" type="button" aria-label="Notifications">
          <Bell size={18} />
        </button>
        <div className="role-switcher">
          <button className="secondary-button" onClick={() => setRolePickerOpen((value) => !value)} type="button">
            <UserCog size={16} />
            {roles[role] || "Guest"}
          </button>
          {rolePickerOpen && (
            <div className="role-menu">
              {Object.keys(roles).map((nextRole) => (
                <button
                  key={nextRole}
                  onClick={() => {
                    const nextUser = demoAccounts.find((account) => account.role === nextRole) || demoAccounts[0];
                    onRoleSwitch(nextRole, nextUser);
                    setRolePickerOpen(false);
                  }}
                  type="button"
                >
                  Demo {roles[nextRole]}
                </button>
              ))}
              {user && (
                <button onClick={onLogout} type="button">
                  Logout
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default TopBar;
