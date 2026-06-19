import React, { useEffect, useState } from "react";
import { Activity } from "lucide-react";
import PanelHeader from "../../../components/ui/PanelHeader";
import StatusPill from "../../../components/ui/StatusPill";
import RaceListPage from "../../races/pages/RaceListPage";
import { formatDateTime } from "../../../utils/formatters";
import RacePage from "../components/RacePage";
import { isLive, raceApi } from "../services/raceApi";
import {
  filterRacesByStatuses,
  getRaceSearchText,
  RACE_STATUS_VALUES,
  sortRacesByStatusAndTime
} from "../../../domain";
import "./raceAnalysis.css";

const raceFeedStatuses = RACE_STATUS_VALUES.filter((status) => status !== "Cancelled");
const defaultSelectedStatuses = ["Live", "BettingOpen", "Scheduled"];

function RaceCard({ race, active, onSelect }) {
  return (
    <button className={`race-analysis-card ${active ? "active" : ""}`} type="button" onClick={() => onSelect(race.id)}>
      <div>
        <strong>Race {race.raceNumber}</strong>
        <StatusPill>{race.status}</StatusPill>
      </div>
      <em>{race.tournament?.name || "Tournament pending"}</em>
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
        const selectableRaces = filterRacesByStatuses(sortedItems, defaultSelectedStatuses);
        setRaces(sortedItems);
        setSelectedRaceId(
          (current) =>
            current ||
            selectableRaces.find((race) => isLive(race.status))?.id ||
            selectableRaces[0]?.id ||
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

  const feedRaces = filterRacesByStatuses(
    filterRacesByStatuses(sortRacesByStatusAndTime(races), raceFeedStatuses),
    selectedStatuses
  )
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
        <RaceListPage role={role} compact />
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
              <StatusPill>Live</StatusPill>
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
              <RaceCard key={race.id} race={race} active={race.id === selectedRaceId} onSelect={setSelectedRaceId} />
            ))
          )}
        </div>
      </section>

      <RacePage raceId={selectedRaceId} />
    </section>
  );
}

export default RaceAnalysisPage;
