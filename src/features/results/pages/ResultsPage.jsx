import React, { useMemo, useState } from "react";
import { ClipboardCheck, Medal, Trophy } from "lucide-react";
import MetricCard from "../../../components/ui/MetricCard";
import PanelHeader from "../../../components/ui/PanelHeader";
import { FilterToolbar, WorkspaceNotice } from "../../../components/ui/WorkspaceUI";
import { getResultRows } from "../resultSelectors";

function ResultsPage({ publishing = false }) {
  const rows = getResultRows(publishing);
  const [search, setSearch] = useState("");
  const [notice, setNotice] = useState("");
  const filtered = useMemo(() => rows.filter((row) => [row.Horse, row.Jockey, row.Position].some((value) => String(value).toLowerCase().includes(search.toLowerCase()))), [rows, search]);
  return <section className="page-stack workspace-page"><div className="workspace-header-row"><PanelHeader kicker={publishing ? "Result Publishing" : "Live Race Results"} title={publishing ? "Review and publish results" : "Official results and prizes"} description="Race performance, finish timing, disqualification, and prize summary." />{publishing && <button className="primary-button" type="button" onClick={() => setNotice("Selected result preview published locally.")}><ClipboardCheck size={18} /> Publish results</button>}</div><div className="workspace-metric-grid"><MetricCard label="Result records" value={rows.length} icon={ClipboardCheck} /><MetricCard label="Winners" value={rows.filter((row) => row.Position === 1).length} icon={Trophy} /><MetricCard label="Prize records" value={rows.filter((row) => row.Prize !== "-").length} icon={Medal} /><MetricCard label="Disqualified" value={rows.filter((row) => row.Disqualified === "Yes").length} icon={ClipboardCheck} /></div><WorkspaceNotice onClose={() => setNotice("")}>{notice}</WorkspaceNotice><section className="panel workspace-table-panel"><FilterToolbar search={search} onSearch={setSearch} placeholder="Search horse, jockey or position..." /><div className="workspace-card-grid" style={{ padding: 16 }}>{filtered.map((row, index) => <article className="workspace-card" key={`${row.Horse}-${index}`}><div className="workspace-card-top"><span className={`race-position-badge pos-${row.Position}`}>{row.Position}</span><strong>{row.Prize}</strong></div><div><h3>{row.Horse}</h3><p>Jockey: {row.Jockey}</p></div><div className="workspace-card-meta"><span>{row["Finish Time"]}</span><span>Disqualified: {row.Disqualified}</span></div></article>)}</div></section></section>;
}
export default ResultsPage;
