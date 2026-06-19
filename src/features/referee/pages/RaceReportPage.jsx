import React from "react";
import { AlertTriangle, ClipboardCheck, Trophy } from "lucide-react";
import MetricCard from "../../../components/ui/MetricCard";
import PanelHeader from "../../../components/ui/PanelHeader";
import { reports } from "../../../mocks/referee.mock";
import { raceResults } from "../../../mocks/results.mock";
import ResultsPage from "../../results/pages/ResultsPage";
import ViolationsPage from "./ViolationsPage";

function RaceReportPage() {
  return (
    <section className="page-stack">
      <PanelHeader kicker="Race Report" title="Official referee report" description="Combines race information, official results, horse/jockey entries, violations, and penalties." />
      <div className="workspace-metric-grid">
        <MetricCard label="Result records" value={raceResults.length} icon={Trophy} />
        <MetricCard label="Incident reports" value={reports.length} icon={AlertTriangle} />
        <MetricCard label="Disqualified" value={raceResults.filter((item) => item.isDisqualified).length} icon={ClipboardCheck} />
        <MetricCard label="Report status" value="Draft" icon={ClipboardCheck} />
      </div>
      <ResultsPage />
      <ViolationsPage embedded />
    </section>
  );
}

export default RaceReportPage;
