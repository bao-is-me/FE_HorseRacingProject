import React from "react";
import { CheckCircle2 } from "lucide-react";
import DataTable from "../../../components/ui/DataTable";
import PanelHeader from "../../../components/ui/PanelHeader";
import { getResultFormRows } from "../refereeSelectors";

function ResultFormPage() {
  const rows = getResultFormRows();
  return (
    <section className="page-stack">
      <PanelHeader kicker="Result Form" title="Record official race results" description="Creates RaceResults and triggers settlement after confirmation." />
      <DataTable rows={rows} />
      <button className="primary-button fit" type="button">
        <CheckCircle2 size={18} />
        Confirm official results
      </button>
    </section>
  );
}

export default ResultFormPage;
