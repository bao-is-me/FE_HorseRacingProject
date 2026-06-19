import React, { useMemo, useState } from "react";
import { Eye, Flag, MapPin, Plus } from "lucide-react";
import MetricCard from "../../../components/ui/MetricCard";
import PanelHeader from "../../../components/ui/PanelHeader";
import { DetailDrawer, FilterToolbar, InfoGrid, WorkspaceNotice } from "../../../components/ui/WorkspaceUI";
import { racecourses as seed } from "../../../mocks/races.mock";

function RacecoursePage() {
  const [items, setItems] = useState(seed);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("All");
  const [selected, setSelected] = useState(null);
  const [notice, setNotice] = useState("");
  const filtered = useMemo(() => items.filter((item) => (!search || [item.racecourseName, item.location].some((value) => value.toLowerCase().includes(search.toLowerCase()))) && (type === "All" || item.trackType === type)), [items, search, type]);
  const addDemo = () => { setItems((current) => [...current, { id: `rc-${Date.now()}`, racecourseName: "New Demo Track", location: "Vietnam", trackType: "Turf" }]); setNotice("Demo racecourse added locally."); };
  return (
    <section className="page-stack workspace-page">
      <div className="workspace-header-row"><PanelHeader kicker="Racecourse Management" title="Track directory" description="Manage venue identity, location, and racing surface." /><button className="primary-button" type="button" onClick={addDemo}><Plus size={17} /> Add racecourse</button></div>
      <div className="workspace-metric-grid">
        <MetricCard label="Venues" value={items.length} icon={MapPin} /><MetricCard label="Turf" value={items.filter((i) => i.trackType === "Turf").length} icon={Flag} /><MetricCard label="Dirt" value={items.filter((i) => i.trackType === "Dirt").length} icon={Flag} /><MetricCard label="Synthetic" value={items.filter((i) => i.trackType === "Synthetic").length} icon={Flag} />
      </div>
      <WorkspaceNotice onClose={() => setNotice("")}>{notice}</WorkspaceNotice>
      <section className="panel workspace-table-panel">
        <FilterToolbar search={search} onSearch={setSearch} placeholder="Search venue or location..."><select value={type} onChange={(e) => setType(e.target.value)}>{["All", ...new Set(items.map((i) => i.trackType))].map((i) => <option key={i}>{i}</option>)}</select></FilterToolbar>
        <div className="workspace-card-grid" style={{ padding: 16 }}>{filtered.map((item) => <article className="workspace-card" key={item.id}><div className="workspace-card-top"><div className="workspace-list-icon"><MapPin size={18} /></div><strong>{item.trackType}</strong></div><div><h3>{item.racecourseName}</h3><p>{item.location}</p></div><footer><button className="secondary-button" type="button" onClick={() => setSelected(item)}><Eye size={16} /> View track</button></footer></article>)}</div>
      </section>
      <DetailDrawer open={Boolean(selected)} kicker="Racecourse detail" title={selected?.racecourseName} subtitle={selected?.location} onClose={() => setSelected(null)} footer={<button className="primary-button" type="button" onClick={() => { setNotice("Racecourse edit preview saved locally."); setSelected(null); }}>Save preview</button>}>
        {selected && <InfoGrid items={[{ label: "Track type", value: selected.trackType }, { label: "Location", value: selected.location }, { label: "Racecourse ID", value: selected.id }]} />}
      </DetailDrawer>
    </section>
  );
}
export default RacecoursePage;
