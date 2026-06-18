import { API_BASE_URL, USE_MOCK_DATA, request } from "../../../services/apiClient";
import { horses as mockHorses } from "../../../mocks/horses.mock";
import { racecourses, races, registrations } from "../../../mocks/races.mock";
import { raceResults } from "../../../mocks/results.mock";
import { tournaments } from "../../../mocks/tournaments.mock";
import {
  filterRacesByStatuses,
  isRaceFinished,
  isRaceLive,
  isRacePending,
  mapHorses,
  mapRaceDetails,
  mapRaceDetailsList,
  mapRaceResults,
  mapRegistrations
} from "../../../domain";

export const isLive = isRaceLive;
export const isFinished = isRaceFinished;
export const isPending = isRacePending;

const mappedRegistrations = mapRegistrations(registrations);
const mappedRaces = mapRaceDetailsList(races, { racecourses, tournaments });
const mappedHorses = mapHorses(mockHorses, { registrations: mappedRegistrations, races: mappedRaces });

function getMockRaceHorses(raceId) {
  const horseIds = mappedRegistrations.filter((item) => item.raceId === raceId).map((item) => item.horseId);
  const selected = mappedHorses.filter((horse) => horseIds.includes(horse.id));
  return selected.length ? selected : mappedHorses;
}

function getMockResults(raceId) {
  const raceRegistrationIds = mappedRegistrations.filter((item) => item.raceId === raceId).map((item) => item.id);

  return raceResults
    .filter((result) => raceRegistrationIds.includes(result.registrationId))
    .map((result) => {
      const registration = mappedRegistrations.find((item) => item.id === result.registrationId);
      const horse = mappedHorses.find((item) => item.id === registration?.horseId);

      return {
        position: result.finishPosition,
        horse: horse || mappedHorses[0],
        finishTime: result.finishTime,
        finishedAt: new Date(Date.now() + result.finishTime).toISOString()
      };
    });
}

async function requestApi(path, options) {
  return request(path, options);
}

export const raceApi = {
  getRaces: async (status) => {
    if (USE_MOCK_DATA) {
      return Promise.resolve(filterRacesByStatuses(mappedRaces, status ? [status] : []));
    }

    const qs = status ? `?status=${encodeURIComponent(status)}` : "";
    const result = await requestApi(`/api/races${qs}`);
    return mapRaceDetailsList(result?.items || result || []);
  },

  getLiveRace: async () => {
    const list = await raceApi.getRaces("Live");
    return list[0] || null;
  },

  getRace: async (raceId) => {
    if (USE_MOCK_DATA) {
      const race = mappedRaces.find((item) => item.id === raceId);
      if (!race) throw new Error("Race not found.");
      return Promise.resolve(race);
    }

    return mapRaceDetails(await requestApi(`/api/races/${raceId}`));
  },

  getHorses: async (raceId) => {
    if (USE_MOCK_DATA) return Promise.resolve(getMockRaceHorses(raceId));
    return mapHorses(await requestApi(`/api/races/${raceId}/horses`));
  },

  getResults: async (raceId) => {
    if (USE_MOCK_DATA) return Promise.resolve(getMockResults(raceId));
    return mapRaceResults(await requestApi(`/api/races/${raceId}/results`));
  },

  startRace: (raceId) => requestApi(`/api/races/${raceId}/start`, { method: "POST" }),
  resetRace: (raceId) => requestApi(`/api/races/${raceId}/reset`, { method: "POST" }),
  baseUrl: API_BASE_URL
};
