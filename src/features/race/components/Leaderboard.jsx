import React from "react";

const START_ANGLE = Math.PI;
const TOTAL_LAPS = 2;

function progressFromAngle(angle = START_ANGLE) {
  return Math.min(Math.max((angle - START_ANGLE) / (TOTAL_LAPS * Math.PI * 2), 0), 1);
}

function PositionBadge({ position }) {
  return <span className={`race-position-badge pos-${position}`}>{position}</span>;
}

function paceLabel(speed = 0) {
  if (speed >= 0.4) return "Fast";
  if (speed >= 0.32) return "Avg";
  return "Steady";
}

function Leaderboard({ horses, liveStates = {}, results = [], finished = false }) {
  if (finished && results.length) {
    return (
      <div className="race-leaderboard">
        <div className="race-leaderboard-head">
          <span>Pos</span>
          <span>Horse</span>
          <span>Breed</span>
          <span>Age</span>
        </div>
        {results.map((result) => (
          <div className="race-leaderboard-row" key={`${result.horse.id}-${result.position}`}>
            <PositionBadge position={result.position} />
            <strong>{result.horse.horseName}</strong>
            <span>{result.horse.breed}</span>
            <span>{result.horse.age}y</span>
          </div>
        ))}
      </div>
    );
  }

  const sorted = [...horses].sort((a, b) => {
    const aProgress = progressFromAngle(liveStates[a.id]?.angle);
    const bProgress = progressFromAngle(liveStates[b.id]?.angle);
    return bProgress - aProgress;
  });
  const leaderProgress = progressFromAngle(liveStates[sorted[0]?.id]?.angle);

  return (
    <div className="race-leaderboard">
      <div className="race-leaderboard-head">
        <span>Pos</span>
        <span>Horse</span>
        <span>Lap</span>
        <span>Pace</span>
        <span>Gap</span>
      </div>
      {sorted.map((horse, index) => {
        const state = liveStates[horse.id];
        const progress = progressFromAngle(state?.angle);
        const lap = Math.min(Math.floor(((state?.angle ?? START_ANGLE) - START_ANGLE) / (Math.PI * 2)) + 1, TOTAL_LAPS);
        const gap = index === 0 ? "Leader" : `+${Math.round((leaderProgress - progress) * 2400)}m`;

        return (
          <div className="race-leaderboard-row" key={horse.id}>
            <PositionBadge position={index + 1} />
            <span className="race-horse-cell">
              <i style={{ background: horse.coatColor }} />
              <span>
                <strong>{horse.name}</strong>
                <small>{horse.jockeyName}</small>
              </span>
            </span>
            <span>{lap}/{TOTAL_LAPS}</span>
            <span className="race-pace-chip">{paceLabel(state?.speed ?? horse.baseSpeed)}</span>
            <span>{gap}</span>
          </div>
        );
      })}
    </div>
  );
}

export default Leaderboard;
