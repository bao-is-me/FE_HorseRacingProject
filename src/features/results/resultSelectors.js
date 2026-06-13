import { demoAccounts } from "../../mocks/accounts.mock";
import { horses } from "../../mocks/horses.mock";
import { registrations } from "../../mocks/races.mock";
import { prizes, raceResults } from "../../mocks/results.mock";
import { formatCurrency } from "../../utils/formatters";

export function getResultRows(publishing = false) {
  return raceResults.map((result) => {
    const entry = registrations.find((item) => item.id === result.registrationId);
    const horse = horses.find((item) => item.id === entry?.horseId);
    const jockey = demoAccounts.find((item) => item.id === entry?.jockeyId);
    const prize = prizes.find((item) => item.registrationId === entry?.id);
    return {
      Horse: horse?.horseName,
      Jockey: jockey?.fullName,
      Position: result.finishPosition,
      "Finish Time": `${result.finishTime} ms`,
      Disqualified: result.isDisqualified ? "Yes" : "No",
      Prize: prize ? formatCurrency(prize.amount) : "-",
      Status: publishing ? "Ready to publish" : "Official"
    };
  });
}

export function getRankingRows() {
  return horses
    .map((horse) => ({
      Horse: horse.horseName,
      Breed: horse.breed,
      Wins: horse.recordWins,
      Status: horse.status,
      Score: horse.recordWins * 120 + (horse.status === "Healthy" ? 20 : 0)
    }))
    .sort((a, b) => b.Score - a.Score);
}
