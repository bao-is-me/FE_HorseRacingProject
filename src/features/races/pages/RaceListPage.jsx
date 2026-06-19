import React, { useMemo, useState } from "react";
import { CalendarDays, Eye, Flag } from "lucide-react";
import DataTable from "../../../components/ui/DataTable";
import MetricCard from "../../../components/ui/MetricCard";
import PanelHeader from "../../../components/ui/PanelHeader";
import StatusPill from "../../../components/ui/StatusPill";
import { DetailDrawer, FilterToolbar, InfoGrid } from "../../../components/ui/WorkspaceUI";
import { formatDateTime } from "../../../utils/formatters";
import { getRaceCardModels, getRaceRows } from "../raceSelectors";
import RaceEditor from "./RaceEditor";

function RaceListPage({ publicView = false, role = "Guest", compact = false }) {
  const races = getRaceCardModels();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [selected, setSelected] = useState(null);
  const filtered = useMemo(() => races.filter((race) => (!search || [race.raceNumber, race.racecourseName, race.tournament?.name].some((value) => String(value).toLowerCase().includes(search.toLowerCase()))) && (status === "All" || race.status === status)), [races, search, status]);
  if (compact) {
    return <section className="page-stack"><PanelHeader kicker="Race Schedule" title="Race List" description="Race, tournament, racecourse, start time, participant threshold, and current race status." /><DataTable rows={getRaceRows()} /></section>;
  }
  return <section className="page-stack workspace-page"><PanelHeader kicker={publicView ? "Public Race" : role === "Admin" ? "Race Management" : "Race Schedule"} title={publicView ? "Public race directory" : "Race operations"} description="Browse race timing, tournament, venue, participants, grade, and lifecycle status." /><div className="workspace-metric-grid"><MetricCard label="Races" value={races.length} icon={CalendarDays} /><MetricCard label="Live" value={races.filter((r) => r.status === "Live").length} icon={Flag} /><MetricCard label="Upcoming" value={races.filter((r) => ["Scheduled", "BettingOpen", "BettingClosed"].includes(r.status)).length} icon={CalendarDays} /><MetricCard label="Entries" value={races.reduce((sum, r) => sum + r.entries.length, 0)} icon={Flag} /></div><section className="panel workspace-table-panel"><FilterToolbar search={search} onSearch={setSearch} placeholder="Search race, tournament or track..."><select value={status} onChange={(e) => setStatus(e.target.value)}>{["All", ...new Set(races.map((r) => r.status))].map((item) => <option key={item}>{item}</option>)}</select></FilterToolbar><div className="workspace-card-grid" style={{ padding: 16 }}>{filtered.map((race) => <article className="workspace-card" key={race.id}><div className="workspace-card-top"><StatusPill>{race.status}</StatusPill><strong>Race {race.raceNumber}</strong></div><div><h3>{race.tournament?.name}</h3><p>{race.racecourseName} · {race.location}</p></div><div className="workspace-card-meta"><span>{formatDateTime(race.startTime)}</span><span>{race.entries.length}/{race.maxParticipants} entries</span><span>{race.trackLength}m</span></div><footer><button className="secondary-button" type="button" onClick={() => setSelected(race)}><Eye size={16} /> Race details</button></footer></article>)}</div></section>{!publicView && role === "Admin" && <RaceEditor />}<DetailDrawer open={Boolean(selected)} kicker="Race detail" title={`Race ${selected?.raceNumber}`} subtitle={`${selected?.tournament?.name || "Tournament"} · ${selected?.racecourseName}`} onClose={() => setSelected(null)}>{selected && <><StatusPill>{selected.status}</StatusPill><InfoGrid items={[{ label: "Start time", value: formatDateTime(selected.startTime) }, { label: "Track length", value: `${selected.trackLength}m` }, { label: "Participants", value: `${selected.entries.length}/${selected.maxParticipants}` }, { label: "Grade", value: selected.grade || "Open" }, { label: "Location", value: selected.location }, { label: "Race ID", value: selected.id }]} /></>}</DetailDrawer></section>;
}
export default RaceListPage;
