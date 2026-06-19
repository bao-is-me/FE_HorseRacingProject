import React, { useMemo, useState } from "react";
import { Bell, BellRing, CheckCircle2 } from "lucide-react";
import MetricCard from "../../../components/ui/MetricCard";
import PanelHeader from "../../../components/ui/PanelHeader";
import StatusPill from "../../../components/ui/StatusPill";
import { EmptyPanel, FilterToolbar } from "../../../components/ui/WorkspaceUI";
import { getNotificationRows } from "../notificationSelectors";

function NotificationsPage({ role }) {
  const [items, setItems] = useState(() => getNotificationRows(role).map((item, index) => ({ ...item, id: index, read: false })));
  const [search, setSearch] = useState("");
  const [severity, setSeverity] = useState("All");
  const filtered = useMemo(() => items.filter((item) => (!search || [item.Title, item.Message].some((value) => value.toLowerCase().includes(search.toLowerCase()))) && (severity === "All" || item.Severity === severity)), [items, search, severity]);
  const mark = (id) => setItems((current) => current.map((item) => item.id === id ? { ...item, read: true } : item));
  return <section className="page-stack workspace-page"><PanelHeader kicker="Notification Center" title="Alerts and workflow updates" description="Role-aware demo notifications with local read state." /><div className="workspace-metric-grid"><MetricCard label="Notifications" value={items.length} icon={Bell} /><MetricCard label="Unread" value={items.filter((i) => !i.read).length} icon={BellRing} /><MetricCard label="Warnings" value={items.filter((i) => i.Severity === "Warning").length} icon={BellRing} /><MetricCard label="Read" value={items.filter((i) => i.read).length} icon={CheckCircle2} /></div><section className="panel workspace-table-panel"><FilterToolbar search={search} onSearch={setSearch} placeholder="Search alerts..."><select value={severity} onChange={(e) => setSeverity(e.target.value)}>{["All", ...new Set(items.map((i) => i.Severity))].map((i) => <option key={i}>{i}</option>)}</select></FilterToolbar><div style={{ padding: 16 }}>{filtered.length ? <div className="workspace-list">{filtered.map((item) => <article className="workspace-list-item" key={item.id}><div className="workspace-list-icon">{item.read ? <CheckCircle2 size={18} /> : <BellRing size={18} />}</div><div><h3>{item.Title}</h3><p>{item.Message}</p><div className="workspace-card-meta"><span>{item.Role}</span></div></div><div className="workspace-actions"><StatusPill>{item.Severity}</StatusPill>{!item.read && <button className="secondary-button" type="button" onClick={() => mark(item.id)}>Mark read</button>}</div></article>)}</div> : <EmptyPanel title="No notifications found" />}</div></section></section>;
}
export default NotificationsPage;
