import React from "react";
import { getStatusMeta } from "../../domain";

function StatusPill({ tone = "neutral", children }) {
  const statusKey = typeof children === "string" ? children : "";
  const status = getStatusMeta(statusKey, tone);

  return <span className={`status-pill ${status.color}`}>{status.label}</span>;
}

export default StatusPill;
