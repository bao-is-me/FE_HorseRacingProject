import React, { useMemo, useState } from "react";
import { Eye, ShieldCheck, UserCheck, Users } from "lucide-react";
import MetricCard from "../../../components/ui/MetricCard";
import PanelHeader from "../../../components/ui/PanelHeader";
import StatusPill from "../../../components/ui/StatusPill";
import { DetailDrawer, FilterToolbar, InfoGrid, WorkspaceNotice } from "../../../components/ui/WorkspaceUI";
import { demoAccounts } from "../../../mocks/accounts.mock";
import { roles } from "../../../mocks/roles.mock";
import { formatCurrency } from "../../../utils/formatters";

function UserManagementPage({ embedded = false }) {
  const [accounts, setAccounts] = useState(demoAccounts);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [selected, setSelected] = useState(null);
  const [notice, setNotice] = useState("");
  const filtered = useMemo(() => accounts.filter((account) => {
    const term = search.toLowerCase();
    return (!term || [account.fullName, account.email, account.role].some((value) => value.toLowerCase().includes(term)))
      && (status === "All" || account.status === status);
  }), [accounts, search, status]);

  const toggleAccount = (account) => {
    const nextStatus = account.status === "Active" ? "Suspended" : "Active";
    setAccounts((current) => current.map((item) => item.id === account.id ? { ...item, status: nextStatus } : item));
    setSelected((current) => current?.id === account.id ? { ...current, status: nextStatus } : current);
    setNotice(`${account.fullName} is now ${nextStatus} in demo state.`);
  };

  if (embedded) {
    return (
      <section className="panel">
        <PanelHeader kicker="User Management" title="Recent accounts" description="Account and profile summary." compact />
        <div className="workspace-list">
          {accounts.slice(0, 4).map((account) => (
            <article className="workspace-list-item" key={account.id}>
              <div className="workspace-list-icon"><Users size={18} /></div>
              <div><h3>{account.fullName}</h3><p>{roles[account.role]} · {account.email}</p></div>
              <StatusPill>{account.status}</StatusPill>
            </article>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="page-stack workspace-page">
      <PanelHeader kicker="User Management" title="Tournament personnel" description="Review accounts, roles, profile details, and local status actions." />
      <div className="workspace-metric-grid">
        <MetricCard label="Total accounts" value={accounts.length} icon={Users} />
        <MetricCard label="Active" value={accounts.filter((item) => item.status === "Active").length} icon={UserCheck} />
        <MetricCard label="Pending" value={accounts.filter((item) => item.status === "Pending").length} icon={ShieldCheck} />
        <MetricCard label="Operational roles" value={accounts.filter((item) => item.role !== "Spectator").length} icon={Users} />
      </div>
      <WorkspaceNotice onClose={() => setNotice("")}>{notice}</WorkspaceNotice>
      <section className="panel workspace-table-panel">
        <FilterToolbar search={search} onSearch={setSearch} placeholder="Search name, email or role...">
          <select value={status} onChange={(event) => setStatus(event.target.value)}>
            {["All", "Active", "Pending", "Suspended", "Banned"].map((item) => <option key={item}>{item}</option>)}
          </select>
        </FilterToolbar>
        <div className="workspace-table">
          <table>
            <thead><tr><th>User</th><th>Role</th><th>Phone</th><th>Balance</th><th>Status</th><th /></tr></thead>
            <tbody>{filtered.map((account) => (
              <tr key={account.id}>
                <td><strong>{account.fullName}</strong><br /><small>{account.email}</small></td>
                <td>{roles[account.role]}</td><td>{account.phone}</td><td>{formatCurrency(account.balance)}</td>
                <td><StatusPill>{account.status}</StatusPill></td>
                <td><div className="workspace-row-actions"><button type="button" onClick={() => setSelected(account)} aria-label={`View ${account.fullName}`}><Eye size={16} /></button></div></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </section>
      <DetailDrawer open={Boolean(selected)} kicker="Account detail" title={selected?.fullName} subtitle={selected?.email} onClose={() => setSelected(null)}
        footer={<><button className="secondary-button" type="button" onClick={() => setSelected(null)}>Close</button><button className="primary-button" type="button" onClick={() => toggleAccount(selected)}>{selected?.status === "Active" ? "Suspend" : "Activate"}</button></>}>
        {selected && <><StatusPill>{selected.status}</StatusPill><InfoGrid items={[
          { label: "Account ID", value: selected.id }, { label: "Role", value: roles[selected.role] },
          { label: "Phone", value: selected.phone }, { label: "Balance", value: formatCurrency(selected.balance) }
        ]} /></>}
      </DetailDrawer>
    </section>
  );
}

export default UserManagementPage;
