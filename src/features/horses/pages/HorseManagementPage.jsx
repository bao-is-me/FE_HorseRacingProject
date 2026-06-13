import React from "react";
import { ShieldCheck } from "lucide-react";
import DataTable from "../../../components/ui/DataTable";
import PanelHeader from "../../../components/ui/PanelHeader";
import { HORSE_STATUS_OPTIONS } from "../../../mocks/horses.mock";
import { getHorseRows } from "../horseSelectors";

function HorseManagementPage({ ownerOnly = false, user, embedded = false }) {
  const rows = getHorseRows({ ownerOnly, user });

  const body = (
    <>
      <DataTable rows={embedded ? rows.slice(0, 3) : rows} />
      {!embedded && (
        <div className="form-grid dense">
          <label className="field">
            <span>Horse Name</span>
            <input placeholder="New horse" />
          </label>
          <label className="field">
            <span>Breed</span>
            <input placeholder="Thoroughbred" />
          </label>
          <label className="field">
            <span>Status</span>
            <select>
              {HORSE_STATUS_OPTIONS.map((status) => <option key={status}>{status}</option>)}
            </select>
          </label>
          <button className="primary-button" type="button">
            <ShieldCheck size={18} />
            Add horse
          </button>
        </div>
      )}
    </>
  );

  if (embedded) {
    return (
      <section className="panel">
        <PanelHeader kicker={ownerOnly ? "My Horse Management" : "Horse Management"} title="Horse roster" description="Horse fields map to Horses table." compact />
        {body}
      </section>
    );
  }

  return (
    <section className="page-stack">
      <PanelHeader
        kicker={ownerOnly ? "My Horse Management" : "Admin Horse Management"}
        title={ownerOnly ? "My stable" : "All registered horses"}
        description="Manage horse name, age, breed, weight, color, record wins, and status."
      />
      {body}
    </section>
  );
}

export default HorseManagementPage;
