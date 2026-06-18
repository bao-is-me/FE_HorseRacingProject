import { demoAccounts } from "../../mocks/accounts.mock";
import { DEFAULT_BALANCE, bets } from "../../mocks/betting.mock";
import { horses } from "../../mocks/horses.mock";
import { races, registrations } from "../../mocks/races.mock";
import { reports } from "../../mocks/referee.mock";
import { prizes, raceResults } from "../../mocks/results.mock";
import { formatCurrency } from "../../utils/formatters";
import {
  filterHorses,
  filterRacesByStatuses,
  filterRegistrationsByStatuses,
  mapHorses,
  mapRaceDetailsList,
  mapRegistrations
} from "../../domain";

const mappedRegistrations = mapRegistrations(registrations);
const mappedRaces = mapRaceDetailsList(races);
const mappedHorses = mapHorses(horses, { registrations: mappedRegistrations, races: mappedRaces });

export function getSpectatorMetrics(user) {
  return {
    walletBalance: formatCurrency(user?.balance || DEFAULT_BALANCE),
    activeBets: bets.filter((bet) => bet.status === "Pending").length,
    openRaces: filterRacesByStatuses(mappedRaces, ["BettingOpen"]).length,
    wonTickets: bets.filter((bet) => bet.status === "Won").length
  };
}

export function getOwnerMetrics(user) {
  const ownerHorses = user?.id ? filterHorses(mappedHorses, { ownerId: user.id }) : [];
  const ownerHorseIds = new Set(ownerHorses.map((horse) => horse.id));
  const ownerRegistrations = mappedRegistrations.filter((item) => ownerHorseIds.has(item.horseId));
  const ownerRegistrationIds = new Set(ownerRegistrations.map((registration) => registration.id));
  const ownerPrizeTotal = prizes
    .filter((prize) => ownerRegistrationIds.has(prize.registrationId))
    .reduce((sum, prize) => sum + prize.amount, 0);

  return {
    myHorses: ownerHorses.length,
    confirmedEntries: filterRegistrationsByStatuses(ownerRegistrations, ["Confirmed"]).length,
    prizePool: formatCurrency(ownerPrizeTotal),
    pendingJockeys: ownerRegistrations.filter((item) => item.jockeyConfirmation !== true).length
  };
}

export function getJockeyMetrics(user) {
  return {
    experience: `${user?.experienceYears || 5} yrs`,
    rating: user?.jockeyRating || "4.72",
    pendingInvites: mappedRegistrations.filter((item) => !item.jockeyConfirmation).length,
    assignedRaces: mappedRegistrations.filter((item) => item.jockeyConfirmation).length
  };
}

export function getRefereeMetrics() {
  return {
    liveRaces: filterRacesByStatuses(mappedRaces, ["Live"]).length,
    pendingResults: filterRacesByStatuses(mappedRaces, ["Completed"]).length,
    incidentReports: reports.length,
    officialResults: raceResults.length
  };
}

export function getAdminMetrics() {
  return {
    totalUsers: demoAccounts.length,
    pendingAccounts: demoAccounts.filter((account) => account.status === "Pending").length,
    totalHorses: mappedHorses.length,
    totalBets: bets.length
  };
}

export function getFallbackMetrics() {
  return {
    races: mappedRaces.length,
    horses: mappedHorses.length,
    users: demoAccounts.length,
    reports: reports.length
  };
}
