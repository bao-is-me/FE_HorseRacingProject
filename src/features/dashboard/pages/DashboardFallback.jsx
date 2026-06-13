import React from "react";
import { CalendarDays, ClipboardList, ShieldCheck, Users } from "lucide-react";
import { roles } from "../../../mocks/roles.mock";
import DashboardPage from "./DashboardPage";
import { getFallbackMetrics } from "../dashboardSelectors";

function DashboardFallback({ role }) {
  const metrics = getFallbackMetrics();
  return (
    <DashboardPage
      kicker={roles[role] || "Dashboard"}
      title="Workspace"
      description="Select a screen from the sidebar to continue."
      metrics={[
        { label: "Races", value: metrics.races, icon: CalendarDays },
        { label: "Horses", value: metrics.horses, icon: ShieldCheck },
        { label: "Users", value: metrics.users, icon: Users },
        { label: "Reports", value: metrics.reports, icon: ClipboardList }
      ]}
    />
  );
}

export default DashboardFallback;
