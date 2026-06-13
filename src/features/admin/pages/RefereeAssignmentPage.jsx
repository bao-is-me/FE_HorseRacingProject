import React from "react";
import DataTable from "../../../components/ui/DataTable";
import PanelHeader from "../../../components/ui/PanelHeader";
import { getRefereeAssignmentRows } from "../adminSelectors";

function RefereeAssignmentPage() {
  const rows = getRefereeAssignmentRows();
  return (
    <section className="page-stack">
      <PanelHeader kicker="Referee Assignment" title="Assign officials to races" description="The current DB has RefereeReports but no RaceReferees table, so this screen is prepared as a basic assignment workflow." />
      <DataTable rows={rows} />
    </section>
  );
}

export default RefereeAssignmentPage;
