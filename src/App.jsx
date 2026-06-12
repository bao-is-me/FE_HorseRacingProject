import {
  Activity,
  AlertTriangle,
  Bell,
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  ClipboardCheck,
  ClipboardList,
  Flag,
  Gauge,
  Gavel,
  Home,
  LogIn,
  LogOut,
  Medal,
  Menu,
  Search,
  Shield,
  ShieldCheck,
  Sparkles,
  Trophy,
  UserCheck,
  UserCog,
  UserPlus,
  Users,
  Wallet,
  X
} from "lucide-react";
import React, { useMemo, useState } from "react";
import { decodeJwt, loginWithBackend, registerWithBackend } from "./apiClient";
import {
  bets,
  demoAccounts,
  formatCurrency,
  formatDateTime,
  getRaceViewModel,
  horses,
  notifications,
  payments,
  prizes,
  raceResults,
  racecourses,
  races,
  registrations,
  reports,
  roles,
  tournaments
} from "./mockData";

const roleMenus = {
  Guest: [
    { id: "login", label: "Login", icon: LogIn },
    { id: "register", label: "Register", icon: UserPlus },
    { id: "public-races", label: "Public Races", icon: Trophy }
  ],
  Spectator: [
    { id: "spectator-dashboard", label: "Dashboard", icon: Home },
    { id: "races", label: "Races", icon: CalendarDays },
    { id: "predictions", label: "Prediction / Bet", icon: Sparkles },
    { id: "bet-history", label: "Betting History", icon: ClipboardList },
    { id: "live-results", label: "Live Results", icon: Activity },
    { id: "rankings", label: "Rankings", icon: Medal },
    { id: "wallet", label: "Wallet", icon: Wallet },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "profile", label: "Profile", icon: UserCog }
  ],
  HorseOwner: [
    { id: "owner-dashboard", label: "Dashboard", icon: Home },
    { id: "my-horses", label: "My Horses", icon: ShieldCheck },
    { id: "register-race", label: "Register Horse", icon: ClipboardCheck },
    { id: "jockey-selection", label: "Jockey Selection", icon: UserCheck },
    { id: "horse-schedule", label: "Horse Schedule", icon: CalendarDays },
    { id: "owner-results", label: "Results & Prizes", icon: Trophy },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "profile", label: "Profile", icon: UserCog }
  ],
  Jockey: [
    { id: "jockey-dashboard", label: "Dashboard", icon: Home },
    { id: "ride-invitations", label: "Ride Invitations", icon: Bell },
    { id: "jockey-schedule", label: "My Schedule", icon: CalendarDays },
    { id: "assigned-races", label: "Assigned Races", icon: Flag },
    { id: "rankings", label: "Rankings", icon: Medal },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "profile", label: "Profile", icon: UserCog }
  ],
  Referee: [
    { id: "referee-dashboard", label: "Dashboard", icon: Home },
    { id: "race-monitoring", label: "Race Monitoring", icon: Gauge },
    { id: "horse-check", label: "Horse Check", icon: ClipboardCheck },
    { id: "violations", label: "Violations", icon: AlertTriangle },
    { id: "result-form", label: "Result Form", icon: CheckCircle2 },
    { id: "race-report", label: "Race Report", icon: ClipboardList },
    { id: "profile", label: "Profile", icon: UserCog }
  ],
  Admin: [
    { id: "admin-dashboard", label: "Dashboard", icon: Home },
    { id: "user-management", label: "Users", icon: Users },
    { id: "account-approval", label: "Approvals", icon: UserCheck },
    { id: "tournaments", label: "Tournaments", icon: Trophy },
    { id: "racecourses", label: "Racecourses", icon: Flag },
    { id: "race-management", label: "Races", icon: CalendarDays },
    { id: "horse-management", label: "Horses", icon: ShieldCheck },
    { id: "jockey-assignment", label: "Jockey Assignment", icon: UserCheck },
    { id: "referee-assignment", label: "Referee Assignment", icon: Gavel },
    { id: "result-publishing", label: "Result Publishing", icon: ClipboardCheck },
    { id: "bet-management", label: "Bets", icon: CircleDollarSign },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "profile", label: "Profile", icon: UserCog }
  ]
};

const defaultPageByRole = {
  Guest: "login",
  Spectator: "spectator-dashboard",
  HorseOwner: "owner-dashboard",
  Jockey: "jockey-dashboard",
  Referee: "referee-dashboard",
  Admin: "admin-dashboard"
};

const roleLanding = {
  Spectator: "spectator-dashboard",
  HorseOwner: "owner-dashboard",
  Jockey: "jockey-dashboard",
  Referee: "referee-dashboard",
  Admin: "admin-dashboard"
};

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
    setActivePage(defaultPageByRole[nextRole]);
    if (nextUser) {
      setSession({ user: nextUser, token: nextUser.token || "demo-token" });
    }
    setSidebarOpen(false);
  }

  function logout() {
    setSession(null);
    setActiveRole("Guest");
    setActivePage("login");
    setSidebarOpen(false);
  }

  return (
    <div className="app-shell">
      <Sidebar
        role={role}
        menu={menu}
        user={user}
        activePage={activePage}
        open={sidebarOpen}
        onNavigate={(page) => {
          setActivePage(page);
          setSidebarOpen(false);
        }}
        onLogout={logout}
      />
      <div className="workspace">
        <TopBar
          role={role}
          user={user}
          onMenu={() => setSidebarOpen(true)}
          onRoleSwitch={activateRole}
          onLogout={logout}
        />
        <main className="content">
          <PageRouter
            role={role}
            activePage={activePage}
            user={user}
            setSession={setSession}
            activateRole={activateRole}
            setActivePage={setActivePage}
          />
        </main>
      </div>
    </div>
  );
}

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

