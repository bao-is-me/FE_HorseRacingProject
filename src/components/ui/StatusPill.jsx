import React from "react";

const raceStatusClass = {
  Live: "race-live",
  BettingOpen: "race-betting-open",
  BettingClosed: "race-betting-open",
  Scheduled: "race-scheduled",
  Finished: "race-finished",
  Completed: "race-finished",
  Cancelled: "danger"
};

function StatusPill({ tone = "neutral", children }) {
  const statusKey = typeof children === "string" ? children : "";
  const resolvedTone = raceStatusClass[statusKey] || tone;

  return <span className={`status-pill ${resolvedTone}`}>{children}</span>;
}

export default StatusPill;
