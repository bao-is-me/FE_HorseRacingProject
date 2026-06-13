import React from "react";
import DataTable from "../../../components/ui/DataTable";
import PanelHeader from "../../../components/ui/PanelHeader";
import { getLiveRaceRows } from "../refereeSelectors";

function RaceMonitoringPage({ embedded = false }) {
  const rows = getLiveRaceRows();

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

export default RaceMonitoringPage;
