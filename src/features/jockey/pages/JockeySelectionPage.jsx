import React, { useMemo, useState } from "react";
import { Send, UserCheck, Users } from "lucide-react";
import MetricCard from "../../../components/ui/MetricCard";
import PanelHeader from "../../../components/ui/PanelHeader";
import StatusPill from "../../../components/ui/StatusPill";
import { FilterToolbar, WorkspaceNotice } from "../../../components/ui/WorkspaceUI";
import { getJockeySelectionRows } from "../jockeySelectors";

function JockeySelectionPage({ admin = false, embedded = false }) {
  const [rows, setRows] = useState(getJockeySelectionRows);
  const [search, setSearch] = useState("");
  const [notice, setNotice] = useState("");
  const filtered = useMemo(() => rows.filter((row) => [row.Horse, row.Race, row.Jockey].some((value) => String(value).toLowerCase().includes(search.toLowerCase()))), [rows, search]);
  const send = (index) => {
    setRows((current) => current.map((row, rowIndex) => rowIndex === index ? { ...row, Confirmation: "Pending" } : row));
    setNotice(admin ? "Jockey assignment saved locally." : "Invitation sent in demo state.");
  };
  const content = <div className="workspace-card-grid">{filtered.map((row, index) => <article className="workspace-card" key={`${row.Horse}-${row.Race}`}><div className="workspace-card-top"><div className="workspace-list-icon"><UserCheck size={18} /></div><StatusPill>{row.Confirmation}</StatusPill></div><div><h3>{row.Horse}</h3><p>{row.Race} with {row.Jockey}</p></div><div className="workspace-card-meta"><span>{row.Experience}</span><span>Rating {row.Rating}</span></div>{!embedded && <footer><button className="primary-button" type="button" onClick={() => send(index)}><Send size={16} /> {admin ? "Assign jockey" : "Send invitation"}</button></footer>}</article>)}</div>;
  if (embedded) return <section className="panel"><PanelHeader kicker={admin ? "Jockey Assignment" : "Jockey Selection"} title="Assignments" description="Current horse, race, and jockey pairings." compact />{content}</section>;
  return <section className="page-stack workspace-page"><PanelHeader kicker={admin ? "Admin Jockey Assignment" : "Horse Owner Jockey Selection"} title={admin ? "Manage jockey assignment" : "Build race partnerships"} description="Review jockey experience, rating, and invitation confirmation." /><div className="workspace-metric-grid"><MetricCard label="Assignments" value={rows.length} icon={Users} /><MetricCard label="Confirmed" value={rows.filter((r) => r.Confirmation === "Confirmed").length} icon={UserCheck} /><MetricCard label="Pending" value={rows.filter((r) => r.Confirmation === "Pending").length} icon={Send} /><MetricCard label="Available jockeys" value={new Set(rows.map((r) => r.Jockey)).size} icon={Users} /></div><WorkspaceNotice onClose={() => setNotice("")}>{notice}</WorkspaceNotice><section className="panel workspace-table-panel"><FilterToolbar search={search} onSearch={setSearch} placeholder="Search horse, race or jockey..." /><div style={{ padding: 16 }}>{content}</div></section></section>;
}
export default JockeySelectionPage;
