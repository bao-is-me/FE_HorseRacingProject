import { API_BASE_URL, USE_MOCK_DATA, request } from "../../../services/apiClient";
import { horses as mockHorses } from "../../../mocks/horses.mock";
import { racecourses, races, registrations } from "../../../mocks/races.mock";
import { raceResults } from "../../../mocks/results.mock";
import { tournaments } from "../../../mocks/tournaments.mock";

export function isLive(status) {
  return status === "Live" || status === "Racing";
}

export function isFinished(status) {
  return ["Finished", "Completed", "ResultPending"].includes(status);
}

export function isPending(status) {
  return ["Scheduled", "BettingOpen", "BettingClosed"].includes(status);
}

function mapRace(race) {
  const racecourse = racecourses.find((item) => item.id === race.racecourseId);
  const tournament = tournaments.find((item) => item.id === race.tournamentId);

  return {
    raceId: race.id,
    raceNumber: race.raceNumber,
    startTime: race.startTime,
    trackLength: race.trackLength,
    maxParticipants: race.maxParticipants,
    status: race.status,
    racecourseName: racecourse?.racecourseName || "Unknown racecourse",
    location: racecourse?.location || "-",
    tournament: tournament
      ? {
          tournamentId: tournament.id,
          tournamentName: tournament.tournamentName,
          description: tournament.description,
          startDate: tournament.startDate,
          endDate: tournament.endDate,
          status: tournament.status
        }
      : null
  };
}

function mapHorse(horse) {
  return {
    id: horse.id,
    horseName: horse.horseName,
    breed: horse.breed,
    color: horse.color,
    age: horse.age,
    status: horse.status
  };
}

function getMockRaceHorses(raceId) {
  const horseIds = registrations.filter((item) => item.raceId === raceId).map((item) => item.horseId);
  const selected = mockHorses.filter((horse) => horseIds.includes(horse.id));
  return (selected.length ? selected : mockHorses).map(mapHorse);
}

function getMockResults(raceId) {
  const raceRegistrationIds = registrations.filter((item) => item.raceId === raceId).map((item) => item.id);

  return raceResults
    .filter((result) => raceRegistrationIds.includes(result.registrationId))
    .map((result) => {
      const registration = registrations.find((item) => item.id === result.registrationId);
      const horse = mockHorses.find((item) => item.id === registration?.horseId);

      return {
        position: result.finishPosition,
        horse: mapHorse(horse || mockHorses[0]),
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
      const rows = status ? races.filter((race) => race.status === status) : races;
      return Promise.resolve(rows.map(mapRace));
    }

    const qs = status ? `?status=${encodeURIComponent(status)}` : "";
    const result = await requestApi(`/api/races${qs}`);
    return result?.items || result || [];
  },

  getLiveRace: async () => {
    const list = await raceApi.getRaces("Live");
    return list[0] || null;
  },

  getRace: async (raceId) => {
    if (USE_MOCK_DATA) {
      const race = races.find((item) => item.id === raceId);
      if (!race) throw new Error("Race not found.");
      return Promise.resolve(mapRace(race));
    }

    return requestApi(`/api/races/${raceId}`);
  },

  getHorses: async (raceId) => {
    if (USE_MOCK_DATA) return Promise.resolve(getMockRaceHorses(raceId));
    return requestApi(`/api/races/${raceId}/horses`);
  },

  getResults: async (raceId) => {
    if (USE_MOCK_DATA) return Promise.resolve(getMockResults(raceId));
    return requestApi(`/api/races/${raceId}/results`);
  },

  startRace: (raceId) => requestApi(`/api/races/${raceId}/start`, { method: "POST" }),
  resetRace: (raceId) => requestApi(`/api/races/${raceId}/reset`, { method: "POST" }),
  baseUrl: API_BASE_URL
};
