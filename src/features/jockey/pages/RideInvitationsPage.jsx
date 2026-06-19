import React, { useMemo, useState } from "react";
import { Check, Clock3, Flag, X } from "lucide-react";
import PanelHeader from "../../../components/ui/PanelHeader";
import StatusPill from "../../../components/ui/StatusPill";
import { EmptyPanel, FilterToolbar, WorkspaceNotice } from "../../../components/ui/WorkspaceUI";
import { getRideInvitationRows } from "../jockeySelectors";

function RideInvitationsPage({ embedded = false }) {
  const [rows, setRows] = useState(getRideInvitationRows);
  const [search, setSearch] = useState("");
  const [notice, setNotice] = useState("");
  const filtered = useMemo(() => rows.filter((row) => [row.Horse, row.Owner, row.Race].some((value) => String(value).toLowerCase().includes(search.toLowerCase()))), [rows, search]);
  const resolve = (row, decision) => { setRows((current) => current.filter((item) => item !== row)); setNotice(`${row.Horse} invitation ${decision} locally.`); };
  const cards = filtered.length ? <div className="workspace-card-grid">{filtered.map((row) => <article className="workspace-card" key={`${row.Horse}-${row.Race}`}><div className="workspace-card-top"><div className="workspace-list-icon"><Flag size={18} /></div><StatusPill>{row.Status}</StatusPill></div><div><h3>{row.Horse}</h3><p>{row.Race} · requested by {row.Owner}</p></div><div className="workspace-card-meta"><Clock3 size={14} /><span>{row.Start}</span></div>{!embedded && <footer><button className="secondary-button" type="button" onClick={() => resolve(row, "rejected")}><X size={16} /> Decline</button><button className="primary-button" type="button" onClick={() => resolve(row, "accepted")}><Check size={16} /> Accept</button></footer>}</article>)}</div> : <EmptyPanel title="No pending invitations" description="Accepted or declined invitations leave this queue." />;
  if (embedded) return <section className="panel"><PanelHeader kicker="Ride Invitations" title="Pending owner requests" description="Review invitations waiting for confirmation." compact />{cards}</section>;
  return <section className="page-stack workspace-page"><PanelHeader kicker="Ride Invitations" title="Pending owner requests" description="Review horse, owner, race timing, and respond using local demo actions." /><WorkspaceNotice onClose={() => setNotice("")}>{notice}</WorkspaceNotice><section className="panel workspace-table-panel"><FilterToolbar search={search} onSearch={setSearch} placeholder="Search horse, owner or race..." /><div style={{ padding: 16 }}>{cards}</div></section></section>;
}
export default RideInvitationsPage;
