import React from "react";
import { CircleDollarSign, Wallet } from "lucide-react";
import DataTable from "../../../components/ui/DataTable";
import MetricCard from "../../../components/ui/MetricCard";
import PanelHeader from "../../../components/ui/PanelHeader";
import { DEFAULT_BALANCE } from "../../../mocks/betting.mock";
import { formatCurrency } from "../../../utils/formatters";
import { getPaymentRows } from "../bettingSelectors";

function WalletPage({ user }) {
  const rows = getPaymentRows();
  return (
    <section className="page-stack">
      <PanelHeader kicker="Wallet / Deposit" title="Point balance and deposits" description="Maps to UserProfiles.Balance, Payment, and ConversionRate." />
      <div className="metric-grid two">
        <MetricCard label="Current Balance" value={formatCurrency(user?.balance || DEFAULT_BALANCE)} icon={Wallet} />
        <MetricCard label="Conversion Rate" value="1 point = 1,000 VND" icon={CircleDollarSign} />
      </div>
      <DataTable rows={rows} />
      <div className="form-grid dense">
        <label className="field">
          <span>Deposit amount</span>
          <input defaultValue="500000" />
        </label>
        <button className="primary-button" type="button">
          <Wallet size={18} />
          Deposit points
        </button>
      </div>
    </section>
  );
}

export default WalletPage;