function PageRouter({ role, activePage, user, setSession, activateRole, setActivePage }) {
  if (activePage === "login") {
    return <LoginPage setSession={setSession} activateRole={activateRole} setActivePage={setActivePage} />;
  }
  if (activePage === "register") {
    return <RegisterPage activateRole={activateRole} setActivePage={setActivePage} />;
  }
  if (activePage === "public-races") return <RaceListPage publicView />;

  switch (activePage) {
    case "spectator-dashboard":
      return <SpectatorDashboard user={user} />;
    case "owner-dashboard":
      return <OwnerDashboard user={user} />;
    case "jockey-dashboard":
      return <JockeyDashboard user={user} />;
    case "referee-dashboard":
      return <RefereeDashboard user={user} />;
    case "admin-dashboard":
      return <AdminDashboard user={user} />;
    case "races":
    case "race-management":
      return <RaceListPage role={role} />;
    case "predictions":
    case "bet-management":
      return <PredictionBetPage admin={activePage === "bet-management"} />;
    case "bet-history":
      return <BetHistoryPage user={user} />;
    case "live-results":
    case "owner-results":
    case "result-publishing":
      return <ResultsPage publishing={activePage === "result-publishing"} />;
    case "rankings":
      return <RankingsPage />;
    case "wallet":
      return <WalletPage user={user} />;
    case "my-horses":
    case "horse-management":
      return <HorseManagementPage ownerOnly={activePage === "my-horses"} user={user} />;
    case "register-race":
      return <RegisterHorsePage user={user} />;
    case "jockey-selection":
    case "jockey-assignment":
      return <JockeySelectionPage admin={activePage === "jockey-assignment"} />;
    case "horse-schedule":
    case "jockey-schedule":
    case "assigned-races":
      return <SchedulePage role={role} />;
    case "ride-invitations":
      return <RideInvitationsPage />;
    case "race-monitoring":
      return <RaceMonitoringPage />;
    case "horse-check":
      return <HorseCheckPage />;
    case "violations":
      return <ViolationsPage />;
    case "result-form":
      return <ResultFormPage />;
    case "race-report":
      return <RaceReportPage />;
    case "user-management":
      return <UserManagementPage />;
    case "account-approval":
      return <AccountApprovalPage />;
    case "tournaments":
      return <TournamentPage />;
    case "racecourses":
      return <RacecoursePage />;
    case "referee-assignment":
      return <RefereeAssignmentPage />;
    case "notifications":
      return <NotificationsPage role={role} />;
    case "profile":
      return <ProfilePage user={user} role={role} />;
    default:
      return <DashboardFallback role={role} />;
  }
}

function LoginPage({ setSession, activateRole, setActivePage }) {
  const [form, setForm] = useState({ email: "baon7311@gmail.com", password: "12345678", demoRole: "Spectator" });
  const [message, setMessage] = useState("Use backend login when API is running, or pick a demo role below.");
  const [busy, setBusy] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setMessage("Checking backend session...");
    try {
      const data = await loginWithBackend({ email: form.email, password: form.password });
      const token = data?.token || data;
      const claims = decodeJwt(token || "");
      const roleClaim =
        claims["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
        claims.role ||
        form.demoRole;
      const nextRole = normalizeRole(roleClaim);
      const demoUser = demoAccounts.find((account) => account.email === form.email) || demoAccounts.find((account) => account.role === nextRole);
      setSession({ token, user: { ...demoUser, email: form.email, role: nextRole } });
      activateRole(nextRole, { ...demoUser, email: form.email, role: nextRole, token });
    } catch (error) {
      const nextRole = form.demoRole;
      const demoUser = demoAccounts.find((account) => account.role === nextRole);
      setMessage(`${error.message} Demo session opened as ${roles[nextRole]}.`);
      activateRole(nextRole, demoUser);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="auth-layout">
      <div className="auth-visual">
        <StatusPill tone="live">Precision Performance Management</StatusPill>
        <h1>Horse Racing Tournament Management System</h1>
        <p>
          Role-based racing operations for spectators, horse owners, jockeys, referees, and tournament administrators.
        </p>
        <div className="auth-stats">
          <MetricCard label="Active races" value="4" icon={Activity} />
          <MetricCard label="Tracked entities" value="14" icon={DatabaseIcon} />
        </div>
      </div>
      <form className="auth-card" onSubmit={submit}>
        <div className="section-heading tight">
          <span>Guest Login</span>
          <h2>Welcome back</h2>
          <p>Backend endpoint: /api/Auth/login. Demo fallback is available for UI review.</p>
        </div>
        <label className="field">
          <span>Email</span>
          <input value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} type="email" required />
        </label>
        <label className="field">
          <span>Password</span>
          <input value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} type="password" required />
        </label>
        <label className="field">
          <span>Demo role fallback</span>
          <select value={form.demoRole} onChange={(event) => setForm({ ...form, demoRole: event.target.value })}>
            {Object.keys(roles).map((roleKey) => (
              <option value={roleKey} key={roleKey}>
                {roles[roleKey]}
              </option>
            ))}
          </select>
        </label>
        <button className="primary-button full" type="submit" disabled={busy}>
          <LogIn size={18} />
          {busy ? "Signing in..." : "Login"}
        </button>
        <p className="form-note">{message}</p>
        <button className="text-button" onClick={() => setActivePage("register")} type="button">
          Create a new account
        </button>
      </form>
    </section>
  );
}

