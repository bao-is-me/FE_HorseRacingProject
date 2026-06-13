import React from "react";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

function MainLayout({ role, menu, user, activePage, sidebarOpen, onNavigate, onMenu, onRoleSwitch, onLogout, children }) {
  return (
    <div className="app-shell">
      <Sidebar role={role} menu={menu} user={user} activePage={activePage} open={sidebarOpen} onNavigate={onNavigate} onLogout={onLogout} />
      <div className="workspace">
        <TopBar role={role} user={user} onMenu={onMenu} onRoleSwitch={onRoleSwitch} onLogout={onLogout} />
        <main className="content">{children}</main>
      </div>
    </div>
  );
}

export default MainLayout;
