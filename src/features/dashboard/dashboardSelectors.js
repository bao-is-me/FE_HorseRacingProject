import { demoAccounts } from "../../mocks/accounts.mock";
import { DEFAULT_BALANCE, bets } from "../../mocks/betting.mock";
import { horses } from "../../mocks/horses.mock";
import { races, registrations } from "../../mocks/races.mock";
import { reports } from "../../mocks/referee.mock";
import { prizes, raceResults } from "../../mocks/results.mock";
import { formatCurrency } from "../../utils/formatters";

export function getSpectatorMetrics(user) {
  return {
    walletBalance: formatCurrency(user?.balance || DEFAULT_BALANCE),
    activeBets: bets.filter((bet) => bet.status === "Pending").length,
    openRaces: races.filter((race) => race.status === "BettingOpen").length,
    wonTickets: bets.filter((bet) => bet.status === "Won").length
  };
}

export function getOwnerMetrics(user) {
  const ownerHorses = horses.filter((horse) => horse.ownerId === (user?.id || "e3ad08be"));
  return {
    myHorses: ownerHorses.length || 2,
    confirmedEntries: registrations.filter((item) => item.ownerConfirmation).length,
    prizePool: formatCurrency(prizes.reduce((sum, prize) => sum + prize.amount, 0)),
    pendingJockeys: registrations.filter((item) => !item.jockeyConfirmation).length
  };
}

export function getJockeyMetrics(user) {
  return {
    experience: `${user?.experienceYears || 5} yrs`,
    rating: user?.jockeyRating || "4.72",
    pendingInvites: registrations.filter((item) => !item.jockeyConfirmation).length,
    assignedRaces: registrations.filter((item) => item.jockeyConfirmation).length
  };
}

export function getRefereeMetrics() {
  return {
    liveRaces: races.filter((race) => race.status === "Live").length,
    pendingResults: races.filter((race) => race.status === "ResultPending").length,
    incidentReports: reports.length,
    officialResults: raceResults.length
  };
}

export function getAdminMetrics() {
  return {
    totalUsers: demoAccounts.length,
    pendingAccounts: demoAccounts.filter((account) => account.status === "Pending").length,
    totalHorses: horses.length,
    totalBets: bets.length
  };
}

export function getFallbackMetrics() {
  return {
    races: races.length,
    horses: horses.length,
    users: demoAccounts.length,
    reports: reports.length
  };
}
