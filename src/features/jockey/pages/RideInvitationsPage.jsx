import React from "react";
import DataTable from "../../../components/ui/DataTable";
import PanelHeader from "../../../components/ui/PanelHeader";
import { getRideInvitationRows } from "../jockeySelectors";

function RideInvitationsPage({ embedded = false }) {
  const rows = getRideInvitationRows();
  const content = <DataTable rows={rows} emptyMessage="No pending invitations." />;

  if (embedded) {
    return (
      <section className="panel">
        <PanelHeader kicker="Ride Invitations" title="Pending owner requests" description="Accepting updates JockeyConfirmation." compact />
        {content}
      </section>
    );
  }
  return (
    <section className="page-stack">
      <PanelHeader kicker="Ride Invitations" title="Pending owner requests" description="Uses Registrations, Horses, Races, Tournaments, Racecourses, and UserProfiles." />
      {content}
    </section>
  );
}

export default RideInvitationsPage;
