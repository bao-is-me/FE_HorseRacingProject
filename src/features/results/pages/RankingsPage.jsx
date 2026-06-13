import React from "react";
import DataTable from "../../../components/ui/DataTable";
import PanelHeader from "../../../components/ui/PanelHeader";
import { getRankingRows } from "../resultSelectors";

function RankingsPage() {
  const horseRows = getRankingRows();

  return (
    <section className="page-stack">
      <PanelHeader kicker="Global Rankings" title="Horse and jockey performance board" description="Shared ranking screen for Spectator, Owner, Jockey, and Admin." />
      <DataTable rows={horseRows} />
    </section>
  );
}

export default RankingsPage;
