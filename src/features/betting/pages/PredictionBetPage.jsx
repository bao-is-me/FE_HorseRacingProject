import React from "react";
import { CircleDollarSign } from "lucide-react";
import DataTable from "../../../components/ui/DataTable";
import PanelHeader from "../../../components/ui/PanelHeader";
import { BET_TYPES } from "../../../mocks/betting.mock";
import { getPredictionRows } from "../bettingSelectors";

function PredictionBetPage({ compact = false, admin = false }) {
  const rows = getPredictionRows(admin);

  return (
    <section className="panel">
      <PanelHeader
        kicker={admin ? "Prediction / Bet Management" : "Prediction / Bet Slip"}
        title={compact ? "Top entries" : "Race entries and odds"}
        description="Uses Registrations, Horses, JockeyProfile, UserProfiles, Bets, and UserProfiles.Balance."
        compact
      />
      <DataTable rows={compact ? rows.slice(0, 3) : rows} />
      {!admin && !compact && (
        <div className="form-grid dense">
          <label className="field">
            <span>Horse / Jockey Entry</span>
            <select>{rows.map((row) => <option key={`${row.Race}-${row.Horse}`}>{row.Horse} - {row.Jockey}</option>)}</select>
          </label>
          <label className="field">
            <span>Bet Type</span>
            <select>
              {BET_TYPES.map((type) => <option key={type}>{type}</option>)}
            </select>
          </label>
          <label className="field">
            <span>Bet Amount</span>
            <input defaultValue="200000" />
          </label>
          <button className="primary-button" type="button">
            <CircleDollarSign size={18} />
            Lock bet slip
          </button>
        </div>
      )}
    </section>
  );
}

export default PredictionBetPage;
