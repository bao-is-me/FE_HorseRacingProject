import React, { useMemo, useState } from "react";
import { CalendarDays, Flag } from "lucide-react";
import PanelHeader from "../../../components/ui/PanelHeader";
import StatusPill from "../../../components/ui/StatusPill";
import { FilterToolbar } from "../../../components/ui/WorkspaceUI";
import { getScheduleRows } from "../jockeySelectors";

function SchedulePage({ role, embedded = false }) {
  const rows = getScheduleRows();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const filtered = useMemo(() => rows.filter((row) => (!search || [row.Horse, row.Race, row.Racecourse].some((value) => String(value).toLowerCase().includes(search.toLowerCase()))) && (status === "All" || row.Status === status)), [rows, search, status]);
  const title = role === "Jockey" ? "Jockey schedule" : "Horse schedule";
  const timeline = <div className="workspace-timeline">{filtered.map((row) => <article className="workspace-timeline-item" key={`${row.Race}-${row.Horse}`}><div className="workspace-timeline-time">{row.Start}</div><div className="workspace-timeline-dot" /><div className="workspace-timeline-content"><div className="workspace-card-top"><h3>{row.Race} · {row.Horse}</h3><StatusPill>{row.Status}</StatusPill></div><p>{row.Tournament} at {row.Racecourse}</p><div className="workspace-card-meta"><Flag size={14} /><span>Gate {row.Gate ?? "TBD"}</span></div></div></article>)}</div>;
  if (embedded) return <section className="panel"><PanelHeader kicker={title} title="Upcoming assignments" description="Timeline of race check-in windows." compact />{timeline}</section>;
  return <section className="page-stack workspace-page"><PanelHeader kicker={title} title="Race calendar" description="A timeline view of race, horse, track, gate, and confirmation status." /><section className="panel workspace-table-panel"><FilterToolbar search={search} onSearch={setSearch} placeholder="Search race, horse or track..."><select value={status} onChange={(e) => setStatus(e.target.value)}>{["All", ...new Set(rows.map((r) => r.Status))].map((item) => <option key={item}>{item}</option>)}</select></FilterToolbar><div style={{ padding: 20 }}>{timeline}</div></section></section>;
}
export default SchedulePage;
