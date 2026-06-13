import React from "react";
import { UserCheck } from "lucide-react";
import DataTable from "../../../components/ui/DataTable";
import PanelHeader from "../../../components/ui/PanelHeader";
import { getJockeySelectionRows } from "../jockeySelectors";

function JockeySelectionPage({ admin = false, embedded = false }) {
  const rows = getJockeySelectionRows();

  const content = (
    <>
      <DataTable rows={embedded ? rows.slice(0, 3) : rows} />
      {!embedded && (
        <button className="primary-button fit" type="button">
          <UserCheck size={18} />
          {admin ? "Assign jockey" : "Send invitation"}
        </button>
      )}
    </>
  );

  if (embedded) {
    return (
      <section className="panel">
        <PanelHeader kicker={admin ? "Jockey Assignment" : "Jockey Selection"} title="Assignments" description="Uses Registrations as basic invitation state." compact />
        {content}
      </section>
    );
  }

  return (
    <section className="page-stack">
      <PanelHeader
        kicker={admin ? "Admin Jockey Assignment" : "Horse Owner Jockey Selection"}
        title={admin ? "Manage jockey assignment" : "Select jockey for race entry"}
        description="Uses Account.Role = Jockey, UserProfiles, JockeyProfile, Registrations, Horses, and Races."
      />
      {content}
    </section>
  );
}

export default JockeySelectionPage;
