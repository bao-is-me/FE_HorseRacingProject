import { mapRegistrationStatus } from "./status.mapper";

function valueOf(source, ...keys) {
  for (const key of keys) {
    if (source?.[key] !== undefined) return source[key];
  }
  return null;
}

export function mapRegistration(source = {}) {
  const nestedHorse = valueOf(source, "horse", "Horse");
  const nestedRace = valueOf(source, "race", "Race");

  return {
    id: valueOf(source, "id", "registrationId", "RegistrationId"),
    horseId: valueOf(source, "horseId", "HorseId") || valueOf(nestedHorse, "id", "Id"),
    jockeyId: valueOf(source, "jockeyId", "JockeyId"),
    raceId: valueOf(source, "raceId", "RaceId") || valueOf(nestedRace, "id", "raceId", "RaceId"),
    gateNumber: valueOf(source, "gateNumber", "GateNumber"),
    ownerConfirmation: valueOf(source, "ownerConfirmation", "OwnerConfirmation"),
    jockeyConfirmation: valueOf(source, "jockeyConfirmation", "JockeyConfirmation"),
    status: mapRegistrationStatus(valueOf(source, "status", "Status")),
    createdAt: valueOf(source, "createdAt", "createAt", "CreateAt"),
    updatedAt: valueOf(source, "updatedAt", "UpdatedAt")
  };
}

export function mapRegistrations(items = []) {
  return items.map(mapRegistration);
}

export function filterRegistrationsByStatuses(registrations = [], statuses = []) {
  if (!statuses.length) return registrations;
  const allowed = new Set(statuses);
  return registrations.filter((registration) => allowed.has(registration.status));
}

export function buildRegistrationPayload({ horseId, jockeyId, raceId, gateNumber }) {
  return {
    horseId,
    jockeyId,
    raceId,
    gateNumber: gateNumber === "" || gateNumber == null ? null : Number(gateNumber)
  };
}

export function isRegistrationGateTaken(registrations, raceId, gateNumber) {
  if (gateNumber === "" || gateNumber == null) return false;
  return registrations.some(
    (registration) => registration.raceId === raceId && registration.gateNumber === Number(gateNumber)
  );
}
