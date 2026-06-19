import React, { useMemo, useState } from "react";
import { Check, Clock3, UserCheck, X } from "lucide-react";
import MetricCard from "../../../components/ui/MetricCard";
import PanelHeader from "../../../components/ui/PanelHeader";
import StatusPill from "../../../components/ui/StatusPill";
import { EmptyPanel, FilterToolbar, WorkspaceNotice } from "../../../components/ui/WorkspaceUI";
import { demoAccounts } from "../../../mocks/accounts.mock";
import { roles } from "../../../mocks/roles.mock";

function AccountApprovalPage() {
  const [requests, setRequests] = useState(demoAccounts.filter((account) => account.status === "Pending"));
  const [search, setSearch] = useState("");
  const [notice, setNotice] = useState("");
  const filtered = useMemo(() => requests.filter((account) => [account.fullName, account.email, account.role]
    .some((value) => value.toLowerCase().includes(search.toLowerCase()))), [requests, search]);
  const resolve = (account, decision) => {
    setRequests((current) => current.filter((item) => item.id !== account.id));
    setNotice(`${account.fullName} was ${decision} in demo state.`);
  };
  return (
    <section className="page-stack workspace-page">
      <PanelHeader kicker="Account Approval" title="Pending registration requests" description="Review operational role requests before granting system access." />
      <div className="workspace-metric-grid">
        <MetricCard label="Pending review" value={requests.length} icon={Clock3} />
        <MetricCard label="Owner requests" value={requests.filter((item) => item.role === "HorseOwner").length} icon={UserCheck} />
        <MetricCard label="Jockey requests" value={requests.filter((item) => item.role === "Jockey").length} icon={UserCheck} />
        <MetricCard label="Referee requests" value={requests.filter((item) => item.role === "Referee").length} icon={UserCheck} />
      </div>
      <WorkspaceNotice onClose={() => setNotice("")}>{notice}</WorkspaceNotice>
      <section className="panel workspace-table-panel">
        <FilterToolbar search={search} onSearch={setSearch} placeholder="Search pending requests..." />
        {filtered.length ? <div className="workspace-list" style={{ padding: 16 }}>
          {filtered.map((account) => (
            <article className="workspace-list-item" key={account.id}>
              <div className="workspace-list-icon"><UserCheck size={19} /></div>
              <div><h3>{account.fullName}</h3><p>{account.email} · {roles[account.role]} · {account.phone}</p></div>
              <div className="workspace-actions">
                <StatusPill>Pending</StatusPill>
                <button className="secondary-button" type="button" onClick={() => resolve(account, "rejected")}><X size={16} /> Reject</button>
                <button className="primary-button" type="button" onClick={() => resolve(account, "approved")}><Check size={16} /> Approve</button>
              </div>
            </article>
          ))}
        </div> : <div style={{ padding: 16 }}><EmptyPanel title="Approval queue is clear" description="No pending role requests match the current search." /></div>}
      </section>
    </section>
  );
}
export default AccountApprovalPage;
