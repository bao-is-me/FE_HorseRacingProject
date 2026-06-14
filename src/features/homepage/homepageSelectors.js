import { demoAccounts } from "../../mocks/accounts.mock";
import { horses } from "../../mocks/horses.mock";
import { races, racecourses, registrations } from "../../mocks/races.mock";
import { raceResults } from "../../mocks/results.mock";
import { tournaments } from "../../mocks/tournaments.mock";
import { formatDateTime } from "../../utils/formatters";

const activeRaceStatuses = ["Live", "BettingOpen", "ResultPending"];
const upcomingRaceStatuses = ["Scheduled", "BettingOpen"];
const ongoingTournamentStatuses = ["Scheduled", "BettingOpen", "Live"];

export function getHomepageOverview() {
  return {
    activeRaces: races.filter((race) => activeRaceStatuses.includes(race.status)).length,
    registeredHorses: horses.length,
    ongoingTournaments: tournaments.filter((tournament) => ongoingTournamentStatuses.includes(tournament.status)).length,
    activeParticipants: demoAccounts.filter((account) => account.status === "Active").length + registrations.length
  };
}

export function getHomepageRaceRows() {
  return races
    .filter((race) => [...activeRaceStatuses, ...upcomingRaceStatuses].includes(race.status))
    .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
    .map((race) => {
      const tournament = tournaments.find((item) => item.id === race.tournamentId);
      const racecourse = racecourses.find((item) => item.id === race.racecourseId);
      const entries = registrations.filter((item) => item.raceId === race.id);

      return {
        Race: `Race ${race.raceNumber}`,
        Tournament: tournament?.tournamentName || "-",
        Racecourse: racecourse ? `${racecourse.racecourseName} - ${racecourse.trackType}` : "-",
        "Start Time": formatDateTime(race.startTime),
        Entries: `${entries.length}/${race.maxParticipants}`,
        Status: race.status
      };
    });
}

export function getHomepageActivities() {
  const resultActivities = raceResults.map((result) => {
    const entry = registrations.find((item) => item.id === result.registrationId);
    const horse = horses.find((item) => item.id === entry?.horseId);
    return {
      Title: `${horse?.horseName || "Race entry"} finished #${result.finishPosition}`,
      Type: "Race result",
      Status: result.isDisqualified ? "Review" : "Official"
    };
  });

  const tournamentActivities = tournaments.slice(0, 2).map((tournament) => ({
    Title: tournament.tournamentName,
    Type: "Tournament update",
    Status: tournament.status
  }));

  return [...resultActivities, ...tournamentActivities].slice(0, 4);
}

export function getHomepageQuickNav(role) {
  const shared = [
    { label: "Races", page: "races" },
    { label: "Rankings", page: "rankings" },
    { label: "Results", page: role === "HorseOwner" ? "owner-results" : "live-results" },
    { label: "Profile", page: "profile" }
  ];

  if (role === "Spectator") {
    return [{ label: "Betting", page: "predictions" }, { label: "Wallet", page: "wallet" }, ...shared];
  }

  if (role === "HorseOwner") {
    return [{ label: "Horses", page: "my-horses" }, { label: "Jockey Selection", page: "jockey-selection" }, ...shared];
  }

  if (role === "Jockey") {
    return [{ label: "Upcoming Rides", page: "jockey-schedule" }, { label: "Invitations", page: "ride-invitations" }, ...shared];
  }

  if (role === "Referee") {
    return [{ label: "Race Monitoring", page: "race-monitoring" }, { label: "Result Form", page: "result-form" }, ...shared];
  }

  return shared;
}

export function getHomepageRoleMessage(role) {
  const messages = {
    Spectator: "Follow live races, place predictions, and review standings from one shared home base.",
    HorseOwner: "Track horses, upcoming race opportunities, and tournament performance in one place.",
    Jockey: "Review upcoming rides, invitations, live races, and ranking momentum from one place.",
    Referee: "Keep live race monitoring, result workflows, and race context within reach."
  };

  return messages[role] || "A shared overview for the horse racing management system.";
}
