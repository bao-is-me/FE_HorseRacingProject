import { demoAccounts } from "../../mocks/accounts.mock";
import { roles } from "../../mocks/roles.mock";
import { formatCurrency } from "../../utils/formatters";

export function getProfile(user, role) {
  return user || demoAccounts.find((account) => account.role === role) || demoAccounts[0];
}

export function getProfileRows(user, role) {
  const profile = getProfile(user, role);
  const rows = [
    { Field: "Email", Value: profile.email },
    { Field: "Role", Value: roles[profile.role] || roles[role] || "Guest" },
    { Field: "Status", Value: profile.status || "Active" },
    { Field: "Full Name", Value: profile.fullName || "Guest user" },
    { Field: "Phone", Value: profile.phone || "-" },
    { Field: "Balance", Value: formatCurrency(profile.balance || 0) }
  ];
  if (profile.role === "Jockey" || role === "Jockey") {
    rows.push({ Field: "Experience Years", Value: profile.experienceYears || 5 });
    rows.push({ Field: "Jockey Rating", Value: profile.jockeyRating || 4.72 });
  }
  return rows;
}
