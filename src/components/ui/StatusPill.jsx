import React from "react";

const raceStatusClass = {
  Live: "race-live",
  BettingOpen: "race-betting-open",
  Scheduled: "race-scheduled",
  ResultPending: "race-result-pending",
  Finished: "race-finished",
  Completed: "race-finished"
};

function StatusPill({ tone = "neutral", children }) {
  const statusKey = typeof children === "string" ? children : "";
  const resolvedTone = raceStatusClass[statusKey] || tone;

  return <span className={`status-pill ${resolvedTone}`}>{children}</span>;
}

export default StatusPill;
