import { demoAccounts } from "../../mocks/accounts.mock";
import { horses } from "../../mocks/horses.mock";
import { racecourses, races, registrations } from "../../mocks/races.mock";
import { raceResults } from "../../mocks/results.mock";
import { tournaments } from "../../mocks/tournaments.mock";
import { formatDateTime } from "../../utils/formatters";

export function getRaceViewModel(race) {
  const tournament = tournaments.find((item) => item.id === race?.tournamentId);
  const racecourse = racecourses.find((item) => item.id === race?.racecourseId);
  const entries = registrations
    .filter((item) => item.raceId === race?.id)
    .map((entry) => {
      const horse = horses.find((item) => item.id === entry.horseId);
      const jockey = demoAccounts.find((item) => item.id === entry.jockeyId);
      const result = raceResults.find((item) => item.registrationId === entry.id);
      return { ...entry, horse, jockey, result };
    });

  return { ...race, tournament, racecourse, entries };
}

export function getRaceRows() {
  return races.map((race) => {
    const view = getRaceViewModel(race);
    return {
      Race: `Race ${race.raceNumber}`,
      Tournament: view.tournament?.tournamentName,
      Racecourse: view.racecourse?.racecourseName,
      "Start Time": formatDateTime(race.startTime),
      Length: `${race.trackLength}m`,
      Participants: `${view.entries.length}/${race.maxParticipants}`,
      Status: race.status
    };
  });
}

export function getLiveRaceRows() {
  return races
    .filter((race) => ["Live", "ResultPending", "BettingOpen"].includes(race.status))
    .map((race) => {
      const view = getRaceViewModel(race);
      return {
        Race: `Race ${race.raceNumber}`,
        Racecourse: view.racecourse?.racecourseName,
        Entries: view.entries.length,
        Status: race.status,
        "Track Length": `${race.trackLength}m`,
        "Start Time": formatDateTime(race.startTime)
      };
    });
}
