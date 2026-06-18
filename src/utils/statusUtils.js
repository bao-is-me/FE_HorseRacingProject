export function statusTone(status) {
  if (status === "Live") return "race-live";
  if (status === "BettingOpen") return "race-betting-open";
  if (status === "BettingClosed") return "race-betting-open";
  if (status === "Scheduled") return "race-scheduled";
  if (["Finished", "Completed"].includes(status)) return "race-finished";
  if (status === "Cancelled") return "danger";
  if (["Racing"].includes(status)) return "info";
  if (["Pending"].includes(status)) return "warning";
  if (["Active"].includes(status)) return "live";
  return "neutral";
}
