import React from "react";
import { Bell, ClipboardCheck, ShieldCheck, Trophy } from "lucide-react";
import HorseManagementPage from "../../horses/pages/HorseManagementPage";
import JockeySelectionPage from "../../jockey/pages/JockeySelectionPage";
import DashboardPage from "./DashboardPage";
import { getOwnerMetrics } from "../dashboardSelectors";

function OwnerDashboard({ user }) {
  const metrics = getOwnerMetrics(user);
  return (
    <DashboardPage
      kicker="Horse Owner Dashboard"
      title="Stable operations"
      description="Manage owned horses, race registration, jockey confirmation, results, and prize distribution."
      metrics={[
        { label: "My Horses", value: metrics.myHorses, icon: ShieldCheck },
        { label: "Confirmed Entries", value: metrics.confirmedEntries, icon: ClipboardCheck },
        { label: "Prize Pool", value: metrics.prizePool, icon: Trophy },
        { label: "Pending Jockeys", value: metrics.pendingJockeys, icon: Bell }
      ]}
    >
      <HorseManagementPage ownerOnly user={user} embedded />
      <JockeySelectionPage embedded />
    </DashboardPage>
  );
}

export default OwnerDashboard;
