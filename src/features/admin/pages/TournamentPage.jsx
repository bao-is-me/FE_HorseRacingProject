import React from "react";
import DataTable from "../../../components/ui/DataTable";
import PanelHeader from "../../../components/ui/PanelHeader";
import { getTournamentRows } from "../adminSelectors";

function TournamentPage() {
  const rows = getTournamentRows();
  return (
    <section className="page-stack">
      <PanelHeader kicker="Tournament Management" title="Tournament list" description="Add, update, and view tournament records." />
      <DataTable rows={rows} />
    </section>
  );
}

export default TournamentPage;
