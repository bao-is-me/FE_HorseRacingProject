import React, { useMemo, useState } from "react";
import { CircleDollarSign, Target, TicketCheck } from "lucide-react";
import MetricCard from "../../../components/ui/MetricCard";
import PanelHeader from "../../../components/ui/PanelHeader";
import StatusPill from "../../../components/ui/StatusPill";
import { WorkspaceNotice } from "../../../components/ui/WorkspaceUI";
import { calculatePayout } from "../../../domain";
import { BET_TYPES, bets } from "../../../mocks/betting.mock";
import { formatCurrency } from "../../../utils/formatters";
import { getPredictionRows } from "../bettingSelectors";

function PredictionBetPage({ compact = false, admin = false }) {
  const rows = getPredictionRows(admin);
  const [entryIndex, setEntryIndex] = useState("0");
  const [betType, setBetType] = useState("Win");
  const [amount, setAmount] = useState("200000");
  const [notice, setNotice] = useState("");
  const ratioByType = useMemo(() => Object.fromEntries(bets.map((bet) => [bet.betType, bet.payoutRatio])), []);
  const ratio = ratioByType[betType] || 1;
  const potential = calculatePayout(amount || 0, ratio);
  if (compact) return <section className="panel"><PanelHeader kicker="Prediction / Bet Slip" title="Top entries" description="Confirmed entries available for demo betting." compact /><div className="workspace-card-grid">{rows.slice(0, 3).map((row) => <article className="workspace-card" key={`${row.Race}-${row.Horse}`}><div className="workspace-card-top"><Target size={18} /><StatusPill>{row.Status}</StatusPill></div><h3>{row.Horse}</h3><p>{row.Race} · {row.Jockey}</p></article>)}</div></section>;
  if (admin) return <section className="page-stack workspace-page"><PanelHeader kicker="Prediction / Bet Management" title="Betting activity overview" description="Read-only demo view of confirmed entries and betting readiness." /><div className="workspace-metric-grid"><MetricCard label="Entries" value={rows.length} icon={Target} /><MetricCard label="Pending tickets" value={bets.filter((b) => b.status === "Pending").length} icon={TicketCheck} /><MetricCard label="Total staked" value={formatCurrency(bets.reduce((s, b) => s + b.betAmount, 0))} icon={CircleDollarSign} /><MetricCard label="Bet types" value={BET_TYPES.length} icon={Target} /></div><div className="workspace-card-grid">{rows.map((row) => <article className="workspace-card" key={`${row.Race}-${row.Horse}`}><div className="workspace-card-top"><StatusPill>{row.Status}</StatusPill><strong>{row.Race}</strong></div><h3>{row.Horse}</h3><p>{row.Jockey}</p></article>)}</div></section>;
  const submit = () => setNotice(`Demo bet locked: ${rows[Number(entryIndex)]?.Horse}, ${betType}, ${formatCurrency(Number(amount))}.`);
  return <section className="page-stack workspace-page"><PanelHeader kicker="Prediction / Bet Slip" title="Build your race ticket" description="Select a confirmed entry, bet type, and stake. No real wallet transaction is performed." /><div className="workspace-metric-grid"><MetricCard label="Available entries" value={rows.length} icon={Target} /><MetricCard label="Selected ratio" value={`${ratio}x`} icon={CircleDollarSign} /><MetricCard label="Stake" value={formatCurrency(Number(amount))} icon={TicketCheck} /><MetricCard label="Potential payout" value={formatCurrency(potential)} icon={TrophyIcon} /></div><WorkspaceNotice onClose={() => setNotice("")}>{notice}</WorkspaceNotice><div className="horse-register-layout"><section className="panel workspace-form"><PanelHeader kicker="Demo bet form" title="Ticket details" compact /><div className="workspace-form-grid"><label className="field span-all"><span>Horse / Jockey Entry</span><select value={entryIndex} onChange={(e) => setEntryIndex(e.target.value)}>{rows.map((row, index) => <option key={`${row.Race}-${row.Horse}`} value={index}>{row.Horse} · {row.Jockey} · {row.Race}</option>)}</select></label><label className="field"><span>Bet Type</span><select value={betType} onChange={(e) => setBetType(e.target.value)}>{BET_TYPES.map((type) => <option key={type}>{type}</option>)}</select></label><label className="field"><span>Bet Amount</span><input type="number" min="1" value={amount} onChange={(e) => setAmount(e.target.value)} /></label></div><button className="primary-button fit" type="button" onClick={submit}><CircleDollarSign size={18} /> Lock bet slip</button></section><aside className="panel workspace-form-section"><PanelHeader kicker="Payout preview" title={`${ratio}x ratio`} description="Calculated in the Bet domain only." compact /><div className="workspace-kpi"><span>Potential payout</span><strong>{formatCurrency(potential)}</strong></div><p>Stake × payoutRatio. Final settlement remains a backend responsibility.</p></aside></div></section>;
}
function TrophyIcon(props) { return <TicketCheck {...props} />; }
export default PredictionBetPage;
