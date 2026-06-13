import React from "react";
import { CalendarDays } from "lucide-react";
import PanelHeader from "../../../components/ui/PanelHeader";
import { racecourses } from "../../../mocks/races.mock";
import { tournaments } from "../../../mocks/tournaments.mock";

function RaceEditor() {
  return (
    <section className="panel">
      <PanelHeader kicker="Admin Action" title="Create / update race" description="Fields map to Races, Tournaments, and Racecourses." compact />
      <div className="form-grid dense">
        <label className="field">
          <span>Tournament</span>
          <select>{tournaments.map((item) => <option key={item.id}>{item.tournamentName}</option>)}</select>
        </label>
        <label className="field">
          <span>Racecourse</span>
          <select>{racecourses.map((item) => <option key={item.id}>{item.racecourseName}</option>)}</select>
        </label>
        <label className="field">
          <span>Race Number</span>
          <input type="number" defaultValue="7" />
        </label>
        <label className="field">
          <span>Max Participants</span>
          <input type="number" defaultValue="10" />
        </label>
        <button className="primary-button" type="button">
          <CalendarDays size={18} />
          Save race
        </button>
      </div>
    </section>
  );
}

export default RaceEditor;
