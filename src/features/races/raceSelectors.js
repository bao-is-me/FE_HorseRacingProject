import { demoAccounts } from "../../mocks/accounts.mock";
import { horses } from "../../mocks/horses.mock";
import { racecourses, races, registrations } from "../../mocks/races.mock";
import { raceResults } from "../../mocks/results.mock";
import { tournaments } from "../../mocks/tournaments.mock";
import { formatDateTime } from "../../utils/formatters";
import { filterRacesByStatuses, mapHorses, mapRaceDetailsList, mapRegistrations } from "../../domain";

const mappedRegistrations = mapRegistrations(registrations);
const mappedRaces = mapRaceDetailsList(races, { racecourses, tournaments });
const mappedHorses = mapHorses(horses, { registrations: mappedRegistrations, races: mappedRaces });

export function getRaceViewModel(race) {
  const mappedRace = mappedRaces.find((item) => item.id === race?.id) || race;
  const entries = mappedRegistrations
    .filter((item) => item.raceId === mappedRace?.id)
    .map((entry) => {
      const horse = mappedHorses.find((item) => item.id === entry.horseId);
      const jockey = demoAccounts.find((item) => item.id === entry.jockeyId);
      const result = raceResults.find((item) => item.registrationId === entry.id);
      return { ...entry, horse, jockey, result };
    });

  return { ...mappedRace, entries };
}

export function getRaceRows() {
  return mappedRaces.map((race) => {
    const view = getRaceViewModel(race);
    return {
      Race: `Race ${race.raceNumber}`,
      Tournament: view.tournament?.name,
      Racecourse: view.racecourseName,
      "Start Time": formatDateTime(race.startTime),
      Length: `${race.trackLength}m`,
      Participants: `${view.entries.length}/${race.maxParticipants}`,
      Status: race.status
    };
  });
}

export function getLiveRaceRows() {
  return filterRacesByStatuses(mappedRaces, ["Live", "Completed", "BettingOpen"])
    .map((race) => {
      const view = getRaceViewModel(race);
      return {
        Race: `Race ${race.raceNumber}`,
        Racecourse: view.racecourseName,
        Entries: view.entries.length,
        Status: race.status,
        "Track Length": `${race.trackLength}m`,
        "Start Time": formatDateTime(race.startTime)
      };
    });
}

export function getRaceCardModels() {
  return mappedRaces.map(getRaceViewModel);
}

export function getRacecourseOptions() {
  return racecourses.map((racecourse) => ({
    id: racecourse.id,
    name: racecourse.racecourseName
  }));
}

export function getTournamentOptions() {
  return tournaments.map((tournament) => ({
    id: tournament.id,
    name: tournament.tournamentName
  }));
}
