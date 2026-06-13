import React from "react";
import { Activity, CircleDollarSign, Trophy, Wallet } from "lucide-react";
import RaceCards from "../../races/components/RaceCards";
import PredictionBetPage from "../../betting/pages/PredictionBetPage";
import DashboardPage from "./DashboardPage";
import { getSpectatorMetrics } from "../dashboardSelectors";

function SpectatorDashboard({ user }) {
  const metrics = getSpectatorMetrics(user);
  return (
    <DashboardPage
      kicker="Spectator Dashboard"
      title={`Live betting overview${user?.fullName ? ` for ${user.fullName}` : ""}`}
      description="Race discovery, wallet balance, prediction slip, live results, and global rankings."
      metrics={[
        { label: "Wallet Balance", value: metrics.walletBalance, icon: Wallet },
        { label: "Active Bets", value: metrics.activeBets, icon: CircleDollarSign },
        { label: "Open Races", value: metrics.openRaces, icon: Activity },
        { label: "Won Tickets", value: metrics.wonTickets, icon: Trophy }
      ]}
    >
      <RaceCards />
      <PredictionBetPage compact />
    </DashboardPage>
  );
}

export default SpectatorDashboard;
