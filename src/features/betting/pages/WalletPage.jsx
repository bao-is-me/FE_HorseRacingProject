import React, { useState } from "react";
import { ArrowDownCircle, ArrowUpCircle, CircleDollarSign, Wallet } from "lucide-react";
import MetricCard from "../../../components/ui/MetricCard";
import PanelHeader from "../../../components/ui/PanelHeader";
import StatusPill from "../../../components/ui/StatusPill";
import { WorkspaceNotice } from "../../../components/ui/WorkspaceUI";
import { DEFAULT_BALANCE, payments as seed } from "../../../mocks/betting.mock";
import { formatCurrency, formatDateTime } from "../../../utils/formatters";

function WalletPage({ user }) {
  const [balance, setBalance] = useState(user?.balance || DEFAULT_BALANCE);
  const [payments, setPayments] = useState(seed);
  const [amount, setAmount] = useState("500000");
  const [notice, setNotice] = useState("");
  const transact = (type) => {
    const value = Number(amount);
    if (!value || value < 1) return setNotice("Enter a valid amount.");
    if (type === "Withdraw" && value > balance) return setNotice("Insufficient demo balance.");
    setBalance((current) => current + (type === "Deposit" ? value : -value));
    setPayments((current) => [{ id: `pay-${Date.now()}`, accountId: user?.id, amount: value, status: "Completed", createAt: new Date().toISOString(), type }, ...current]);
    setNotice(`${type} completed in local demo state.`);
  };
  return <section className="page-stack workspace-page"><PanelHeader kicker="Wallet / Deposit" title="Point balance and transactions" description="Local wallet preview with deposit and withdrawal demo actions." /><div className="workspace-metric-grid"><MetricCard label="Current Balance" value={formatCurrency(balance)} icon={Wallet} /><MetricCard label="Completed" value={payments.filter((p) => p.status === "Completed").length} icon={ArrowDownCircle} /><MetricCard label="Pending" value={payments.filter((p) => p.status === "Pending").length} icon={CircleDollarSign} /><MetricCard label="Conversion Rate" value="1 : 1,000" icon={ArrowUpCircle} /></div><WorkspaceNotice tone={notice.includes("valid") || notice.includes("Insufficient") ? "warning" : "success"} onClose={() => setNotice("")}>{notice}</WorkspaceNotice><div className="horse-register-layout"><section className="panel workspace-table-panel"><PanelHeader kicker="Transaction history" title="Recent wallet activity" compact /><div className="workspace-list" style={{ marginTop: 16 }}>{payments.map((payment) => <article className="workspace-list-item" key={payment.id}><div className="workspace-list-icon">{payment.type === "Withdraw" ? <ArrowUpCircle size={18} /> : <ArrowDownCircle size={18} />}</div><div><h3>{payment.type || "Deposit"} · {formatCurrency(payment.amount)}</h3><p>{formatDateTime(payment.createAt)} · {payment.id}</p></div><StatusPill>{payment.status}</StatusPill></article>)}</div></section><aside className="panel workspace-form"><PanelHeader kicker="Demo wallet action" title="Move funds" description="No payment gateway or API call is made." compact /><label className="field"><span>Amount</span><input type="number" min="1" value={amount} onChange={(e) => setAmount(e.target.value)} /></label><div className="workspace-actions"><button className="primary-button" type="button" onClick={() => transact("Deposit")}><ArrowDownCircle size={17} /> Deposit</button><button className="secondary-button" type="button" onClick={() => transact("Withdraw")}><ArrowUpCircle size={17} /> Withdraw</button></div></aside></div></section>;
}
export default WalletPage;
