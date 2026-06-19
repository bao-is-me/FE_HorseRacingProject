import React, { useState } from "react";
import { AlertTriangle, FileWarning } from "lucide-react";
import PanelHeader from "../../../components/ui/PanelHeader";
import StatusPill from "../../../components/ui/StatusPill";
import { WorkspaceNotice } from "../../../components/ui/WorkspaceUI";
import { PENALTY_OPTIONS } from "../../../mocks/referee.mock";
import { getViolationRows } from "../refereeSelectors";

function ViolationsPage({ embedded = false }) {
  const [rows, setRows] = useState(getViolationRows);
  const [incident, setIncident] = useState("");
  const [penalty, setPenalty] = useState(PENALTY_OPTIONS[0]);
  const [notice, setNotice] = useState("");
  const submit = () => {
    if (!incident.trim()) return setNotice("Incident description is required.");
    setRows((current) => [{ Race: "Race demo", Referee: "Track Referee", Incident: incident, Penalty: penalty, Created: new Date().toLocaleString() }, ...current]);
    setIncident(""); setNotice("Violation logged in local demo state.");
  };
  const list = <div className="workspace-list">{rows.map((row, index) => <article className="workspace-list-item" key={`${row.Race}-${index}`}><div className="workspace-list-icon"><FileWarning size={18} /></div><div><h3>{row.Race} · {row.Penalty}</h3><p>{row.Incident}</p><div className="workspace-card-meta"><span>{row.Referee}</span><span>{row.Created}</span></div></div><StatusPill>{row.Penalty === "None" ? "Completed" : "Pending"}</StatusPill></article>)}</div>;
  if (embedded) return <section className="panel"><PanelHeader kicker="Violation Management" title="Incident queue" description="Recent referee reports and penalties." compact />{list}</section>;
  return <section className="page-stack workspace-page"><PanelHeader kicker="Violation Management" title="Incident and penalty log" description="Review reports and submit a local incident record for workflow testing." /><WorkspaceNotice tone={notice.includes("required") ? "warning" : "success"} onClose={() => setNotice("")}>{notice}</WorkspaceNotice><div className="horse-register-layout"><section className="panel"><PanelHeader kicker="Incident queue" title={`${rows.length} referee reports`} compact />{list}</section><aside className="panel workspace-form"><PanelHeader kicker="New report" title="Log violation" description="Mock submit only." compact /><label className="field"><span>Incident Description</span><input value={incident} onChange={(e) => setIncident(e.target.value)} placeholder="Describe violation" /></label><label className="field"><span>Penalty Applied</span><select value={penalty} onChange={(e) => setPenalty(e.target.value)}>{PENALTY_OPTIONS.map((item) => <option key={item}>{item}</option>)}</select></label><button className="primary-button" type="button" onClick={submit}><AlertTriangle size={18} /> Log incident</button></aside></div></section>;
}
export default ViolationsPage;
