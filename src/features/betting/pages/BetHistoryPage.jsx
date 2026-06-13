import React from "react";
import DataTable from "../../../components/ui/DataTable";
import PanelHeader from "../../../components/ui/PanelHeader";
import { getBetHistoryRows } from "../bettingSelectors";

function BetHistoryPage({ user }) {
  const rows = getBetHistoryRows();
  return (
    <section className="page-stack">
      <PanelHeader kicker="Betting History" title={`${user?.fullName || "Spectator"} bet ledger`} description="Personal betting history linked to Bets and Registrations." />
      <DataTable rows={rows} />
    </section>
  );
}

export default BetHistoryPage;
