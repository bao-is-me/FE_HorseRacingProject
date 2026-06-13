import React from "react";
import DataTable from "../../../components/ui/DataTable";
import PanelHeader from "../../../components/ui/PanelHeader";
import { getRacecourseRows } from "../adminSelectors";

function RacecoursePage() {
  const rows = getRacecourseRows();
  return (
    <section className="page-stack">
      <PanelHeader kicker="Racecourse Management" title="Track directory" description="RacecourseName, Location, and TrackType." />
      <DataTable rows={rows} />
    </section>
  );
}

export default RacecoursePage;
