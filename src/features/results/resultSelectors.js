import { demoAccounts } from "../../mocks/accounts.mock";
import { horses } from "../../mocks/horses.mock";
import { registrations } from "../../mocks/races.mock";
import { prizes, raceResults } from "../../mocks/results.mock";
import { formatCurrency } from "../../utils/formatters";
import { mapHorses, mapRaceDetailsList, mapRegistrations } from "../../domain";
import { races } from "../../mocks/races.mock";

const mappedRegistrations = mapRegistrations(registrations);
const mappedRaces = mapRaceDetailsList(races);
const mappedHorses = mapHorses(horses, { registrations: mappedRegistrations, races: mappedRaces });

export function getResultRows(publishing = false) {
  return raceResults.map((result) => {
    const entry = mappedRegistrations.find((item) => item.id === result.registrationId);
    const horse = mappedHorses.find((item) => item.id === entry?.horseId);
    const jockey = demoAccounts.find((item) => item.id === entry?.jockeyId);
    const prize = prizes.find((item) => item.registrationId === entry?.id);
    return {
      Horse: horse?.name,
      Jockey: jockey?.fullName,
      Position: result.finishPosition,
      "Finish Time": `${result.finishTime} ms`,
      Disqualified: result.isDisqualified ? "Yes" : "No",
      Prize: prize ? formatCurrency(prize.amount) : "-"
    };
  });
}

export function getRankingRows() {
  return mappedHorses
    .map((horse) => ({
      Horse: horse.name,
      Breed: horse.breed,
      Wins: horse.recordWins,
      Status: horse.status
    }))
    .sort((a, b) => b.Wins - a.Wins);
}
