import { USE_MOCK_DATA } from "../../services/apiClient";
import { racecourses, races, registrations } from "../../mocks/races.mock";
import { mapRaceDetailsList, mapRegistrations } from "../../domain";

const mappedRaces = mapRaceDetailsList(races, { racecourses });
const mappedRegistrations = mapRegistrations(registrations);

export async function getRaces() {
  return mappedRaces;
}

export async function getRacecourses() {
  return racecourses;
}

export async function getRegistrations() {
  return mappedRegistrations;
}

export async function getRaceDemoData() {
  if (USE_MOCK_DATA) {
    return { races: mappedRaces, racecourses, registrations: mappedRegistrations };
  }
  return { races: mappedRaces, racecourses, registrations: mappedRegistrations };
}
