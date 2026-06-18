import { demoAccounts } from "../../mocks/accounts.mock";
import { horses } from "../../mocks/horses.mock";
import { prizes } from "../../mocks/results.mock";
import { racecourses, races, registrations } from "../../mocks/races.mock";
import { tournaments } from "../../mocks/tournaments.mock";
import {
  filterHorses,
  filterRacesByStatuses,
  isHorseEligibleForRace,
  mapHorses,
  mapRaceDetailsList,
  mapRegistrations
} from "../../domain";

const mappedRegistrations = mapRegistrations(registrations);
const mappedRaces = mapRaceDetailsList(races, { racecourses, tournaments });
const mappedHorses = mapHorses(horses, { registrations: mappedRegistrations, races: mappedRaces });

export function getHorseModels() {
  return mappedHorses;
}

export function getHorseRows({ ownerOnly = false, user } = {}) {
  const source = ownerOnly
    ? user?.id
      ? filterHorses(mappedHorses, { ownerId: user.id })
      : []
    : mappedHorses;
  return source.map((horse) => ({
    Horse: horse.name,
    Age: horse.age,
    Breed: horse.breed,
    Weight: `${horse.weight} kg`,
    Color: horse.color,
    Wins: horse.recordWins,
    Status: horse.status
  }));
}

export function getHorseCheckRows() {
  return mappedHorses.map((horse) => ({
    Horse: horse.name,
    Age: horse.age,
    Breed: horse.breed,
    Weight: `${horse.weight} kg`,
    Color: horse.color,
    Status: horse.status
  }));
}

export function getHorseRegistrationContext(ownerId) {
  return {
    horses: ownerId
      ? filterHorses(mappedHorses, { ownerId }).filter((horse) => isHorseEligibleForRace(horse.status))
      : [],
    races: filterRacesByStatuses(mappedRaces, ["Scheduled"]),
    registrations: mappedRegistrations,
    jockeys: demoAccounts
      .filter((account) => account.role === "Jockey" && account.status === "Active")
      .map((account) => ({ id: account.id, name: account.fullName }))
  };
}

export function getHorseDetailModel(horse) {
  if (!horse) return null;
  const owner = demoAccounts.find((account) => account.id === horse.ownerId);
  const entries = mappedRegistrations
    .filter((registration) => registration.horseId === horse.id)
    .map((registration) => {
      const race = mappedRaces.find((item) => item.id === registration.raceId);
      const jockey = demoAccounts.find((account) => account.id === registration.jockeyId);
      return {
        ...registration,
        race,
        jockey: jockey ? { id: jockey.id, name: jockey.fullName } : null
      };
    });
  const rewards = entries.flatMap((entry) =>
    prizes
      .filter((prize) => prize.registrationId === entry.id)
      .map((prize) => ({
        id: prize.id,
        registrationId: prize.registrationId,
        prizeType: prize.prizeType,
        amount: prize.amount,
        distributedAt: prize.distributedAt
      }))
  );

  return {
    ...horse,
    owner: owner
      ? { id: owner.id, name: owner.fullName, email: owner.email, phone: owner.phone }
      : null,
    entries,
    rewards,
    totalRewards: rewards.reduce((total, reward) => total + (reward.amount || 0), 0)
  };
}
