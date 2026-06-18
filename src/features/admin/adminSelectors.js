import { demoAccounts } from "../../mocks/accounts.mock";
import { racecourses, races } from "../../mocks/races.mock";
import { roles } from "../../mocks/roles.mock";
import { tournaments } from "../../mocks/tournaments.mock";
import { formatCurrency } from "../../utils/formatters";
import { mapRaceDetailsList } from "../../domain";

const mappedRaces = mapRaceDetailsList(races);

export function getUserRows() {
  return demoAccounts.map((account) => ({
    Email: account.email,
    Role: roles[account.role],
    Status: account.status,
    FullName: account.fullName,
    Phone: account.phone,
    Balance: account.balance ? formatCurrency(account.balance) : "-"
  }));
}

export function getPendingAccountRows() {
  return demoAccounts
    .filter((account) => account.status === "Pending")
    .map((account) => ({
      Email: account.email,
      Role: roles[account.role],
      FullName: account.fullName,
      Phone: account.phone,
      Status: account.status
    }));
}

export function getTournamentRows() {
  return tournaments.map((item) => ({
    Tournament: item.tournamentName,
    Description: item.description,
    StartDate: item.startDate,
    EndDate: item.endDate,
    Status: item.status
  }));
}

export function getRacecourseRows() {
  return racecourses.map((item) => ({
    Racecourse: item.racecourseName,
    Location: item.location,
    TrackType: item.trackType
  }));
}

export function getRefereeAssignmentRows() {
  return mappedRaces.map((race) => ({
    Race: `Race ${race.raceNumber}`,
    Status: race.status,
    Referee: "Track Referee"
  }));
}
