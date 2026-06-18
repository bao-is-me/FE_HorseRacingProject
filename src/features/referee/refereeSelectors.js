import { demoAccounts } from "../../mocks/accounts.mock";
import { horses } from "../../mocks/horses.mock";
import { races, registrations } from "../../mocks/races.mock";
import { reports } from "../../mocks/referee.mock";
import { formatDateTime } from "../../utils/formatters";
import { getHorseCheckRows } from "../horses/horseSelectors";
import { getLiveRaceRows } from "../races/raceSelectors";
import { mapHorses, mapRaceDetailsList, mapRegistrations } from "../../domain";

const mappedRegistrations = mapRegistrations(registrations);
const mappedRaces = mapRaceDetailsList(races);
const mappedHorses = mapHorses(horses, { registrations: mappedRegistrations, races: mappedRaces });

export { getHorseCheckRows, getLiveRaceRows };

export function getViolationRows() {
  return reports.map((report) => {
    const race = mappedRaces.find((item) => item.id === report.raceId);
    const referee = demoAccounts.find((item) => item.id === report.refereeId);
    return {
      Race: `Race ${race?.raceNumber}`,
      Referee: referee?.fullName,
      Incident: report.incidentDescription,
      Penalty: report.penaltyApplied,
      Created: formatDateTime(report.createdAt)
    };
  });
}

export function getResultFormRows() {
  return mappedRegistrations.map((entry) => {
    const horse = mappedHorses.find((item) => item.id === entry.horseId);
    const jockey = demoAccounts.find((item) => item.id === entry.jockeyId);
    return {
      Registration: entry.id,
      Horse: horse?.name,
      Jockey: jockey?.fullName,
      Gate: entry.gateNumber,
      Status: entry.status,
      "Finish Position": "",
      "Finish Time": ""
    };
  });
}
