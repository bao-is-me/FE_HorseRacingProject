import React from "react";
import PanelHeader from "../../../components/ui/PanelHeader";
import StatusPill from "../../../components/ui/StatusPill";
import { races } from "../../../mocks/races.mock";
import { formatDateTime } from "../../../utils/formatters";
import { statusTone } from "../../../utils/statusUtils";
import { getRaceViewModel } from "../raceSelectors";

function RaceCards() {
  return (
    <section className="panel">
      <PanelHeader kicker="Race Schedule" title="Open and live races" description="Public race detail, racecourse, entries, and status." compact />
      <div className="race-card-grid">
        {races.map((race) => {
          const view = getRaceViewModel(race);
          return (
            <article className="race-card" key={race.id}>
              <div className="race-card-top">
                <StatusPill tone={statusTone(race.status)}>{race.status}</StatusPill>
                <strong>Race {race.raceNumber}</strong>
              </div>
              <h3>{view.tournament?.tournamentName}</h3>
              <p>{view.racecourse?.racecourseName} - {view.racecourse?.trackType}</p>
              <div className="race-track">
                {view.entries.map((entry, index) => (
                  <span key={entry.id} style={{ left: `${18 + index * 22}%` }} title={entry.horse?.horseName} />
                ))}
              </div>
              <div className="mini-row">
                <span>{formatDateTime(race.startTime)}</span>
                <span>{view.entries.length}/{race.maxParticipants} entries</span>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default RaceCards;