function RegisterPage({ activateRole, setActivePage }) {
  const [form, setForm] = useState({
    fullName: "New Racing User",
    phone: "0900000000",
    email: "new-user@stalliongate.ai",
    password: "Password@123",
    role: "Spectator"
  });
  const [message, setMessage] = useState("Spectator becomes Active immediately. Other roles wait for Admin approval.");
  const [busy, setBusy] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    try {
      await registerWithBackend(form);
      const status = form.role === "Spectator" ? "Active" : "Pending";
      setMessage(`Registered successfully. Account status: ${status}.`);
      const nextUser = { ...form, id: "new-demo", status, balance: 0 };
      activateRole(form.role, nextUser);
    } catch (error) {
      const status = form.role === "Spectator" ? "Active" : "Pending";
      setMessage(`${error.message} Demo account created locally with status ${status}.`);
      activateRole(form.role, { ...form, id: "new-demo", status, balance: 0 });
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="form-page">
      <PanelHeader
        kicker="Guest Registration"
        title="Create Account"
        description="Mapped to Account, UserProfiles, and JockeyProfile fields described in the RDS and txt file."
      />
      <form className="form-grid" onSubmit={submit}>
        <label className="field">
          <span>Full Name</span>
          <input value={form.fullName} onChange={(event) => setForm({ ...form, fullName: event.target.value })} />
        </label>
        <label className="field">
          <span>Phone</span>
          <input value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} />
        </label>
        <label className="field">
          <span>Email</span>
          <input value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} type="email" />
        </label>
        <label className="field">
          <span>Password</span>
          <input value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} type="password" />
        </label>
        <label className="field">
          <span>Requested Role</span>
          <select value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })}>
            {Object.keys(roles).map((roleKey) => (
              <option value={roleKey} key={roleKey}>
                {roles[roleKey]}
              </option>
            ))}
          </select>
        </label>
        {form.role === "Jockey" && (
          <>
            <label className="field">
              <span>Experience Years</span>
              <input type="number" min="0" placeholder="5" />
            </label>
            <label className="field">
              <span>Jockey Rating</span>
              <input type="number" min="0" max="5" step="0.01" placeholder="4.72" />
            </label>
          </>
        )}
        <div className="form-actions">
          <button className="primary-button" type="submit" disabled={busy}>
            <UserPlus size={18} />
            {busy ? "Creating..." : "Register"}
          </button>
          <button className="secondary-button" onClick={() => setActivePage("login")} type="button">
            Back to login
          </button>
        </div>
        <p className="form-note span-all">{message}</p>
      </form>
    </section>
  );
}

function SpectatorDashboard({ user }) {
  return (
    <DashboardPage
      kicker="Spectator Dashboard"
      title={`Live betting overview${user?.fullName ? ` for ${user.fullName}` : ""}`}
      description="Race discovery, wallet balance, prediction slip, live results, and global rankings."
      metrics={[
        { label: "Wallet Balance", value: formatCurrency(user?.balance || 1250000), icon: Wallet },
        { label: "Active Bets", value: bets.filter((bet) => bet.status === "Pending").length, icon: CircleDollarSign },
        { label: "Open Races", value: races.filter((race) => race.status === "BettingOpen").length, icon: Activity },
        { label: "Won Tickets", value: bets.filter((bet) => bet.status === "Won").length, icon: Trophy }
      ]}
    >
      <RaceCards />
      <PredictionBetPage compact />
    </DashboardPage>
  );
}

function OwnerDashboard({ user }) {
  const ownerHorses = horses.filter((horse) => horse.ownerId === (user?.id || "e3ad08be"));
  return (
    <DashboardPage
      kicker="Horse Owner Dashboard"
      title="Stable operations"
      description="Manage owned horses, race registration, jockey confirmation, results, and prize distribution."
      metrics={[
        { label: "My Horses", value: ownerHorses.length || 2, icon: ShieldCheck },
        { label: "Confirmed Entries", value: registrations.filter((item) => item.ownerConfirmation).length, icon: ClipboardCheck },
        { label: "Prize Pool", value: formatCurrency(prizes.reduce((sum, prize) => sum + prize.amount, 0)), icon: Trophy },
        { label: "Pending Jockeys", value: registrations.filter((item) => !item.jockeyConfirmation).length, icon: Bell }
      ]}
    >
      <HorseManagementPage ownerOnly user={user} embedded />
      <JockeySelectionPage embedded />
    </DashboardPage>
  );
}

function JockeyDashboard({ user }) {
  return (
    <DashboardPage
      kicker="Jockey Dashboard"
      title={`Race schedule and invitations${user?.fullName ? ` for ${user.fullName}` : ""}`}
      description="Review pending ride invitations, assigned races, performance results, and ranking."
      metrics={[
        { label: "Experience", value: `${user?.experienceYears || 5} yrs`, icon: UserCheck },
        { label: "Rating", value: user?.jockeyRating || "4.72", icon: Medal },
        { label: "Pending Invites", value: registrations.filter((item) => !item.jockeyConfirmation).length, icon: Bell },
        { label: "Assigned Races", value: registrations.filter((item) => item.jockeyConfirmation).length, icon: Flag }
      ]}
    >
      <RideInvitationsPage embedded />
      <SchedulePage role="Jockey" embedded />
    </DashboardPage>
  );
}

function RefereeDashboard() {
  return (
    <DashboardPage
      kicker="Race Referee Dashboard"
      title="Race control center"
      description="Monitor live races, check runners, log violations, enter official results, and publish reports."
      metrics={[
        { label: "Live Races", value: races.filter((race) => race.status === "Live").length, icon: Activity },
        { label: "Pending Results", value: races.filter((race) => race.status === "ResultPending").length, icon: ClipboardCheck },
        { label: "Incident Reports", value: reports.length, icon: AlertTriangle },
        { label: "Official Results", value: raceResults.length, icon: CheckCircle2 }
      ]}
    >
      <RaceMonitoringPage embedded />
      <ViolationsPage embedded />
    </DashboardPage>
  );
}

