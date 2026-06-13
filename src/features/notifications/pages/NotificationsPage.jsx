import React from "react";
import DataTable from "../../../components/ui/DataTable";
import PanelHeader from "../../../components/ui/PanelHeader";
import { getNotificationRows } from "../notificationSelectors";

function NotificationsPage({ role }) {
  const rows = getNotificationRows(role);
  return (
    <section className="page-stack">
      <PanelHeader kicker="Notification Center" title="Alerts and support" description="Static notification center until a Notifications table/API is added." />
      <DataTable rows={rows} emptyMessage="No notifications for this role." />
    </section>
  );
}

export default NotificationsPage;
