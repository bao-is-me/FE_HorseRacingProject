import { demoAccounts } from "../../mocks/accounts.mock";
import { bets, payments } from "../../mocks/betting.mock";
import { horses } from "../../mocks/horses.mock";
import { races, registrations } from "../../mocks/races.mock";
import { formatCurrency, formatDateTime } from "../../utils/formatters";

export function getPredictionRows(admin = false) {
  return registrations.map((entry) => {
    const race = races.find((item) => item.id === entry.raceId);
    const horse = horses.find((item) => item.id === entry.horseId);
    const jockey = demoAccounts.find((item) => item.id === entry.jockeyId);
    return {
      Race: `Race ${race?.raceNumber}`,
      Horse: horse?.horseName,
      Jockey: jockey?.fullName,
      Odds: entry.odds,
      Status: entry.status,
      Action: admin ? "Audit" : "Place Bet"
    };
  });
}

export function getBetHistoryRows() {
  return bets.map((bet) => {
    const entry = registrations.find((item) => item.id === bet.registrationId);
    const horse = horses.find((item) => item.id === entry?.horseId);
    return {
      Ticket: bet.id,
      Horse: horse?.horseName,
      Type: bet.betType,
      Amount: formatCurrency(bet.betAmount),
      Ratio: bet.payoutRatio,
      Status: bet.status
    };
  });
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
