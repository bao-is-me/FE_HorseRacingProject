import { USE_MOCK_DATA } from "../../services/apiClient";
import { demoAccounts } from "../../mocks/accounts.mock";
import { racecourses } from "../../mocks/races.mock";
import { tournaments } from "../../mocks/tournaments.mock";

export async function getAccounts() {
  if (USE_MOCK_DATA) return demoAccounts;
  return demoAccounts;
}

export async function getTournaments() {
  if (USE_MOCK_DATA) return tournaments;
  return tournaments;
}

export async function getRacecourses() {
  if (USE_MOCK_DATA) return racecourses;
  return racecourses;
}
