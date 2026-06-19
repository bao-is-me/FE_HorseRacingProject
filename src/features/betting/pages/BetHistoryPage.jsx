import React, { useMemo, useState } from "react";
import { CircleDollarSign, History, Trophy } from "lucide-react";
import MetricCard from "../../../components/ui/MetricCard";
import PanelHeader from "../../../components/ui/PanelHeader";
import StatusPill from "../../../components/ui/StatusPill";
import { FilterToolbar } from "../../../components/ui/WorkspaceUI";
import { formatCurrency } from "../../../utils/formatters";
import { getBetHistoryModels } from "../bettingSelectors";

function BetHistoryPage({ user }) {
  const bets = getBetHistoryModels();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const filtered = useMemo(() => bets.filter((bet) => (!search || [bet.id, bet.horseName, bet.betType].some((value) => String(value).toLowerCase().includes(search.toLowerCase()))) && (status === "All" || bet.status === status)), [bets, search, status]);
  return (
    <section className="page-stack workspace-page">
      <PanelHeader kicker="Betting History" title={`${user?.fullName || "Spectator"} bet ledger`} description="Review stake, ratio, potential payout, and ticket settlement status." />
      <div className="workspace-metric-grid"><MetricCard label="Tickets" value={bets.length} icon={History} /><MetricCard label="Total staked" value={formatCurrency(bets.reduce((sum, bet) => sum + bet.betAmount, 0))} icon={CircleDollarSign} /><MetricCard label="Won" value={bets.filter((bet) => bet.status === "Won").length} icon={Trophy} /><MetricCard label="Pending" value={bets.filter((bet) => bet.status === "Pending").length} icon={History} /></div>
      <section className="panel workspace-table-panel">
        <FilterToolbar search={search} onSearch={setSearch} placeholder="Search ticket, horse or bet type..."><select value={status} onChange={(e) => setStatus(e.target.value)}>{["All", ...new Set(bets.map((bet) => bet.status))].map((item) => <option key={item}>{item}</option>)}</select></FilterToolbar>
        <div className="workspace-table"><table><thead><tr><th>Ticket</th><th>Horse</th><th>Type</th><th>Amount</th><th>Ratio</th><th>Potential payout</th><th>Status</th></tr></thead><tbody>{filtered.map((bet) => <tr key={bet.id}><td>{bet.id}</td><td><strong>{bet.horseName}</strong></td><td>{bet.betType}</td><td>{formatCurrency(bet.betAmount)}</td><td><strong>{bet.payoutRatio}x</strong></td><td>{formatCurrency(bet.potentialPayout)}</td><td><StatusPill>{bet.status}</StatusPill></td></tr>)}</tbody></table></div>
      </section>
    </section>
  );
}
export default BetHistoryPage;
