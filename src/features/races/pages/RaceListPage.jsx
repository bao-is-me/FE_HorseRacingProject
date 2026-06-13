import React from "react";
import DataTable from "../../../components/ui/DataTable";
import PanelHeader from "../../../components/ui/PanelHeader";
import { getRaceRows } from "../raceSelectors";
import RaceEditor from "./RaceEditor";

function RaceListPage({ publicView = false, role = "Guest" }) {
  const rows = getRaceRows();

  return (
    <section className="page-stack">
      <PanelHeader
        kicker={publicView ? "Public Race" : role === "Admin" ? "Race Management" : "Race Schedule"}
        title={publicView ? "Public race detail" : "Race List"}
        description="Race, tournament, racecourse, start time, participant threshold, and current race status."
      />
      <DataTable rows={rows} />
      {!publicView && role === "Admin" && <RaceEditor />}
    </section>
  );
}

export default RaceListPage;
