import {
  deriveHorseStatus,
  HORSE_DERIVED_STATUS_VALUES,
  mapDerivedHorseStatus,
  mapHorseStatus
} from "./status.mapper";

function valueOf(source, ...keys) {
  for (const key of keys) {
    if (source?.[key] !== undefined) return source[key];
  }
  return null;
}

export function mapHorse(source = {}, { registrations = [], races = [] } = {}) {
  const id = valueOf(source, "id", "Id");
  const status = mapHorseStatus(valueOf(source, "status", "Status"));
  const suppliedDerivedStatus = valueOf(source, "derivedStatus", "DerivedStatus");
  const derivedStatus = registrations.length || races.length
    ? deriveHorseStatus({ horseId: id, registrations, races })
    : mapDerivedHorseStatus(suppliedDerivedStatus);

  return {
    id,
    ownerId: valueOf(source, "ownerId", "OwnerId"),
    name: valueOf(source, "name", "horseName", "HorseName") || "",
    age: valueOf(source, "age", "Age"),
    breed: valueOf(source, "breed", "Breed"),
    weight: valueOf(source, "weight", "Weight"),
    status,
    derivedStatus,
    recordWins: valueOf(source, "recordWins", "RecordWins"),
    color: valueOf(source, "color", "Color"),
    imageUrl: valueOf(source, "imageUrl", "ImageUrl"),
    createdAt: valueOf(source, "createdAt", "createAt", "CreateAt"),
    updatedAt: valueOf(source, "updatedAt", "UpdatedAt")
  };
}

export function mapHorses(items = [], context = {}) {
  return items.map((item) => mapHorse(item, context));
}

export function mapHorseFormValues(values, currentHorse = null, context = {}) {
  const currentDerivedStatus = HORSE_DERIVED_STATUS_VALUES.includes(currentHorse?.derivedStatus)
    ? currentHorse.derivedStatus
    : null;

  return mapHorse({
    ...currentHorse,
    id: values.id ?? currentHorse?.id,
    ownerId: values.ownerId ?? currentHorse?.ownerId,
    name: values.horseName,
    age: values.age,
    breed: values.breed,
    weight: values.weight,
    status: values.status,
    derivedStatus: currentDerivedStatus,
    recordWins: values.recordWins,
    color: values.color,
    imageUrl: values.imageUrl ?? currentHorse?.imageUrl,
    createdAt: currentHorse?.createdAt || values.createdAt,
    updatedAt: values.updatedAt
  }, context);
}

export function filterHorses(horses, { ownerId, search, status, breed, color } = {}) {
  const keyword = String(search || "").trim().toLowerCase();
  return horses.filter((horse) => {
    const matchesOwner = !ownerId || horse.ownerId === ownerId;
    const matchesSearch = !keyword || [horse.name, horse.breed, horse.color, horse.status]
      .some((value) => String(value || "").toLowerCase().includes(keyword));
    return matchesOwner
      && matchesSearch
      && (!status || status === "All" || horse.status === status)
      && (!breed || breed === "All" || horse.breed === breed)
      && (!color || color === "All" || horse.color === color);
  });
}
