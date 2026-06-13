import { demoAccounts } from "../../mocks/accounts.mock";
import { horses } from "../../mocks/horses.mock";
import { races, registrations } from "../../mocks/races.mock";
import { reports } from "../../mocks/referee.mock";
import { formatDateTime } from "../../utils/formatters";
import { getHorseCheckRows } from "../horses/horseSelectors";
import { getLiveRaceRows } from "../races/raceSelectors";

export { getHorseCheckRows, getLiveRaceRows };

export function getViolationRows() {
  return reports.map((report) => {
    const race = races.find((item) => item.id === report.raceId);
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
  return registrations.map((entry) => {
    const horse = horses.find((item) => item.id === entry.horseId);
    const jockey = demoAccounts.find((item) => item.id === entry.jockeyId);
    return {
      Registration: entry.id,
      Horse: horse?.horseName,
      Jockey: jockey?.fullName,
      Gate: entry.gateNumber,
      Status: entry.status,
      "Finish Position": "",
      "Finish Time": ""
    };
  });
}
