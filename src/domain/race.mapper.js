import { mapRaceStatus } from "./status.mapper";
import { mapHorse } from "./horse.mapper";

function valueOf(source, ...keys) {
  for (const key of keys) {
    if (source?.[key] !== undefined) return source[key];
  }
  return null;
}

export function mapRace(source = {}) {
  const tournament = valueOf(source, "tournament", "Tournament");

  return {
    id: valueOf(source, "id", "raceId", "RaceId"),
    tournamentId:
      valueOf(source, "tournamentId", "TournamentId") ??
      valueOf(tournament, "id", "tournamentId", "TournamentId"),
    racecourseId: valueOf(source, "racecourseId", "RacecourseId"),
    raceNumber: valueOf(source, "raceNumber", "RaceNumber"),
    startTime: valueOf(source, "startTime", "StartTime"),
    trackLength: valueOf(source, "trackLength", "TrackLength"),
    maxParticipants: valueOf(source, "maxParticipants", "MaxParticipants"),
    status: mapRaceStatus(valueOf(source, "status", "Status")),
    grade: valueOf(source, "grade", "Grade")
  };
}

export function mapRaces(items = []) {
  return items.map(mapRace);
}

export function mapRaceDetails(source = {}, { racecourses = [], tournaments = [] } = {}) {
  const race = mapRace(source);
  const racecourse = racecourses.find((item) => item.id === race.racecourseId);
  const rawTournament = valueOf(source, "tournament", "Tournament");
  const tournament = rawTournament || tournaments.find((item) => item.id === race.tournamentId);

  return {
    ...race,
    racecourseName: valueOf(source, "racecourseName", "RacecourseName") || racecourse?.racecourseName || null,
    location: valueOf(source, "location", "Location") || racecourse?.location || null,
    trackType: racecourse?.trackType || null,
    tournament: tournament
      ? {
          id: valueOf(tournament, "id", "tournamentId", "TournamentId"),
          name: valueOf(tournament, "name", "tournamentName", "TournamentName"),
          description: valueOf(tournament, "description", "Description"),
          startDate: valueOf(tournament, "startDate", "StartDate"),
          endDate: valueOf(tournament, "endDate", "EndDate"),
          status: valueOf(tournament, "status", "Status")
        }
      : null
  };
}

export function mapRaceDetailsList(items = [], context = {}) {
  return items.map((item) => mapRaceDetails(item, context));
}

export function mapRaceResult(source = {}) {
  const horse = valueOf(source, "horse", "Horse");

  return {
    position: valueOf(source, "position", "Position", "finishPosition", "FinishPosition"),
    horse: mapHorse(horse || {}),
    finishTime: valueOf(source, "finishTime", "FinishTime"),
    finishedAt: valueOf(source, "finishedAt", "FinishedAt")
  };
}

export function mapRaceResults(items = []) {
  return items.map(mapRaceResult);
}

export function getRaceSearchText(race) {
  return [
    race.id,
    `Race ${race.raceNumber}`,
    race.raceNumber,
    race.status,
    race.racecourseName,
    race.location,
    race.tournament?.name
  ].filter(Boolean).join(" ").toLowerCase();
}

const RACE_STATUS_PRIORITY = {
  Live: 1,
  BettingOpen: 2,
  BettingClosed: 3,
  Scheduled: 4,
  Completed: 5,
  Finished: 6,
  Cancelled: 7
};

export function sortRacesByStatusAndTime(races = []) {
  return [...races].sort((left, right) => {
    const priorityDifference =
      (RACE_STATUS_PRIORITY[left.status] || 99) - (RACE_STATUS_PRIORITY[right.status] || 99);
    return priorityDifference || new Date(left.startTime) - new Date(right.startTime);
  });
}
