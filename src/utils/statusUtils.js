export function statusTone(status) {
  if (status === "Live") return "race-live";
  if (status === "BettingOpen") return "race-betting-open";
  if (status === "Scheduled") return "race-scheduled";
  if (status === "ResultPending") return "race-result-pending";
  if (["Finished", "Completed"].includes(status)) return "race-finished";
  if (["Racing"].includes(status)) return "info";
  if (["Pending"].includes(status)) return "warning";
  if (["Active"].includes(status)) return "live";
  return "neutral";
}
