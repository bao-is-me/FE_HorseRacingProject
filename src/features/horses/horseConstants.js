export const HORSE_STATUSES = ["Healthy", "Injury", "Resting", "Retired"];
export const ACTIVE_HORSE_STATUSES = ["Healthy", "Resting"];

export const RACE_STATUSES = [
  "Scheduled",
  "BettingOpen",
  "BettingClosed",
  "Live",
  "Completed",
  "Finished",
  "Cancelled"
];

export const REGISTRATION_STATUSES = ["Pending", "Confirmed", "Rejected"];

export function isHorseEligibleForRace(status) {
  return ACTIVE_HORSE_STATUSES.includes(status);
}

export function getHorseStatusTone(status) {
  if (status === "Healthy") return "live";
  if (status === "Resting") return "warning";
  if (status === "Injury") return "danger";
  return "neutral";
}

export function getActivityStatusTone(status) {
  if (status === "Racing") return "info";
  if (status === "Registered") return "warning";
  return getHorseStatusTone(status);
}
