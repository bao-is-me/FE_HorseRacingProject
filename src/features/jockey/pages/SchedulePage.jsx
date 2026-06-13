import React from "react";
import DataTable from "../../../components/ui/DataTable";
import PanelHeader from "../../../components/ui/PanelHeader";
import { getScheduleRows } from "../jockeySelectors";

function SchedulePage({ role, embedded = false }) {
  const rows = getScheduleRows();
  const title = role === "Jockey" ? "Jockey schedule" : "Horse schedule";

  if (embedded) {
    return (
      <section className="panel">
        <PanelHeader kicker={title} title="Upcoming assignments" description="Avoid overlapping check-in windows." compact />
        <DataTable rows={rows.slice(0, 3)} />
      </section>
    );
  }
  return (
    <section className="page-stack">
      <PanelHeader kicker={title} title="Race calendar" description="Race, horse, tournament, racecourse, start time, gate, and entry status." />
      <DataTable rows={rows} />
    </section>
  );
}

export default SchedulePage;
