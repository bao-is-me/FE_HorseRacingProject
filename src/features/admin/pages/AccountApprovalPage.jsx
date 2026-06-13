import React from "react";
import DataTable from "../../../components/ui/DataTable";
import PanelHeader from "../../../components/ui/PanelHeader";
import { getPendingAccountRows } from "../adminSelectors";

function AccountApprovalPage() {
  const rows = getPendingAccountRows();
  return (
    <section className="page-stack">
      <PanelHeader kicker="Account Approval" title="Pending registration requests" description="Horse Owner, Jockey, and Referee accounts require Admin approval." />
      <DataTable rows={rows} emptyMessage="No pending accounts." />
    </section>
  );
}

export default AccountApprovalPage;
