import React from "react";
import DataTable from "../../../components/ui/DataTable";
import PanelHeader from "../../../components/ui/PanelHeader";
import { getHorseCheckRows } from "../refereeSelectors";

function HorseCheckPage() {
  const rows = getHorseCheckRows();
  return (
    <section className="page-stack">
      <PanelHeader kicker="Horse Check" title="Pre-race horse verification" description="Referee check screen using Horses and Registrations data." />
      <DataTable rows={rows} />
    </section>
  );
}

export default HorseCheckPage;
