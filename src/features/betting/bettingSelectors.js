import { demoAccounts } from "../../mocks/accounts.mock";
import { bets, payments } from "../../mocks/betting.mock";
import { horses } from "../../mocks/horses.mock";
import { races, registrations } from "../../mocks/races.mock";
import { formatCurrency, formatDateTime } from "../../utils/formatters";
import {
  calculatePayout,
  mapHorses,
  mapRaceDetailsList,
  mapRegistrations
} from "../../domain";

const mappedRegistrations = mapRegistrations(registrations);
const mappedRaces = mapRaceDetailsList(races);
const mappedHorses = mapHorses(horses, { registrations: mappedRegistrations, races: mappedRaces });

export function getPredictionRows(admin = false) {
  return mappedRegistrations.map((entry) => {
    const race = mappedRaces.find((item) => item.id === entry.raceId);
    const horse = mappedHorses.find((item) => item.id === entry.horseId);
    const jockey = demoAccounts.find((item) => item.id === entry.jockeyId);
    return {
      Race: `Race ${race?.raceNumber}`,
      Horse: horse?.name,
      Jockey: jockey?.fullName,
      Status: entry.status
    };
  });
}

export function getBetHistoryModels() {
  return bets.map((bet) => {
    const entry = mappedRegistrations.find((item) => item.id === bet.registrationId);
    const horse = mappedHorses.find((item) => item.id === entry?.horseId);

    return {
      ...bet,
      horseName: horse?.name,
      potentialPayout: calculatePayout(bet.betAmount, bet.payoutRatio)
    };
  });
}

export function getBetHistoryRows() {
  return getBetHistoryModels().map((bet) => ({
    Ticket: bet.id,
    Horse: bet.horseName,
    Type: bet.betType,
    Amount: formatCurrency(bet.betAmount),
    Ratio: bet.payoutRatio,
    Status: bet.status
  }));
}

export function getPaymentRows() {
  return payments.map((payment) => ({
    Transaction: payment.id,
    Account: demoAccounts.find((account) => account.id === payment.accountId)?.fullName,
    Amount: formatCurrency(payment.amount),
    Status: payment.status,
    Created: formatDateTime(payment.createAt)
  }));
}
