import { horses, DEFAULT_OWNER_ID } from "../../mocks/horses.mock";

export function getHorseRows({ ownerOnly = false, user } = {}) {
  const ownerId = user?.id || DEFAULT_OWNER_ID;
  const source = ownerOnly ? horses.filter((horse) => horse.ownerId === ownerId || horse.ownerId === DEFAULT_OWNER_ID) : horses;
  return source.map((horse) => ({
    Horse: horse.horseName,
    Age: horse.age,
    Breed: horse.breed,
    Weight: `${horse.weight} kg`,
    Color: horse.color,
    Wins: horse.recordWins,
    Status: horse.status
  }));
}

export function getHorseCheckRows() {
  return horses.map((horse) => ({
    Horse: horse.horseName,
    Age: horse.age,
    Breed: horse.breed,
    Weight: `${horse.weight} kg`,
    Color: horse.color,
    Status: horse.status,
    Clearance: horse.status === "Healthy" ? "Ready" : "Review"
  }));
}
