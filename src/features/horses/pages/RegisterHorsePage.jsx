import React from "react";
import { ClipboardCheck } from "lucide-react";
import PanelHeader from "../../../components/ui/PanelHeader";
import { horses } from "../../../mocks/horses.mock";
import { races } from "../../../mocks/races.mock";

function RegisterHorsePage() {
  return (
    <section className="page-stack">
      <PanelHeader kicker="Register Horse for Race" title="Create race entry" description="Creates a Registrations record with RaceID, HorseID, JockeyID, GateNumber, confirmations, and status." />
      <div className="form-grid">
        <label className="field">
          <span>Race</span>
          <select>{races.map((race) => <option key={race.id}>Race {race.raceNumber} - {race.status}</option>)}</select>
        </label>
        <label className="field">
          <span>Horse</span>
          <select>{horses.map((horse) => <option key={horse.id}>{horse.horseName}</option>)}</select>
        </label>
        <label className="field">
          <span>Gate Number</span>
          <input type="number" defaultValue="3" />
        </label>
        <label className="field">
          <span>Status</span>
          <select>
            <option>Pending</option>
            <option>Confirmed</option>
          </select>
        </label>
        <button className="primary-button" type="button">
          <ClipboardCheck size={18} />
          Register entry
        </button>
      </div>
    </section>
  );
}

export default RegisterHorsePage;
