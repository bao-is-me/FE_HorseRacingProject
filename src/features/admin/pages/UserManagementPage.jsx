import React from "react";
import DataTable from "../../../components/ui/DataTable";
import PanelHeader from "../../../components/ui/PanelHeader";
import { getUserRows } from "../adminSelectors";

function UserManagementPage({ embedded = false }) {
  const rows = getUserRows();
  const content = <DataTable rows={embedded ? rows.slice(0, 4) : rows} />;

  if (embedded) {
    return (
      <section className="panel">
        <PanelHeader kicker="User Management" title="Recent accounts" description="Account + UserProfiles summary." compact />
        {content}
      </section>
    );
  }
  return (
    <section className="page-stack">
      <PanelHeader kicker="User Management" title="Tournament personnel" description="Manage Account.Email, Role, Status, UserProfiles.FullName, Phone, and Balance." />
      {content}
    </section>
  );
}

export default UserManagementPage;
