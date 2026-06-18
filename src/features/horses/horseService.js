import { USE_MOCK_DATA } from "../../services/apiClient";
import { horses } from "../../mocks/horses.mock";
import { races, registrations } from "../../mocks/races.mock";
import { mapHorses, mapRaceDetailsList, mapRegistrations } from "../../domain";

export async function getHorses() {
  const mappedRegistrations = mapRegistrations(registrations);
  const mappedRaces = mapRaceDetailsList(races);
  const mappedHorses = mapHorses(horses, {
    races: mappedRaces,
    registrations: mappedRegistrations
  });
  if (USE_MOCK_DATA) return mappedHorses;
  return mappedHorses;
}
