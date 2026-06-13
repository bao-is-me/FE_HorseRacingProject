import React from "react";

function MetricCard({ label, value, icon: Icon }) {
  return (
    <article className="metric-card">
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
      <Icon size={22} />
    </article>
  );
}

export default MetricCard;
