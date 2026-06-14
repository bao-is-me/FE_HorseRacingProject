import React from "react";

function MetricCard({ label, value, icon: Icon, description }) {
  return (
    <article className="metric-card">
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
        {description && <small>{description}</small>}
      </div>
      <Icon size={22} />
    </article>
  );
}

export default MetricCard;
