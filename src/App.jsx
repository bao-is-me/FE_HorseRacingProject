import React, { useState } from "react";
import AppRouter from "./app/router.jsx";
import { defaultPageByRole, roleMenus } from "./app/navigationConfig";
import MainLayout from "./layouts/MainLayout";
import { setAuthToken } from "./services/apiClient";

function App() {
  const [session, setSession] = useState(null);
  const [activeRole, setActiveRole] = useState("Guest");
  const [activePage, setActivePage] = useState("login");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const user = session?.user || null;
  const role = user?.role || activeRole;
  const menu = roleMenus[role] || roleMenus.Guest;

  function activateRole(nextRole, nextUser = null) {
    setActiveRole(nextRole);
    setActivePage(defaultPageByRole[nextRole] || defaultPageByRole.Guest);
    if (nextUser) {
      setSession({ user: nextUser, token: nextUser.token || "demo-token" });
    }
    setSidebarOpen(false);
  }

  function navigate(page) {
    setActivePage(page);
    setSidebarOpen(false);
  }

  function logout() {
    setAuthToken(null);
    setSession(null);
    setActiveRole("Guest");
    setActivePage("login");
    setSidebarOpen(false);
  }

  const routedPage = (
    <AppRouter
      role={role}
      activePage={activePage}
      user={user}
      setSession={setSession}
      activateRole={activateRole}
      setActivePage={setActivePage}
    />
  );

  return (
    <MainLayout
      role={role}
      menu={menu}
      user={user}
      activePage={activePage}
      sidebarOpen={sidebarOpen}
      onNavigate={navigate}
      onMenu={() => setSidebarOpen(true)}
      onRoleSwitch={activateRole}
      onLogout={logout}
    >
      {routedPage}
    </MainLayout>
  );
}

export default App;
