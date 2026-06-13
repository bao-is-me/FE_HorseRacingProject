export function statusTone(status) {
  if (["Live", "BettingOpen"].includes(status)) return "info";
  if (["Scheduled", "ResultPending", "Pending"].includes(status)) return "warning";
  if (["Completed", "Finished", "Active"].includes(status)) return "live";
  return "neutral";
}
