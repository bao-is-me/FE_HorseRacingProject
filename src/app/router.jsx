import React from "react";
import AccountApprovalPage from "../features/admin/pages/AccountApprovalPage";
import RacecoursePage from "../features/admin/pages/RacecoursePage";
import RefereeAssignmentPage from "../features/admin/pages/RefereeAssignmentPage";
import TournamentPage from "../features/admin/pages/TournamentPage";
import UserManagementPage from "../features/admin/pages/UserManagementPage";
import LoginPage from "../features/auth/pages/LoginPage";
import RegisterPage from "../features/auth/pages/RegisterPage";
import BetHistoryPage from "../features/betting/pages/BetHistoryPage";
import PredictionBetPage from "../features/betting/pages/PredictionBetPage";
import WalletPage from "../features/betting/pages/WalletPage";
import AdminDashboard from "../features/dashboard/pages/AdminDashboard";
import DashboardFallback from "../features/dashboard/pages/DashboardFallback";
import JockeyDashboard from "../features/dashboard/pages/JockeyDashboard";
import OwnerDashboard from "../features/dashboard/pages/OwnerDashboard";
import RefereeDashboard from "../features/dashboard/pages/RefereeDashboard";
import SpectatorDashboard from "../features/dashboard/pages/SpectatorDashboard";
import HomePage from "../features/homepage/pages/HomePage";
import HorseManagementPage from "../features/horses/pages/HorseManagementPage";
import RegisterHorsePage from "../features/horses/pages/RegisterHorsePage";
import JockeySelectionPage from "../features/jockey/pages/JockeySelectionPage";
import RideInvitationsPage from "../features/jockey/pages/RideInvitationsPage";
import SchedulePage from "../features/jockey/pages/SchedulePage";
import NotificationsPage from "../features/notifications/pages/NotificationsPage";
import ProfilePage from "../features/profile/pages/ProfilePage";
import RaceListPage from "../features/races/pages/RaceListPage";
import HorseCheckPage from "../features/referee/pages/HorseCheckPage";
import RaceMonitoringPage from "../features/referee/pages/RaceMonitoringPage";
import RaceReportPage from "../features/referee/pages/RaceReportPage";
import ResultFormPage from "../features/referee/pages/ResultFormPage";
import ViolationsPage from "../features/referee/pages/ViolationsPage";
import RankingsPage from "../features/results/pages/RankingsPage";
import ResultsPage from "../features/results/pages/ResultsPage";

function AppRouter({ role, activePage, user, setSession, activateRole, setActivePage }) {
  if (activePage === "login") {
    return <LoginPage setSession={setSession} activateRole={activateRole} setActivePage={setActivePage} />;
  }
  if (activePage === "register") {
    return <RegisterPage activateRole={activateRole} setActivePage={setActivePage} />;
  }
  if (activePage === "public-races") return <RaceListPage publicView />;

  switch (activePage) {
    case "home":
      return <HomePage role={role} user={user} onNavigate={setActivePage} />;
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

export default AppRouter;
