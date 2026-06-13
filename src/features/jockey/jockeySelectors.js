import { demoAccounts } from "../../mocks/accounts.mock";
import { horses } from "../../mocks/horses.mock";
import { races, registrations } from "../../mocks/races.mock";
import { formatDateTime } from "../../utils/formatters";
import { getRaceViewModel } from "../races/raceSelectors";
import { DEFAULT_JOCKEY_EXPERIENCE_YEARS, DEFAULT_JOCKEY_RATING } from "./jockeyMock";

export function getJockeySelectionRows() {
  return registrations.map((entry) => {
    const horse = horses.find((item) => item.id === entry.horseId);
    const race = races.find((item) => item.id === entry.raceId);
    const jockey = demoAccounts.find((item) => item.id === entry.jockeyId);
    return {
      Horse: horse?.horseName,
      Race: `Race ${race?.raceNumber}`,
      Jockey: jockey?.fullName,
      Experience: `${jockey?.experienceYears || DEFAULT_JOCKEY_EXPERIENCE_YEARS} yrs`,
      Rating: jockey?.jockeyRating || DEFAULT_JOCKEY_RATING,
      Confirmation: entry.jockeyConfirmation ? "Accepted" : "Pending"
    };
  });
}

export function getScheduleRows() {
  return registrations.map((entry) => {
    const race = races.find((item) => item.id === entry.raceId);
    const horse = horses.find((item) => item.id === entry.horseId);
    const view = getRaceViewModel(race);
    return {
      Race: `Race ${race?.raceNumber}`,
      Horse: horse?.horseName,
      Tournament: view.tournament?.tournamentName,
      Racecourse: view.racecourse?.racecourseName,
      Start: formatDateTime(race?.startTime),
      Gate: entry.gateNumber,
      Status: entry.status
    };
  });
}

export function getRideInvitationRows() {
  return registrations
    .filter((entry) => !entry.jockeyConfirmation)
    .map((entry) => {
      const horse = horses.find((item) => item.id === entry.horseId);
      const race = races.find((item) => item.id === entry.raceId);
      const owner = demoAccounts.find((item) => item.id === horse?.ownerId);
      return {
        Horse: horse?.horseName,
        Owner: owner?.fullName,
        Race: `Race ${race?.raceNumber}`,
        Start: formatDateTime(race?.startTime),
        Status: entry.status,
        Action: "Accept / Reject"
      };
    });
}