function AdminDashboard() {
  return (
    <DashboardPage
      kicker="Admin System Overview"
      title="Tournament control console"
      description="User approvals, tournament scheduling, race management, horse roster, result publishing, and betting audit."
      metrics={[
        { label: "Total Users", value: demoAccounts.length, icon: Users },
        { label: "Pending Accounts", value: demoAccounts.filter((account) => account.status === "Pending").length, icon: UserCheck },
        { label: "Total Horses", value: horses.length, icon: ShieldCheck },
        { label: "Total Bets", value: bets.length, icon: CircleDollarSign }
      ]}
    >
      <SystemHealth />
      <UserManagementPage embedded />
    </DashboardPage>
  );
}

function DashboardFallback({ role }) {
  return (
    <DashboardPage
      kicker={roles[role] || "Dashboard"}
      title="Workspace"
      description="Select a screen from the sidebar to continue."
      metrics={[
        { label: "Races", value: races.length, icon: CalendarDays },
        { label: "Horses", value: horses.length, icon: ShieldCheck },
        { label: "Users", value: demoAccounts.length, icon: Users },
        { label: "Reports", value: reports.length, icon: ClipboardList }
      ]}
    />
  );
}

function DashboardPage({ kicker, title, description, metrics, children }) {
  return (
    <section className="page-stack">
      <PanelHeader kicker={kicker} title={title} description={description} />
      <div className="metric-grid">
        {metrics.map((metric) => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </div>
      {children}
    </section>
  );
}

function RaceCards() {
  return (
    <section className="panel">
      <PanelHeader kicker="Race Schedule" title="Open and live races" description="Public race detail, racecourse, entries, and status." compact />
      <div className="race-card-grid">
        {races.map((race) => {
          const view = getRaceViewModel(race);
          return (
            <article className="race-card" key={race.id}>
              <div className="race-card-top">
                <StatusPill tone={statusTone(race.status)}>{race.status}</StatusPill>
                <strong>Race {race.raceNumber}</strong>
              </div>
              <h3>{view.tournament?.tournamentName}</h3>
              <p>{view.racecourse?.racecourseName} - {view.racecourse?.trackType}</p>
              <div className="race-track">
                {view.entries.map((entry, index) => (
                  <span key={entry.id} style={{ left: `${18 + index * 22}%` }} title={entry.horse?.horseName} />
                ))}
              </div>
              <div className="mini-row">
                <span>{formatDateTime(race.startTime)}</span>
                <span>{view.entries.length}/{race.maxParticipants} entries</span>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function RaceListPage({ publicView = false, role = "Guest" }) {
  const rows = races.map((race) => {
    const view = getRaceViewModel(race);
    return {
      Race: `Race ${race.raceNumber}`,
      Tournament: view.tournament?.tournamentName,
      Racecourse: view.racecourse?.racecourseName,
      "Start Time": formatDateTime(race.startTime),
      Length: `${race.trackLength}m`,
      Participants: `${view.entries.length}/${race.maxParticipants}`,
      Status: race.status
    };
  });

  return (
    <section className="page-stack">
      <PanelHeader
        kicker={publicView ? "Public Race" : role === "Admin" ? "Race Management" : "Race Schedule"}
        title={publicView ? "Public race detail" : "Race List"}
        description="Race, tournament, racecourse, start time, participant threshold, and current race status."
      />
      <DataTable rows={rows} />
      {!publicView && role === "Admin" && <RaceEditor />}
    </section>
  );
}

function RaceEditor() {
  return (
    <section className="panel">
      <PanelHeader kicker="Admin Action" title="Create / update race" description="Fields map to Races, Tournaments, and Racecourses." compact />
      <div className="form-grid dense">
        <label className="field">
          <span>Tournament</span>
          <select>{tournaments.map((item) => <option key={item.id}>{item.tournamentName}</option>)}</select>
        </label>
        <label className="field">
          <span>Racecourse</span>
          <select>{racecourses.map((item) => <option key={item.id}>{item.racecourseName}</option>)}</select>
        </label>
        <label className="field">
          <span>Race Number</span>
          <input type="number" defaultValue="7" />
        </label>
        <label className="field">
          <span>Max Participants</span>
          <input type="number" defaultValue="10" />
        </label>
        <button className="primary-button" type="button">
          <CalendarDays size={18} />
          Save race
        </button>
      </div>
    </section>
  );
}

function PredictionBetPage({ compact = false, admin = false }) {
  const rows = registrations.map((entry) => {
    const race = races.find((item) => item.id === entry.raceId);
    const horse = horses.find((item) => item.id === entry.horseId);
    const jockey = demoAccounts.find((item) => item.id === entry.jockeyId);
    return {
      Race: `Race ${race?.raceNumber}`,
      Horse: horse?.horseName,
      Jockey: jockey?.fullName,
      Odds: entry.odds,
      Status: entry.status,
      Action: admin ? "Audit" : "Place Bet"
    };
  });

  return (
    <section className="panel">
      <PanelHeader
        kicker={admin ? "Prediction / Bet Management" : "Prediction / Bet Slip"}
        title={compact ? "Top entries" : "Race entries and odds"}
        description="Uses Registrations, Horses, JockeyProfile, UserProfiles, Bets, and UserProfiles.Balance."
        compact
      />
      <DataTable rows={compact ? rows.slice(0, 3) : rows} />
      {!admin && !compact && (
        <div className="form-grid dense">
          <label className="field">
            <span>Horse / Jockey Entry</span>
            <select>{rows.map((row) => <option key={`${row.Race}-${row.Horse}`}>{row.Horse} - {row.Jockey}</option>)}</select>
          </label>
          <label className="field">
            <span>Bet Type</span>
            <select>
              <option>Win</option>
              <option>Place</option>
              <option>Show</option>
              <option>Quinella</option>
            </select>
          </label>
          <label className="field">
            <span>Bet Amount</span>
            <input defaultValue="200000" />
          </label>
          <button className="primary-button" type="button">
            <CircleDollarSign size={18} />
            Lock bet slip
          </button>
        </div>
      )}
    </section>
  );
}

function BetHistoryPage({ user }) {
  const rows = bets.map((bet) => {
    const entry = registrations.find((item) => item.id === bet.registrationId);
    const horse = horses.find((item) => item.id === entry?.horseId);
    return {
      Ticket: bet.id,
      Horse: horse?.horseName,
      Type: bet.betType,
      Amount: formatCurrency(bet.betAmount),
      Ratio: bet.payoutRatio,
      Status: bet.status
    };
  });
  return (
    <section className="page-stack">
      <PanelHeader kicker="Betting History" title={`${user?.fullName || "Spectator"} bet ledger`} description="Personal betting history linked to Bets and Registrations." />
      <DataTable rows={rows} />
    </section>
  );
}

function ResultsPage({ publishing = false }) {
  const rows = raceResults.map((result) => {
    const entry = registrations.find((item) => item.id === result.registrationId);
    const horse = horses.find((item) => item.id === entry?.horseId);
    const jockey = demoAccounts.find((item) => item.id === entry?.jockeyId);
    const prize = prizes.find((item) => item.registrationId === entry?.id);
    return {
      Horse: horse?.horseName,
      Jockey: jockey?.fullName,
      Position: result.finishPosition,
      "Finish Time": `${result.finishTime} ms`,
      Disqualified: result.isDisqualified ? "Yes" : "No",
      Prize: prize ? formatCurrency(prize.amount) : "-",
      Status: publishing ? "Ready to publish" : "Official"
    };
  });
  return (
    <section className="page-stack">
      <PanelHeader
        kicker={publishing ? "Result Publishing" : "Live Race Results"}
        title={publishing ? "Review & publish official results" : "Official results and prizes"}
        description="Uses RaceResults, Registrations, Horses, UserProfiles, Prizes, and payout-related Bets."
      />
      <DataTable rows={rows} />
      {publishing && (
        <button className="primary-button fit" type="button">
          <ClipboardCheck size={18} />
          Publish selected results
        </button>
      )}
    </section>
  );
}

function RankingsPage() {
  const horseRows = horses
    .map((horse) => ({
      Horse: horse.horseName,
      Breed: horse.breed,
      Wins: horse.recordWins,
      Status: horse.status,
      Score: horse.recordWins * 120 + (horse.status === "Healthy" ? 20 : 0)
    }))
    .sort((a, b) => b.Score - a.Score);

  return (
    <section className="page-stack">
      <PanelHeader kicker="Global Rankings" title="Horse and jockey performance board" description="Shared ranking screen for Spectator, Owner, Jockey, and Admin." />
      <DataTable rows={horseRows} />
    </section>
  );
}

function WalletPage({ user }) {
  const rows = payments.map((payment) => ({
    Transaction: payment.id,
    Account: demoAccounts.find((account) => account.id === payment.accountId)?.fullName,
    Amount: formatCurrency(payment.amount),
    Status: payment.status,
    Created: formatDateTime(payment.createAt)
  }));
  return (
    <section className="page-stack">
      <PanelHeader kicker="Wallet / Deposit" title="Point balance and deposits" description="Maps to UserProfiles.Balance, Payment, and ConversionRate." />
      <div className="metric-grid two">
        <MetricCard label="Current Balance" value={formatCurrency(user?.balance || 1250000)} icon={Wallet} />
        <MetricCard label="Conversion Rate" value="1 point = 1,000 VND" icon={CircleDollarSign} />
      </div>
      <DataTable rows={rows} />
      <div className="form-grid dense">
        <label className="field">
          <span>Deposit amount</span>
          <input defaultValue="500000" />
        </label>
        <button className="primary-button" type="button">
          <Wallet size={18} />
          Deposit points
        </button>
      </div>
    </section>
  );
}

function HorseManagementPage({ ownerOnly = false, user, embedded = false }) {
  const ownerId = user?.id || "e3ad08be";
  const source = ownerOnly ? horses.filter((horse) => horse.ownerId === ownerId || horse.ownerId === "e3ad08be") : horses;
  const rows = source.map((horse) => ({
    Horse: horse.horseName,
    Age: horse.age,
    Breed: horse.breed,
    Weight: `${horse.weight} kg`,
    Color: horse.color,
    Wins: horse.recordWins,
    Status: horse.status
  }));

  const body = (
    <>
      <DataTable rows={embedded ? rows.slice(0, 3) : rows} />
      {!embedded && (
        <div className="form-grid dense">
          <label className="field">
            <span>Horse Name</span>
            <input placeholder="New horse" />
          </label>
          <label className="field">
            <span>Breed</span>
            <input placeholder="Thoroughbred" />
          </label>
          <label className="field">
            <span>Status</span>
            <select>
              <option>Healthy</option>
              <option>Injury</option>
              <option>Resting</option>
              <option>Retired</option>
            </select>
          </label>
          <button className="primary-button" type="button">
            <ShieldCheck size={18} />
            Add horse
          </button>
        </div>
      )}
    </>
  );

  if (embedded) {
    return (
      <section className="panel">
        <PanelHeader kicker={ownerOnly ? "My Horse Management" : "Horse Management"} title="Horse roster" description="Horse fields map to Horses table." compact />
        {body}
      </section>
    );
  }

  return (
    <section className="page-stack">
      <PanelHeader
        kicker={ownerOnly ? "My Horse Management" : "Admin Horse Management"}
        title={ownerOnly ? "My stable" : "All registered horses"}
        description="Manage horse name, age, breed, weight, color, record wins, and status."
      />
      {body}
    </section>
  );
}

function RegisterHorsePage() {
  return (
    <section className="page-stack">
      <PanelHeader kicker="Register Horse for Race" title="Create race entry" description="Creates a Registrations record with RaceID, HorseID, JockeyID, GateNumber, confirmations, and status." />
      <div className="form-grid">
        <label className="field">
          <span>Race</span>
          <select>{races.map((race) => <option key={race.id}>Race {race.raceNumber} - {race.status}</option>)}</select>
        </label>
        <label className="field">
          <span>Horse</span>
          <select>{horses.map((horse) => <option key={horse.id}>{horse.horseName}</option>)}</select>
        </label>
        <label className="field">
          <span>Gate Number</span>
          <input type="number" defaultValue="3" />
        </label>
        <label className="field">
          <span>Status</span>
          <select>
            <option>Pending</option>
            <option>Confirmed</option>
          </select>
        </label>
        <button className="primary-button" type="button">
          <ClipboardCheck size={18} />
          Register entry
        </button>
      </div>
    </section>
  );
}

function JockeySelectionPage({ admin = false, embedded = false }) {
  const rows = registrations.map((entry) => {
    const horse = horses.find((item) => item.id === entry.horseId);
    const race = races.find((item) => item.id === entry.raceId);
    const jockey = demoAccounts.find((item) => item.id === entry.jockeyId);
    return {
      Horse: horse?.horseName,
      Race: `Race ${race?.raceNumber}`,
      Jockey: jockey?.fullName,
      Experience: `${jockey?.experienceYears || 5} yrs`,
      Rating: jockey?.jockeyRating || 4.72,
      Confirmation: entry.jockeyConfirmation ? "Accepted" : "Pending"
    };
  });

  const content = (
    <>
      <DataTable rows={embedded ? rows.slice(0, 3) : rows} />
      {!embedded && (
        <button className="primary-button fit" type="button">
          <UserCheck size={18} />
          {admin ? "Assign jockey" : "Send invitation"}
        </button>
      )}
    </>
  );

  if (embedded) {
    return (
      <section className="panel">
        <PanelHeader kicker={admin ? "Jockey Assignment" : "Jockey Selection"} title="Assignments" description="Uses Registrations as basic invitation state." compact />
        {content}
      </section>
    );
  }

  return (
    <section className="page-stack">
      <PanelHeader
        kicker={admin ? "Admin Jockey Assignment" : "Horse Owner Jockey Selection"}
        title={admin ? "Manage jockey assignment" : "Select jockey for race entry"}
        description="Uses Account.Role = Jockey, UserProfiles, JockeyProfile, Registrations, Horses, and Races."
      />
      {content}
    </section>
  );
}

function SchedulePage({ role, embedded = false }) {
  const rows = registrations.map((entry) => {
    const race = races.find((item) => item.id === entry.raceId);
    const horse = horses.find((item) => item.id === entry.horseId);
    const view = getRaceViewModel(race);
    return {
      Race: `Race ${race?.raceNumber}`,
      Horse: horse?.horseName,
      Tournament: view.tournament?.tournamentName,
      Racecourse: view.racecourse?.racecourseName,
      Start: formatDateTime(race?.startTime),
      Gate: entry.gateNumber,
      Status: entry.status
    };
  });

  const title = role === "Jockey" ? "Jockey schedule" : "Horse schedule";
  if (embedded) {
    return (
      <section className="panel">
        <PanelHeader kicker={title} title="Upcoming assignments" description="Avoid overlapping check-in windows." compact />
        <DataTable rows={rows.slice(0, 3)} />
      </section>
    );
  }
  return (
    <section className="page-stack">
      <PanelHeader kicker={title} title="Race calendar" description="Race, horse, tournament, racecourse, start time, gate, and entry status." />
      <DataTable rows={rows} />
    </section>
  );
}

function RideInvitationsPage({ embedded = false }) {
  const rows = registrations
    .filter((entry) => !entry.jockeyConfirmation)
    .map((entry) => {
      const horse = horses.find((item) => item.id === entry.horseId);
      const race = races.find((item) => item.id === entry.raceId);
      const owner = demoAccounts.find((item) => item.id === horse?.ownerId);
      return {
        Horse: horse?.horseName,
        Owner: owner?.fullName,
        Race: `Race ${race?.raceNumber}`,
        Start: formatDateTime(race?.startTime),
        Status: entry.status,
        Action: "Accept / Reject"
      };
    });

  const content = <DataTable rows={rows} emptyMessage="No pending invitations." />;
  if (embedded) {
    return (
      <section className="panel">
        <PanelHeader kicker="Ride Invitations" title="Pending owner requests" description="Accepting updates JockeyConfirmation." compact />
        {content}
      </section>
    );
  }
  return (
    <section className="page-stack">
      <PanelHeader kicker="Ride Invitations" title="Pending owner requests" description="Uses Registrations, Horses, Races, Tournaments, Racecourses, and UserProfiles." />
      {content}
    </section>
  );
}

function RaceMonitoringPage({ embedded = false }) {
  const liveRaces = races.filter((race) => ["Live", "ResultPending", "BettingOpen"].includes(race.status));
  const rows = liveRaces.map((race) => {
    const view = getRaceViewModel(race);
    return {
      Race: `Race ${race.raceNumber}`,
      Racecourse: view.racecourse?.racecourseName,
      Entries: view.entries.length,
      Status: race.status,
      "Track Length": `${race.trackLength}m`,
      "Start Time": formatDateTime(race.startTime)
    };
  });

  const content = (
    <>
      <DataTable rows={rows} />
      <div className="track-monitor">
        <div>
          <span>START</span>
          <span>1/4 M</span>
          <span>1/2 M</span>
          <span>3/4 M</span>
          <span>FINISH</span>
        </div>
        <div className="race-track large">
          <span style={{ left: "35%" }} />
          <span style={{ left: "54%" }} />
          <span style={{ left: "68%" }} />
        </div>
      </div>
    </>
  );
  if (embedded) {
    return (
      <section className="panel">
        <PanelHeader kicker="Race Monitoring" title="Live operations" description="Referee view of active races." compact />
        {content}
      </section>
    );
  }
  return (
    <section className="page-stack">
      <PanelHeader kicker="Race Monitoring" title="Live operations" description="Race info, horse/jockey entries, status, result, and violations." />
      {content}
    </section>
  );
}

function HorseCheckPage() {
  const rows = horses.map((horse) => ({
    Horse: horse.horseName,
    Age: horse.age,
    Breed: horse.breed,
    Weight: `${horse.weight} kg`,
    Color: horse.color,
    Status: horse.status,
    Clearance: horse.status === "Healthy" ? "Ready" : "Review"
  }));
  return (
    <section className="page-stack">
      <PanelHeader kicker="Horse Check" title="Pre-race horse verification" description="Referee check screen using Horses and Registrations data." />
      <DataTable rows={rows} />
    </section>
  );
}

function ViolationsPage({ embedded = false }) {
  const rows = reports.map((report) => {
    const race = races.find((item) => item.id === report.raceId);
    const referee = demoAccounts.find((item) => item.id === report.refereeId);
    return {
      Race: `Race ${race?.raceNumber}`,
      Referee: referee?.fullName,
      Incident: report.incidentDescription,
      Penalty: report.penaltyApplied,
      Created: formatDateTime(report.createdAt)
    };
  });

  if (embedded) {
    return (
      <section className="panel">
        <PanelHeader kicker="Violation Management" title="Incident queue" description="Mapped to RefereeReports." compact />
        <DataTable rows={rows.slice(0, 2)} />
      </section>
    );
  }

  return (
    <section className="page-stack">
      <PanelHeader kicker="Violation Management" title="Incident queue" description="RaceID, RefereeID, IncidentDescription, PenaltyApplied, and CreatedAt." />
      <DataTable rows={rows} />
      <div className="form-grid dense">
        <label className="field">
          <span>Incident Description</span>
          <input placeholder="Describe violation" />
        </label>
        <label className="field">
          <span>Penalty Applied</span>
          <select>
            <option>None</option>
            <option>Warning</option>
            <option>Disqualification</option>
          </select>
        </label>
        <button className="primary-button" type="button">
          <AlertTriangle size={18} />
          Log incident
        </button>
      </div>
    </section>
  );
}

function ResultFormPage() {
  const rows = registrations.map((entry) => {
    const horse = horses.find((item) => item.id === entry.horseId);
    const jockey = demoAccounts.find((item) => item.id === entry.jockeyId);
    return {
      Registration: entry.id,
      Horse: horse?.horseName,
      Jockey: jockey?.fullName,
      Gate: entry.gateNumber,
      Status: entry.status,
      "Finish Position": "",
      "Finish Time": ""
    };
  });
  return (
    <section className="page-stack">
      <PanelHeader kicker="Result Form" title="Record official race results" description="Creates RaceResults and triggers settlement after confirmation." />
      <DataTable rows={rows} />
      <button className="primary-button fit" type="button">
        <CheckCircle2 size={18} />
        Confirm official results
      </button>
    </section>
  );
}

function RaceReportPage() {
  return (
    <section className="page-stack">
      <PanelHeader kicker="Race Report" title="Official referee report" description="Combines race information, official results, horse/jockey entries, violations, and penalties." />
      <ResultsPage />
      <ViolationsPage embedded />
    </section>
  );
}

function UserManagementPage({ embedded = false }) {
  const rows = demoAccounts.map((account) => ({
    Email: account.email,
    Role: roles[account.role],
    Status: account.status,
    FullName: account.fullName,
    Phone: account.phone,
    Balance: account.balance ? formatCurrency(account.balance) : "-"
  }));

  const content = <DataTable rows={embedded ? rows.slice(0, 4) : rows} />;
  if (embedded) {
    return (
      <section className="panel">
        <PanelHeader kicker="User Management" title="Recent accounts" description="Account + UserProfiles summary." compact />
        {content}
      </section>
    );
  }
  return (
    <section className="page-stack">
      <PanelHeader kicker="User Management" title="Tournament personnel" description="Manage Account.Email, Role, Status, UserProfiles.FullName, Phone, and Balance." />
      {content}
    </section>
  );
}

function AccountApprovalPage() {
  const rows = demoAccounts
    .filter((account) => account.status === "Pending")
    .map((account) => ({
      Email: account.email,
      Role: roles[account.role],
      FullName: account.fullName,
      Phone: account.phone,
      Status: account.status,
      Action: "Approve / Reject"
    }));
  return (
    <section className="page-stack">
      <PanelHeader kicker="Account Approval" title="Pending registration requests" description="Horse Owner, Jockey, and Referee accounts require Admin approval." />
      <DataTable rows={rows} emptyMessage="No pending accounts." />
    </section>
  );
}

function TournamentPage() {
  const rows = tournaments.map((item) => ({
    Tournament: item.tournamentName,
    Description: item.description,
    StartDate: item.startDate,
    EndDate: item.endDate,
    Status: item.status
  }));
  return (
    <section className="page-stack">
      <PanelHeader kicker="Tournament Management" title="Tournament list" description="Add, update, and view tournament records." />
      <DataTable rows={rows} />
    </section>
  );
}

function RacecoursePage() {
  const rows = racecourses.map((item) => ({
    Racecourse: item.racecourseName,
    Location: item.location,
    TrackType: item.trackType,
    Status: "Available"
  }));
  return (
    <section className="page-stack">
      <PanelHeader kicker="Racecourse Management" title="Track directory" description="RacecourseName, Location, and TrackType." />
      <DataTable rows={rows} />
    </section>
  );
}

function RefereeAssignmentPage() {
  const rows = races.map((race) => ({
    Race: `Race ${race.raceNumber}`,
    Status: race.status,
    Referee: "Track Referee",
    Note: "Basic view until RaceReferees table exists"
  }));
  return (
    <section className="page-stack">
      <PanelHeader kicker="Referee Assignment" title="Assign officials to races" description="The current DB has RefereeReports but no RaceReferees table, so this screen is prepared as a basic assignment workflow." />
      <DataTable rows={rows} />
    </section>
  );
}

function NotificationsPage({ role }) {
  const rows = notifications
    .filter((item) => item.role === role || role === "Admin")
    .map((item) => ({
      Title: item.title,
      Role: roles[item.role] || item.role,
      Severity: item.severity,
      Message: item.message
    }));
  return (
    <section className="page-stack">
      <PanelHeader kicker="Notification Center" title="Alerts and support" description="Static notification center until a Notifications table/API is added." />
      <DataTable rows={rows} emptyMessage="No notifications for this role." />
    </section>
  );
}

function ProfilePage({ user, role }) {
  const profile = user || demoAccounts.find((account) => account.role === role) || demoAccounts[0];
  const rows = [
    { Field: "Email", Value: profile.email },
    { Field: "Role", Value: roles[profile.role] || roles[role] || "Guest" },
    { Field: "Status", Value: profile.status || "Active" },
    { Field: "Full Name", Value: profile.fullName || "Guest user" },
    { Field: "Phone", Value: profile.phone || "-" },
    { Field: "Balance", Value: formatCurrency(profile.balance || 0) }
  ];
  if (profile.role === "Jockey" || role === "Jockey") {
    rows.push({ Field: "Experience Years", Value: profile.experienceYears || 5 });
    rows.push({ Field: "Jockey Rating", Value: profile.jockeyRating || 4.72 });
  }
  return (
    <section className="page-stack">
      <PanelHeader kicker="User Profile" title="Account and profile information" description="Maps to Account, UserProfiles, and role-specific JockeyProfile fields." />
      <DataTable rows={rows} />
    </section>
  );
}

function SystemHealth() {
  const checks = [
    { label: "JWT Auth", value: "Configured in FE", tone: "live" },
    { label: "Backend API", value: "localhost:5035", tone: "info" },
    { label: "Notifications DB", value: "Missing table", tone: "warning" },
    { label: "RaceReferees DB", value: "Missing table", tone: "warning" }
  ];
  return (
    <section className="panel">
      <PanelHeader kicker="System Support" title="Implementation notes" description="Items inferred from RDS, SQL, and backend source." compact />
      <div className="check-grid">
        {checks.map((item) => (
          <div className="check-item" key={item.label}>
            <StatusPill tone={item.tone}>{item.label}</StatusPill>
            <strong>{item.value}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}

function PanelHeader({ kicker, title, description, compact = false }) {
  return (
    <div className={`section-heading ${compact ? "compact" : ""}`}>
      <span>{kicker}</span>
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </div>
  );
}

function MetricCard({ label, value, icon: Icon }) {
  return (
    <article className="metric-card">
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
      <Icon size={22} />
    </article>
  );
}

function DataTable({ rows, emptyMessage = "No records found." }) {
  const columns = useMemo(() => {
    const first = rows[0];
    return first ? Object.keys(first) : [];
  }, [rows]);

  if (!rows.length) {
    return (
      <div className="empty-state">
        <ClipboardList size={22} />
        <span>{emptyMessage}</span>
      </div>
    );
  }

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column}>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              {columns.map((column) => (
                <td key={column}>{renderCell(row[column])}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StatusPill({ tone = "neutral", children }) {
  return <span className={`status-pill ${tone}`}>{children}</span>;
}

function renderCell(value) {
  if (["Active", "Healthy", "Confirmed", "Official", "Completed", "Ready", "Won", "Accepted"].includes(value)) {
    return <StatusPill tone="live">{value}</StatusPill>;
  }
  if (["Pending", "InvitationPending", "ResultPending", "Scheduled", "Resting", "Ready to publish"].includes(value)) {
    return <StatusPill tone="warning">{value}</StatusPill>;
  }
  if (["Banned", "Error", "Review"].includes(value)) {
    return <StatusPill tone="danger">{value}</StatusPill>;
  }
  if (["BettingOpen", "Live", "Info"].includes(value)) {
    return <StatusPill tone="info">{value}</StatusPill>;
  }
  return value ?? "-";
}

function normalizeRole(role) {
  const compact = String(role || "Spectator").replace(/\s+/g, "");
  if (compact === "HorseOwner") return "HorseOwner";
  if (compact in roles) return compact;
  return "Spectator";
}

function initials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function statusTone(status) {
  if (["Live", "BettingOpen"].includes(status)) return "info";
  if (["Scheduled", "ResultPending", "Pending"].includes(status)) return "warning";
  if (["Completed", "Finished", "Active"].includes(status)) return "live";
  return "neutral";
}

function DatabaseIcon(props) {
  return <ClipboardList {...props} />;
}

export default App;
