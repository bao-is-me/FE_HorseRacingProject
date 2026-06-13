import React from "react";
import MetricCard from "../../../components/ui/MetricCard";
import PanelHeader from "../../../components/ui/PanelHeader";

function DashboardPage({ kicker, title, description, metrics, children }) {
  return (
    <section className="page-stack">
      <PanelHeader kicker={kicker} title={title} description={description} />
      <div className="metric-grid">
        {metrics.map((metric) => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </div>
      {children}
    </section>
  );
}

export default DashboardPage;
