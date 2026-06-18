import React, { useEffect, useState } from "react";
import { Activity } from "lucide-react";
import PanelHeader from "../../../components/ui/PanelHeader";
import StatusPill from "../../../components/ui/StatusPill";
import RaceListPage from "../../races/pages/RaceListPage";
import { formatDateTime } from "../../../utils/formatters";
import RacePage from "../components/RacePage";
import { isLive, raceApi } from "../services/raceApi";
import "./raceAnalysis.css";

const statusPriority = {
  Live: 1,
  BettingOpen: 2,
  BettingClosed: 3,
  Scheduled: 4,
  Completed: 5,
  Finished: 6
};

const raceFeedStatuses = ["Live", "BettingOpen", "BettingClosed", "Scheduled", "Completed", "Finished"];
const defaultSelectedStatuses = ["Live", "BettingOpen", "Scheduled"];

function normalizeStatus(status) {
  return status;
}

function sortRacesByStatusAndTime(allRaces) {
  return [...allRaces].sort((a, b) => {
    const aPriority = statusPriority[a.status] || 99;
    const bPriority = statusPriority[b.status] || 99;

    if (aPriority !== bPriority) return aPriority - bPriority;
    return new Date(a.startTime) - new Date(b.startTime);
  });
}

function getRaceSearchText(race) {
  return [
    race.raceId,
    `Race ${race.raceNumber}`,
    race.raceNumber,
    race.status,
    race.racecourseName,
    race.location,
    race.tournament?.tournamentName
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function RaceCard({ race, active, onSelect }) {
  const normalizedStatus = normalizeStatus(race.status);

  return (
    <button className={`race-analysis-card ${active ? "active" : ""}`} type="button" onClick={() => onSelect(race.raceId)}>
      <div>
        <strong>Race {race.raceNumber}</strong>
        <StatusPill>{normalizedStatus}</StatusPill>
      </div>
      <em>{race.tournament?.tournamentName || "Tournament pending"}</em>
      <span>{race.racecourseName}</span>
      <small>{formatDateTime(race.startTime)}</small>
    </button>
  );
}

function RaceAnalysisPage({ role = "Spectator" }) {
  const [races, setRaces] = useState([]);
  const [selectedRaceId, setSelectedRaceId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedStatuses, setSelectedStatuses] = useState(defaultSelectedStatuses);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    let mounted = true;

    raceApi
      .getRaces()
      .then((items) => {
        if (!mounted) return;
        const sortedItems = sortRacesByStatusAndTime(items);
        const selectableRaces = sortedItems.filter((race) => defaultSelectedStatuses.includes(normalizeStatus(race.status)));
        setRaces(sortedItems);
        setSelectedRaceId(
          (current) =>
            current ||
            selectableRaces.find((race) => isLive(race.status))?.raceId ||
            selectableRaces[0]?.raceId ||
            null
        );
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const feedRaces = sortRacesByStatusAndTime(races)
    .filter((race) => raceFeedStatuses.includes(normalizeStatus(race.status)))
    .filter((race) => (selectedStatuses.length ? selectedStatuses.includes(normalizeStatus(race.status)) : true))
    .filter((race) => {
      const keyword = searchTerm.trim().toLowerCase();
      return keyword ? getRaceSearchText(race).includes(keyword) : true;
    });

  function toggleStatus(status) {
    setSelectedStatuses((current) =>
      current.includes(status) ? current.filter((item) => item !== status) : [...current, status]
    );
  }

  return (
    <section className="race-analysis-page page-stack">
      <PanelHeader
        kicker="Race Analysis"
        title="Live race simulation and performance view"
        description={`Shared analysis workspace for ${role}, horse owners, jockeys, and referees.`}
      />

      <section className="panel race-analysis-schedule">
        <RaceListPage role={role} />
      </section>

      <section className="panel race-analysis-feed">
        <div className="race-analysis-list-head">
          <div>
            <span>Race feed</span>
            <h3>Choose a race for live simulation</h3>
          </div>
          <Activity size={20} />
        </div>

        <div className="race-feed-toolbar">
          <div className="race-feed-status-filters" aria-label="Race status filters">
            <button
              className={`race-feed-filter ${selectedStatuses.length === 0 ? "active" : ""}`}
              type="button"
              onClick={() => setSelectedStatuses([])}
            >
              All
            </button>
            {raceFeedStatuses.map((status) => (
              <button
                className={`race-feed-filter ${selectedStatuses.includes(status) ? "active" : ""}`}
                type="button"
                key={status}
                onClick={() => toggleStatus(status)}
              >
                {status}
              </button>
            ))}
          </div>
          <input
            className="race-feed-search"
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search race, tournament, track..."
          />
        </div>

        <div className="race-analysis-feed-row">
          <button
            className={`race-analysis-card demo ${!selectedRaceId ? "active" : ""}`}
            type="button"
            onClick={() => setSelectedRaceId(null)}
          >
            <div>
              <strong>Demo race</strong>
              <StatusPill tone="info">Live</StatusPill>
            </div>
            <span>Offline simulation</span>
            <small>Works without backend</small>
          </button>

          {loading ? (
            <div className="race-analysis-loading">Loading races...</div>
          ) : feedRaces.length === 0 ? (
            <div className="race-analysis-empty">No races match the selected filters.</div>
          ) : (
            feedRaces.map((race) => (
              <RaceCard key={race.raceId} race={race} active={race.raceId === selectedRaceId} onSelect={setSelectedRaceId} />
            ))
          )}
        </div>
      </section>

      <RacePage raceId={selectedRaceId} />
    </section>
  );
}

export default RaceAnalysisPage;
