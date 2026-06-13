import React from "react";
import { AlertTriangle } from "lucide-react";
import DataTable from "../../../components/ui/DataTable";
import PanelHeader from "../../../components/ui/PanelHeader";
import { PENALTY_OPTIONS } from "../../../mocks/referee.mock";
import { getViolationRows } from "../refereeSelectors";

function ViolationsPage({ embedded = false }) {
  const rows = getViolationRows();

  if (embedded) {
    return (
      <section className="panel">
        <PanelHeader kicker="Violation Management" title="Incident queue" description="Mapped to RefereeReports." compact />
        <DataTable rows={rows.slice(0, 2)} />
      </section>
    );
  }

  return (
    <section className="page-stack">
      <PanelHeader kicker="Violation Management" title="Incident queue" description="RaceID, RefereeID, IncidentDescription, PenaltyApplied, and CreatedAt." />
      <DataTable rows={rows} />
      <div className="form-grid dense">
        <label className="field">
          <span>Incident Description</span>
          <input placeholder="Describe violation" />
        </label>
        <label className="field">
          <span>Penalty Applied</span>
          <select>
            {PENALTY_OPTIONS.map((penalty) => <option key={penalty}>{penalty}</option>)}
          </select>
        </label>
        <button className="primary-button" type="button">
          <AlertTriangle size={18} />
          Log incident
        </button>
      </div>
    </section>
  );
}

export default ViolationsPage;
