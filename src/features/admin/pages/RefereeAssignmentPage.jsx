import React, { useMemo, useState } from "react";
import { Gavel, ShieldCheck, UserCheck } from "lucide-react";
import MetricCard from "../../../components/ui/MetricCard";
import PanelHeader from "../../../components/ui/PanelHeader";
import StatusPill from "../../../components/ui/StatusPill";
import { FilterToolbar, WorkspaceNotice } from "../../../components/ui/WorkspaceUI";
import { demoAccounts } from "../../../mocks/accounts.mock";
import { races } from "../../../mocks/races.mock";

function RefereeAssignmentPage() {
  const referees = demoAccounts.filter((item) => item.role === "Referee");
  const [assignments, setAssignments] = useState(races.map((race) => ({ ...race, refereeId: referees[0]?.id || "" })));
  const [search, setSearch] = useState("");
  const [notice, setNotice] = useState("");
  const filtered = useMemo(() => assignments.filter((race) => `Race ${race.raceNumber} ${race.status}`.toLowerCase().includes(search.toLowerCase())), [assignments, search]);
  const update = (raceId, refereeId) => setAssignments((current) => current.map((item) => item.id === raceId ? { ...item, refereeId } : item));
  return (
    <section className="page-stack workspace-page">
      <PanelHeader kicker="Referee Assignment" title="Race officials workspace" description="Local assignment preview for race coverage and referee workload." />
      <div className="workspace-metric-grid"><MetricCard label="Races" value={assignments.length} icon={Gavel} /><MetricCard label="Assigned" value={assignments.filter((i) => i.refereeId).length} icon={UserCheck} /><MetricCard label="Live coverage" value={assignments.filter((i) => i.status === "Live").length} icon={ShieldCheck} /><MetricCard label="Referees" value={referees.length} icon={UserCheck} /></div>
      <WorkspaceNotice onClose={() => setNotice("")}>{notice}</WorkspaceNotice>
      <section className="panel workspace-table-panel">
        <FilterToolbar search={search} onSearch={setSearch} placeholder="Search races or status..." />
        <div className="workspace-list" style={{ padding: 16 }}>{filtered.map((race) => <article className="workspace-list-item" key={race.id}><div className="workspace-list-icon"><Gavel size={18} /></div><div><h3>Race {race.raceNumber}</h3><p>{race.startTime} · Track length {race.trackLength}m</p></div><div className="workspace-actions"><StatusPill>{race.status}</StatusPill><select value={race.refereeId} onChange={(e) => update(race.id, e.target.value)}>{referees.map((referee) => <option key={referee.id} value={referee.id}>{referee.fullName}</option>)}</select><button className="primary-button" type="button" onClick={() => setNotice(`Race ${race.raceNumber} assignment saved locally.`)}>Assign</button></div></article>)}</div>
      </section>
    </section>
  );
}
export default RefereeAssignmentPage;
