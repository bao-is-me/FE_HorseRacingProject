import React from "react";
import { Activity, AlertTriangle, CheckCircle2, ClipboardCheck } from "lucide-react";
import RaceMonitoringPage from "../../referee/pages/RaceMonitoringPage";
import ViolationsPage from "../../referee/pages/ViolationsPage";
import DashboardPage from "./DashboardPage";
import { getRefereeMetrics } from "../dashboardSelectors";

function RefereeDashboard() {
  const metrics = getRefereeMetrics();
  return (
    <DashboardPage
      kicker="Race Referee Dashboard"
      title="Race control center"
      description="Monitor live races, check runners, log violations, enter official results, and publish reports."
      metrics={[
        { label: "Live Races", value: metrics.liveRaces, icon: Activity },
        { label: "Pending Results", value: metrics.pendingResults, icon: ClipboardCheck },
        { label: "Incident Reports", value: metrics.incidentReports, icon: AlertTriangle },
        { label: "Official Results", value: metrics.officialResults, icon: CheckCircle2 }
      ]}
    >
      <RaceMonitoringPage embedded />
      <ViolationsPage embedded />
    </DashboardPage>
  );
}

export default RefereeDashboard;
