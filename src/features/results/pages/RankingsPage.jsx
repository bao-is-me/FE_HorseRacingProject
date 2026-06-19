import React, { useMemo, useState } from "react";
import { Medal, Search, Trophy } from "lucide-react";
import PanelHeader from "../../../components/ui/PanelHeader";
import StatusPill from "../../../components/ui/StatusPill";
import { FilterToolbar } from "../../../components/ui/WorkspaceUI";
import { getRankingRows } from "../resultSelectors";

function RankingsPage() {
  const rows = getRankingRows();
  const [search, setSearch] = useState("");
  const filtered = useMemo(() => rows.filter((row) => [row.Horse, row.Breed].some((value) => String(value).toLowerCase().includes(search.toLowerCase()))), [rows, search]);
  return <section className="page-stack workspace-page"><PanelHeader kicker="Global Rankings" title="Horse performance board" description="A wins-based ranking view using only persisted horse statistics." /><div className="workspace-card-grid">{rows.slice(0, 3).map((row, index) => <article className="workspace-card" key={row.Horse}><div className="workspace-card-top"><span className={`race-position-badge pos-${index + 1}`}>{index + 1}</span>{index === 0 ? <Trophy size={21} /> : <Medal size={21} />}</div><h3>{row.Horse}</h3><p>{row.Breed}</p><div className="workspace-kpi"><span>Record wins</span><strong>{row.Wins}</strong></div><StatusPill>{row.Status}</StatusPill></article>)}</div><section className="panel workspace-table-panel"><FilterToolbar search={search} onSearch={setSearch} placeholder="Search horse or breed..." /><div className="workspace-list" style={{ padding: 16 }}>{filtered.map((row, index) => <article className="workspace-list-item" key={row.Horse}><div className="race-position-badge">{index + 1}</div><div><h3>{row.Horse}</h3><p>{row.Breed} · {row.Wins} wins</p></div><StatusPill>{row.Status}</StatusPill></article>)}</div></section></section>;
}
export default RankingsPage;
