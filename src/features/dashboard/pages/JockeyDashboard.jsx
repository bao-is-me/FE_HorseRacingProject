import React from "react";
import { Bell, Flag, Medal, UserCheck } from "lucide-react";
import RideInvitationsPage from "../../jockey/pages/RideInvitationsPage";
import SchedulePage from "../../jockey/pages/SchedulePage";
import DashboardPage from "./DashboardPage";
import { getJockeyMetrics } from "../dashboardSelectors";

function JockeyDashboard({ user }) {
  const metrics = getJockeyMetrics(user);
  return (
    <DashboardPage
      kicker="Jockey Dashboard"
      title={`Race schedule and invitations${user?.fullName ? ` for ${user.fullName}` : ""}`}
      description="Review pending ride invitations, assigned races, performance results, and ranking."
      metrics={[
        { label: "Experience", value: metrics.experience, icon: UserCheck },
        { label: "Rating", value: metrics.rating, icon: Medal },
        { label: "Pending Invites", value: metrics.pendingInvites, icon: Bell },
        { label: "Assigned Races", value: metrics.assignedRaces, icon: Flag }
      ]}
    >
      <RideInvitationsPage embedded />
      <SchedulePage role="Jockey" embedded />
    </DashboardPage>
  );
}

export default JockeyDashboard;
