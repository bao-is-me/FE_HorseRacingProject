import React from "react";

function PanelHeader({ kicker, title, description, compact = false }) {
  return (
    <div className={`section-heading ${compact ? "compact" : ""}`}>
      <span>{kicker}</span>
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </div>
  );
}

export default PanelHeader;
