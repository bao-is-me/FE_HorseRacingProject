export const systemHealthChecks = [
  { label: "JWT Auth", value: "Configured in FE", tone: "live" },
  { label: "Backend API", value: "localhost:5035", tone: "info" },
  { label: "Notifications DB", value: "Missing table", tone: "warning" },
  { label: "RaceReferees DB", value: "Missing table", tone: "warning" }
];
