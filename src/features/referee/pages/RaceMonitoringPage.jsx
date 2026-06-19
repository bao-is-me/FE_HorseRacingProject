import React, { useState } from "react";
import { Activity, Gauge, Radio } from "lucide-react";
import PanelHeader from "../../../components/ui/PanelHeader";
import StatusPill from "../../../components/ui/StatusPill";
import { getLiveRaceRows } from "../refereeSelectors";

function RaceMonitoringPage({ embedded = false }) {
  const rows = getLiveRaceRows();
  const [selected, setSelected] = useState(rows[0] || null);
  const content = <div className="horse-register-layout"><div className="workspace-list">{rows.map((row) => <button className="race-analysis-card" type="button" key={row.Race} onClick={() => setSelected(row)}><div><strong>{row.Race}</strong><StatusPill>{row.Status}</StatusPill></div><span>{row.Racecourse}</span><small>{row.Entries} entries · {row["Track Length"]}</small></button>)}</div><div className="workspace-form-section"><div className="workspace-card-top"><div><span className="horse-preview-kicker">Live track</span><h3>{selected?.Race || "Select a race"}</h3></div><Radio size={20} /></div><p>{selected?.Racecourse} · {selected?.["Start Time"]}</p><div className="track-monitor"><div><span>START</span><span>1/4 M</span><span>1/2 M</span><span>3/4 M</span><span>FINISH</span></div><div className="race-track large"><span style={{ left: "35%" }} /><span style={{ left: "54%" }} /><span style={{ left: "68%" }} /></div></div><div className="workspace-inline"><Gauge size={16} /><span>Demo positions update visually only.</span></div></div></div>;
  if (embedded) return <section className="panel"><PanelHeader kicker="Race Monitoring" title="Live operations" description="Referee view of active races." compact />{content}</section>;
  return <section className="page-stack workspace-page"><PanelHeader kicker="Race Monitoring" title="Live operations center" description="Select a race to monitor status, entries, track position, and timing context." /><div className="workspace-kpi"><span><Activity size={18} /> Active monitored races</span><strong>{rows.length}</strong></div><section className="panel">{content}</section></section>;
}
export default RaceMonitoringPage;
