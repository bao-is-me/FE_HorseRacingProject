import React from "react";
import PanelHeader from "../../../components/ui/PanelHeader";
import StatusPill from "../../../components/ui/StatusPill";
import { systemHealthChecks } from "../adminMock";

function SystemHealth() {
  return (
    <section className="panel">
      <PanelHeader kicker="System Support" title="Implementation notes" description="Items inferred from RDS, SQL, and backend source." compact />
      <div className="check-grid">
        {systemHealthChecks.map((item) => (
          <div className="check-item" key={item.label}>
            <StatusPill tone={item.tone}>{item.label}</StatusPill>
            <strong>{item.value}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}

export default SystemHealth;
