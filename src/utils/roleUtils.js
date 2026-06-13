import { roles } from "../mocks/roles.mock";

export function normalizeRole(role) {
  const compact = String(role || "Spectator").replace(/\s+/g, "");
  if (compact === "HorseOwner") return "HorseOwner";
  if (compact in roles) return compact;
  return "Spectator";
}

export function initials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}
