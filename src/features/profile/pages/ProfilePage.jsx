import React from "react";
import DataTable from "../../../components/ui/DataTable";
import PanelHeader from "../../../components/ui/PanelHeader";
import { getProfileRows } from "../profileSelectors";

function ProfilePage({ user, role }) {
  const rows = getProfileRows(user, role);
  return (
    <section className="page-stack">
      <PanelHeader kicker="User Profile" title="Account and profile information" description="Maps to Account, UserProfiles, and role-specific JockeyProfile fields." />
      <DataTable rows={rows} />
    </section>
  );
}

export default ProfilePage;
