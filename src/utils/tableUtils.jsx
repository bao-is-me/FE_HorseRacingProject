import React from "react";
import StatusPill from "../components/ui/StatusPill";

export function renderCell(value) {
  if (["Active", "Healthy", "Confirmed", "Official", "Completed", "Ready", "Won", "Accepted"].includes(value)) {
    return <StatusPill tone="live">{value}</StatusPill>;
  }
  if (["Pending", "InvitationPending", "ResultPending", "Scheduled", "Resting", "Ready to publish"].includes(value)) {
    return <StatusPill tone="warning">{value}</StatusPill>;
  }
  if (["Banned", "Error", "Review"].includes(value)) {
    return <StatusPill tone="danger">{value}</StatusPill>;
  }
  if (["BettingOpen", "Live", "Racing", "Info"].includes(value)) {
    return <StatusPill tone="info">{value}</StatusPill>;
  }
  return value ?? "-";
}
