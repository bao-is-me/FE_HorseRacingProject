import React from "react";
import PanelHeader from "../../../components/ui/PanelHeader";
import ResultsPage from "../../results/pages/ResultsPage";
import ViolationsPage from "./ViolationsPage";

function RaceReportPage() {
  return (
    <section className="page-stack">
      <PanelHeader kicker="Race Report" title="Official referee report" description="Combines race information, official results, horse/jockey entries, violations, and penalties." />
      <ResultsPage />
      <ViolationsPage embedded />
    </section>
  );
}

export default RaceReportPage;
