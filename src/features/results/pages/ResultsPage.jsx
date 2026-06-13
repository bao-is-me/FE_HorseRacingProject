import React from "react";
import { ClipboardCheck } from "lucide-react";
import DataTable from "../../../components/ui/DataTable";
import PanelHeader from "../../../components/ui/PanelHeader";
import { getResultRows } from "../resultSelectors";

function ResultsPage({ publishing = false }) {
  const rows = getResultRows(publishing);
  return (
    <section className="page-stack">
      <PanelHeader
        kicker={publishing ? "Result Publishing" : "Live Race Results"}
        title={publishing ? "Review & publish official results" : "Official results and prizes"}
        description="Uses RaceResults, Registrations, Horses, UserProfiles, Prizes, and payout-related Bets."
      />
      <DataTable rows={rows} />
      {publishing && (
        <button className="primary-button fit" type="button">
          <ClipboardCheck size={18} />
          Publish selected results
        </button>
      )}
    </section>
  );
}

export default ResultsPage;
