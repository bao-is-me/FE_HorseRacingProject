import React, { useMemo, useState } from "react";
import { CheckCircle2, ClipboardCheck, ShieldAlert } from "lucide-react";
import MetricCard from "../../../components/ui/MetricCard";
import PanelHeader from "../../../components/ui/PanelHeader";
import StatusPill from "../../../components/ui/StatusPill";
import { FilterToolbar, WorkspaceNotice } from "../../../components/ui/WorkspaceUI";
import { getHorseCheckRows } from "../refereeSelectors";

function HorseCheckPage() {
  const seed = getHorseCheckRows().map((row) => ({ ...row, Check: "Pending" }));
  const [rows, setRows] = useState(seed);
  const [search, setSearch] = useState("");
  const [notice, setNotice] = useState("");
  const filtered = useMemo(() => rows.filter((row) => [row.Horse, row.Breed, row.Color].some((value) => String(value).toLowerCase().includes(search.toLowerCase()))), [rows, search]);
  const mark = (horse, check) => { setRows((current) => current.map((row) => row.Horse === horse ? { ...row, Check: check } : row)); setNotice(`${horse} marked ${check.toLowerCase()} locally.`); };
  return <section className="page-stack workspace-page"><PanelHeader kicker="Horse Check" title="Pre-race verification" description="Review health and physical details, then record a local referee check." /><div className="workspace-metric-grid"><MetricCard label="Horses" value={rows.length} icon={ClipboardCheck} /><MetricCard label="Cleared" value={rows.filter((r) => r.Check === "Cleared").length} icon={CheckCircle2} /><MetricCard label="Review" value={rows.filter((r) => r.Check === "Review").length} icon={ShieldAlert} /><MetricCard label="Pending" value={rows.filter((r) => r.Check === "Pending").length} icon={ClipboardCheck} /></div><WorkspaceNotice onClose={() => setNotice("")}>{notice}</WorkspaceNotice><section className="panel workspace-table-panel"><FilterToolbar search={search} onSearch={setSearch} placeholder="Search horse, breed or color..." /><div className="workspace-card-grid" style={{ padding: 16 }}>{filtered.map((row) => <article className="workspace-card" key={row.Horse}><div className="workspace-card-top"><StatusPill>{row.Status}</StatusPill><StatusPill>{row.Check}</StatusPill></div><div><h3>{row.Horse}</h3><p>{row.Breed} · {row.Age} years · {row.Color}</p></div><div className="workspace-card-meta"><span>{row.Weight}</span></div><footer><button className="secondary-button" type="button" onClick={() => mark(row.Horse, "Review")}><ShieldAlert size={16} /> Review</button><button className="primary-button" type="button" onClick={() => mark(row.Horse, "Cleared")}><CheckCircle2 size={16} /> Clear</button></footer></article>)}</div></section></section>;
}
export default HorseCheckPage;
