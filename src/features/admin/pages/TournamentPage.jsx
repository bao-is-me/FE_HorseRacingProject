import React, { useMemo, useState } from "react";
import { CalendarDays, Eye, Plus, Trophy } from "lucide-react";
import MetricCard from "../../../components/ui/MetricCard";
import PanelHeader from "../../../components/ui/PanelHeader";
import StatusPill from "../../../components/ui/StatusPill";
import { DetailDrawer, FilterToolbar, InfoGrid, WorkspaceNotice } from "../../../components/ui/WorkspaceUI";
import { tournaments as seed } from "../../../mocks/tournaments.mock";

function TournamentPage() {
  const [items, setItems] = useState(seed);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [notice, setNotice] = useState("");
  const filtered = useMemo(() => items.filter((item) => [item.tournamentName, item.description, item.status]
    .some((value) => String(value).toLowerCase().includes(search.toLowerCase()))), [items, search]);
  const addDemo = () => {
    const item = { id: `t-${Date.now()}`, tournamentName: "New Demo Tournament", description: "Local preview tournament.", startDate: "2026-08-01", endDate: "2026-08-03", status: "Upcoming", fundsPrize: 5000000 };
    setItems((current) => [item, ...current]); setNotice("Demo tournament added locally.");
  };
  return (
    <section className="page-stack workspace-page">
      <div className="workspace-header-row"><PanelHeader kicker="Tournament Management" title="Tournament portfolio" description="Plan dates, prize funds, and lifecycle status in one workspace." /><button className="primary-button" type="button" onClick={addDemo}><Plus size={17} /> New tournament</button></div>
      <div className="workspace-metric-grid">
        <MetricCard label="Tournaments" value={items.length} icon={Trophy} />
        <MetricCard label="Upcoming" value={items.filter((item) => ["Upcoming", "Scheduled"].includes(item.status)).length} icon={CalendarDays} />
        <MetricCard label="Ongoing" value={items.filter((item) => item.status === "Ongoing").length} icon={Trophy} />
        <MetricCard label="Calendar days" value={items.length * 2} icon={CalendarDays} />
      </div>
      <WorkspaceNotice onClose={() => setNotice("")}>{notice}</WorkspaceNotice>
      <section className="panel workspace-table-panel">
        <FilterToolbar search={search} onSearch={setSearch} placeholder="Search tournaments..." />
        <div className="workspace-card-grid" style={{ padding: 16 }}>
          {filtered.map((item) => <article className="workspace-card" key={item.id}>
            <div className="workspace-card-top"><StatusPill>{item.status}</StatusPill><Trophy size={19} /></div>
            <div><h3>{item.tournamentName}</h3><p>{item.description}</p></div>
            <div className="workspace-card-meta"><span>{item.startDate}</span><span>→</span><span>{item.endDate}</span></div>
            <footer><button className="secondary-button" type="button" onClick={() => setSelected(item)}><Eye size={16} /> Details</button></footer>
          </article>)}
        </div>
      </section>
      <DetailDrawer open={Boolean(selected)} kicker="Tournament detail" title={selected?.tournamentName} subtitle={selected?.description} onClose={() => setSelected(null)}
        footer={<button className="primary-button" type="button" onClick={() => { setNotice("Tournament edit preview saved locally."); setSelected(null); }}>Save preview</button>}>
        {selected && <><StatusPill>{selected.status}</StatusPill><InfoGrid items={[{ label: "Start date", value: selected.startDate }, { label: "End date", value: selected.endDate }, { label: "Prize fund", value: selected.fundsPrize ? `${selected.fundsPrize.toLocaleString()} ₫` : "Not configured" }, { label: "Tournament ID", value: selected.id }]} /></>}
      </DetailDrawer>
    </section>
  );
}
export default TournamentPage;
