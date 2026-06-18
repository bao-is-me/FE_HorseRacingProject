import React from "react";
import PanelHeader from "../../../components/ui/PanelHeader";
import StatusPill from "../../../components/ui/StatusPill";
import { formatDateTime } from "../../../utils/formatters";
import { getRaceCardModels } from "../raceSelectors";

function RaceCards() {
  const races = getRaceCardModels();

  return (
    <section className="panel">
      <PanelHeader kicker="Race Schedule" title="Open and live races" description="Public race detail, racecourse, entries, and status." compact />
      <div className="race-card-grid">
        {races.map((race) => (
            <article className="race-card" key={race.id}>
              <div className="race-card-top">
                <StatusPill>{race.status}</StatusPill>
                <strong>Race {race.raceNumber}</strong>
              </div>
              <h3>{race.tournament?.name}</h3>
              <p>{race.racecourseName} - {race.trackType}</p>
              <div className="race-track">
                {race.entries.map((entry, index) => (
                  <span key={entry.id} style={{ left: `${18 + index * 22}%` }} title={entry.horse?.name} />
                ))}
              </div>
              <div className="mini-row">
                <span>{formatDateTime(race.startTime)}</span>
                <span>{race.entries.length}/{race.maxParticipants} entries</span>
              </div>
            </article>
          ))}
      </div>
    </section>
  );
}

export default RaceCards;
