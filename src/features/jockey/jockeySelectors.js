import { demoAccounts } from "../../mocks/accounts.mock";
import { horses } from "../../mocks/horses.mock";
import { races, registrations } from "../../mocks/races.mock";
import { formatDateTime } from "../../utils/formatters";
import { getRaceViewModel } from "../races/raceSelectors";
import { DEFAULT_JOCKEY_EXPERIENCE_YEARS, DEFAULT_JOCKEY_RATING } from "./jockeyMock";
import { mapHorses, mapRaceDetailsList, mapRegistrations } from "../../domain";

const mappedRegistrations = mapRegistrations(registrations);
const mappedRaces = mapRaceDetailsList(races);
const mappedHorses = mapHorses(horses, { registrations: mappedRegistrations, races: mappedRaces });

export function getJockeySelectionRows() {
  return mappedRegistrations.map((entry) => {
    const horse = mappedHorses.find((item) => item.id === entry.horseId);
    const race = mappedRaces.find((item) => item.id === entry.raceId);
    const jockey = demoAccounts.find((item) => item.id === entry.jockeyId);
    return {
      Horse: horse?.name,
      Race: `Race ${race?.raceNumber}`,
      Jockey: jockey?.fullName,
      Experience: `${jockey?.experienceYears || DEFAULT_JOCKEY_EXPERIENCE_YEARS} yrs`,
      Rating: jockey?.jockeyRating || DEFAULT_JOCKEY_RATING,
      Confirmation: entry.jockeyConfirmation ? "Confirmed" : entry.status
    };
  });
}

export function getScheduleRows() {
  return mappedRegistrations.map((entry) => {
    const race = mappedRaces.find((item) => item.id === entry.raceId);
    const horse = mappedHorses.find((item) => item.id === entry.horseId);
    const view = getRaceViewModel(race);
    return {
      Race: `Race ${race?.raceNumber}`,
      Horse: horse?.name,
      Tournament: view.tournament?.name,
      Racecourse: view.racecourseName,
      Start: formatDateTime(race?.startTime),
      Gate: entry.gateNumber,
      Status: entry.status
    };
  });
}

export function getRideInvitationRows() {
  return mappedRegistrations
    .filter((entry) => !entry.jockeyConfirmation)
    .map((entry) => {
      const horse = mappedHorses.find((item) => item.id === entry.horseId);
      const race = mappedRaces.find((item) => item.id === entry.raceId);
      const owner = demoAccounts.find((item) => item.id === horse?.ownerId);
      return {
        Horse: horse?.name,
        Owner: owner?.fullName,
        Race: `Race ${race?.raceNumber}`,
        Start: formatDateTime(race?.startTime),
        Status: entry.status
      };
    });
}
