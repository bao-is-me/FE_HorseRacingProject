import React from "react";
import StatusPill from "../components/ui/StatusPill";
import { getStatusMeta } from "../domain";

export function renderCell(value) {
  if (typeof value === "string" && getStatusMeta(value).known) return <StatusPill>{value}</StatusPill>;
  return value ?? "-";
}
