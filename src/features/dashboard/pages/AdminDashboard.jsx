import React from "react";
import { CircleDollarSign, ShieldCheck, UserCheck, Users } from "lucide-react";
import SystemHealth from "../../admin/pages/SystemHealth";
import UserManagementPage from "../../admin/pages/UserManagementPage";
import DashboardPage from "./DashboardPage";
import { getAdminMetrics } from "../dashboardSelectors";

function AdminDashboard() {
  const metrics = getAdminMetrics();
  return (
    <DashboardPage
      kicker="Admin System Overview"
      title="Tournament control console"
      description="User approvals, tournament scheduling, race management, horse roster, result publishing, and betting audit."
      metrics={[
        { label: "Total Users", value: metrics.totalUsers, icon: Users },
        { label: "Pending Accounts", value: metrics.pendingAccounts, icon: UserCheck },
        { label: "Total Horses", value: metrics.totalHorses, icon: ShieldCheck },
        { label: "Total Bets", value: metrics.totalBets, icon: CircleDollarSign }
      ]}
    >
      <SystemHealth />
      <UserManagementPage embedded />
    </DashboardPage>
  );
}

export default AdminDashboard;
