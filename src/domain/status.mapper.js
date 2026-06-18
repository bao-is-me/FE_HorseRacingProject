export const HORSE_STATUS_VALUES = Object.freeze(["Healthy", "Injury", "Resting", "Retired"]);
export const HORSE_DERIVED_STATUS_VALUES = Object.freeze(["Registered", "Racing"]);
export const RACE_STATUS_VALUES = Object.freeze([
  "Scheduled",
  "BettingOpen",
  "BettingClosed",
  "Live",
  "Completed",
  "Finished",
  "Cancelled"
]);
export const REGISTRATION_STATUS_VALUES = Object.freeze(["Pending", "Confirmed", "Rejected"]);

const ACTIVE_HORSE_STATUSES = new Set(["Healthy", "Resting"]);
const UPCOMING_RACE_STATUSES = new Set(["Scheduled", "BettingOpen", "BettingClosed"]);
const FINISHED_RACE_STATUSES = new Set(["Completed", "Finished"]);

const STATUS_META = Object.freeze({
  Healthy: { label: "Healthy", color: "live" },
  Injury: { label: "Injury", color: "danger" },
  Resting: { label: "Resting", color: "warning" },
  Retired: { label: "Retired", color: "neutral" },
  Registered: { label: "Registered", color: "warning" },
  Racing: { label: "Racing", color: "info" },
  Scheduled: { label: "Scheduled", color: "race-scheduled" },
  BettingOpen: { label: "Betting Open", color: "race-betting-open" },
  BettingClosed: { label: "Betting Closed", color: "race-betting-open" },
  Live: { label: "Live", color: "race-live" },
  Completed: { label: "Completed", color: "race-finished" },
  Finished: { label: "Finished", color: "race-finished" },
  Cancelled: { label: "Cancelled", color: "danger" },
  Pending: { label: "Pending", color: "warning" },
  Confirmed: { label: "Confirmed", color: "live" },
  Rejected: { label: "Rejected", color: "danger" },
  Active: { label: "Active", color: "live" },
  Inactive: { label: "Inactive", color: "neutral" },
  Suspended: { label: "Suspended", color: "danger" },
  Banned: { label: "Banned", color: "danger" },
  Won: { label: "Won", color: "live" },
  Lost: { label: "Lost", color: "danger" },
  Refunded: { label: "Refunded", color: "warning" },
  Paid: { label: "Paid", color: "live" },
  Failed: { label: "Failed", color: "danger" },
  WithdrawPending: { label: "Withdraw Pending", color: "warning" }
});

function normalizeEnumValue(value, allowedValues, fallback = null) {
  if (typeof value !== "string") return fallback;
  const normalized = allowedValues.find(
    (allowedValue) => allowedValue.toLowerCase() === value.trim().toLowerCase()
  );
  return normalized ?? fallback;
}

export function mapHorseStatus(value) {
  return normalizeEnumValue(value, HORSE_STATUS_VALUES);
}

export function mapRaceStatus(value) {
  return normalizeEnumValue(value, RACE_STATUS_VALUES);
}

export function mapRegistrationStatus(value) {
  return normalizeEnumValue(value, REGISTRATION_STATUS_VALUES);
}

export function mapDerivedHorseStatus(value) {
  const derivedStatus = normalizeEnumValue(value, HORSE_DERIVED_STATUS_VALUES);
  return derivedStatus;
}

export function getStatusMeta(value, fallbackColor = "neutral") {
  const meta = STATUS_META[value];
  return {
    value,
    label: meta?.label || String(value ?? "Unknown"),
    color: meta?.color || fallbackColor,
    known: Boolean(meta)
  };
}

export function isHorseEligibleForRace(status) {
  return ACTIVE_HORSE_STATUSES.has(status);
}

export function isRaceLive(status) {
  return status === "Live";
}

export function isRaceFinished(status) {
  return FINISHED_RACE_STATUSES.has(status);
}

export function isRacePending(status) {
  return UPCOMING_RACE_STATUSES.has(status);
}

export function isRaceOpenForRegistration(status) {
  return status === "Scheduled";
}

export function filterRacesByStatuses(races, statuses) {
  if (!statuses?.length) return races;
  const allowed = new Set(statuses);
  return races.filter((race) => allowed.has(race.status));
}

export function deriveHorseStatus({ horseId, registrations = [], races = [] }) {
  const confirmedEntries = registrations.filter(
    (registration) => registration.horseId === horseId && registration.status === "Confirmed"
  );

  if (confirmedEntries.some((registration) => {
    const race = races.find((item) => item.id === registration.raceId);
    return isRaceLive(race?.status);
  })) {
    return "Racing";
  }

  if (confirmedEntries.some((registration) => {
    const race = races.find((item) => item.id === registration.raceId);
    return isRacePending(race?.status);
  })) {
    return "Registered";
  }

  return null;
}
