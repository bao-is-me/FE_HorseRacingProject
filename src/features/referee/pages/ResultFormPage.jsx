import React, { useState } from "react";
import { CheckCircle2, Timer, Trophy } from "lucide-react";
import PanelHeader from "../../../components/ui/PanelHeader";
import StatusPill from "../../../components/ui/StatusPill";
import { WorkspaceNotice } from "../../../components/ui/WorkspaceUI";
import { getResultFormRows } from "../refereeSelectors";

function ResultFormPage() {
  const [rows, setRows] = useState(() => getResultFormRows().map((row, index) => ({ ...row, position: index + 1, finishTime: 120000 + index * 3000 })));
  const [notice, setNotice] = useState("");
  const update = (registration, field, value) => setRows((current) => current.map((row) => row.Registration === registration ? { ...row, [field]: value } : row));
  return <section className="page-stack workspace-page"><PanelHeader kicker="Result Form" title="Record official race results" description="Enter finish position and time in local state, then review confirmation." /><WorkspaceNotice onClose={() => setNotice("")}>{notice}</WorkspaceNotice><section className="panel workspace-table-panel"><div className="workspace-table"><table><thead><tr><th>Horse</th><th>Jockey</th><th>Gate</th><th>Entry status</th><th>Position</th><th>Finish time (ms)</th></tr></thead><tbody>{rows.map((row) => <tr key={row.Registration}><td><strong>{row.Horse}</strong></td><td>{row.Jockey}</td><td>{row.Gate}</td><td><StatusPill>{row.Status}</StatusPill></td><td><input type="number" min="1" value={row.position} onChange={(e) => update(row.Registration, "position", e.target.value)} /></td><td><input type="number" min="1" value={row.finishTime} onChange={(e) => update(row.Registration, "finishTime", e.target.value)} /></td></tr>)}</tbody></table></div></section><div className="workspace-card-grid"><article className="workspace-card"><Trophy size={20} /><h3>Positions entered</h3><strong>{rows.filter((r) => r.position).length}/{rows.length}</strong></article><article className="workspace-card"><Timer size={20} /><h3>Timing records</h3><strong>{rows.filter((r) => r.finishTime).length}/{rows.length}</strong></article><article className="workspace-card"><CheckCircle2 size={20} /><h3>Confirmation</h3><button className="primary-button" type="button" onClick={() => setNotice("Official result preview confirmed locally.")}>Confirm official results</button></article></div></section>;
}
export default ResultFormPage;
