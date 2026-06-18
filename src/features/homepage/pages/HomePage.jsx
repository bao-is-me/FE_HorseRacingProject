import React from "react";
import { Activity, CalendarDays, ShieldCheck, Trophy, Users } from "lucide-react";
import DataTable from "../../../components/ui/DataTable";
import MetricCard from "../../../components/ui/MetricCard";
import PanelHeader from "../../../components/ui/PanelHeader";
import StatusPill from "../../../components/ui/StatusPill";
import {
  getHomepageActivities,
  getHomepageOverview,
  getHomepageRaceRows,
} from "../homepageSelectors";
import "./homePage.css";

function HomePage({ role = "Spectator", onNavigate }) {
  const overview = getHomepageOverview();
  const raceRows = getHomepageRaceRows();
  const activities = getHomepageActivities();

  return (
    <section className="home-page page-stack">
      <div className="metric-grid">
        <MetricCard label="Active races" value={overview.activeRaces} icon={Activity} />
        <MetricCard label="Registered horses" value={overview.registeredHorses} icon={ShieldCheck} />
        <MetricCard label="Ongoing tournaments" value={overview.ongoingTournaments} icon={Trophy} />
        <MetricCard label="Active participants" value={overview.activeParticipants} icon={Users} />
      </div>

      <section className="panel">
        <PanelHeader
          kicker="Live / Upcoming Races"
          title="Race control center"
          description="Live and upcoming races are the primary entry point for every non-admin role."
        />
        <div className="home-race-list">
          {raceRows.slice(0, 3).map((race) => (
            <article className="race-card" key={`${race.Race}-${race["Start Time"]}`}>
              <div className="race-card-top">
                <h3>{race.Race}</h3>
                <StatusPill>{race.Status}</StatusPill>
              </div>
              <p>{race.Tournament}</p>
              <div className="mini-row">
                <span>{race.Racecourse}</span>
                <strong>{race.Entries} entries</strong>
              </div>
              <div className="mini-row">
                <span>{race["Start Time"]}</span>
                <CalendarDays size={16} />
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="panel">
        <PanelHeader kicker="Recent Activity" title="Latest system updates" compact />
        <DataTable rows={activities} />
      </section>
    </section>
  );
}

export default HomePage;
