import { USE_MOCK_DATA } from "../../services/apiClient";
import { racecourses, races, registrations } from "../../mocks/races.mock";

export async function getRaces() {
  return races;
}

export async function getRacecourses() {
  return racecourses;
}

export async function getRegistrations() {
  return registrations;
}

export async function getRaceDemoData() {
  if (USE_MOCK_DATA) {
    return { races, racecourses, registrations };
  }
  return { races, racecourses, registrations };
}
