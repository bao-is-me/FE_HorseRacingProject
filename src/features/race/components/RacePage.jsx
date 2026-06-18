import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowLeft, Gauge, PlayCircle, RotateCcw, Wifi, WifiOff } from "lucide-react";
import PanelHeader from "../../../components/ui/PanelHeader";
import StatusPill from "../../../components/ui/StatusPill";
import { statusTone } from "../../../utils/statusUtils";
import Leaderboard from "./Leaderboard";
import RaceCanvas from "./RaceCanvas";
import { useRaceConnection } from "../hooks/useRaceConnection";
import { isFinished, isLive, isPending, raceApi } from "../services/raceApi";

const START_ANGLE = Math.PI;
const TOTAL_LAPS = 2;
const FINISH_ANGLE = START_ANGLE + TOTAL_LAPS * Math.PI * 2;

const LANE_CONFIGS = [
  { coatColor: "#8B4513", shadeColor: "#5C2E0A", maneColor: "#3d1f08", jockeyColor: "#C0392B", helmetColor: "#ffffff", lane: 0, baseSpeed: 0.24, variance: 0.03 },
  { coatColor: "#333333", shadeColor: "#111111", maneColor: "#111111", jockeyColor: "#8E44AD", helmetColor: "#E8D5FF", lane: 1, baseSpeed: 0.23, variance: 0.04 },
  { coatColor: "#C8A030", shadeColor: "#8a6c18", maneColor: "#5a4010", jockeyColor: "#D4AC0D", helmetColor: "#222222", lane: 2, baseSpeed: 0.235, variance: 0.025 },
  { coatColor: "#9E9E6E", shadeColor: "#6a6a45", maneColor: "#3a3a28", jockeyColor: "#1A7A3A", helmetColor: "#A9DFBF", lane: 3, baseSpeed: 0.225, variance: 0.045 },
  { coatColor: "#704214", shadeColor: "#3d2008", maneColor: "#200a00", jockeyColor: "#1A5276", helmetColor: "#AED6F1", lane: 4, baseSpeed: 0.23, variance: 0.035 },
  { coatColor: "#AAAAAA", shadeColor: "#686868", maneColor: "#484848", jockeyColor: "#5D6D7E", helmetColor: "#E74C3C", lane: 5, baseSpeed: 0.22, variance: 0.03 }
];

const DEMO_HORSES = [
  { id: "demo-horse-1", name: "Midnight Rider", jockeyName: "J. Smith", ...LANE_CONFIGS[0] },
  { id: "demo-horse-2", name: "Crimson Thunder", jockeyName: "M. Garcia", ...LANE_CONFIGS[1] },
  { id: "demo-horse-3", name: "Golden Arrow", jockeyName: "T. Lee", ...LANE_CONFIGS[2] },
  { id: "demo-horse-4", name: "Storm Chaser", jockeyName: "R. Brown", ...LANE_CONFIGS[3] },
  { id: "demo-horse-5", name: "Iron Duke", jockeyName: "K. Davis", ...LANE_CONFIGS[4] },
  { id: "demo-horse-6", name: "Silver Bullet", jockeyName: "P. Wilson", ...LANE_CONFIGS[5] }
];

function mapHorsesToConfig(apiHorses) {
  const horses = apiHorses.length ? apiHorses : [];
  return horses.slice(0, 6).map((horse, index) => ({
    id: horse.id,
    name: horse.horseName,
    jockeyName: horse.breed,
    ...LANE_CONFIGS[index]
  }));
}

function statusLabel(status) {
  if (status === "BettingOpen") return "Betting Open";
  if (status === "BettingClosed") return "Betting Closed";
  if (status === "Completed") return "Completed";
  return status || "Demo";
}

function useDemoRaceData(horses, enabled, speedMultiplier, seed) {
  const [liveData, setLiveData] = useState(null);

  useEffect(() => {
    if (!enabled || !horses.length) {
      setLiveData(null);
      return undefined;
    }

    let tick = 0;
    const angles = new Map(horses.map((horse) => [horse.id, START_ANGLE]));
    const finished = new Set();

    const interval = setInterval(() => {
      tick += 1;
      const states = horses.map((horse) => {
        if (!finished.has(horse.id)) {
          const current = angles.get(horse.id) ?? START_ANGLE;
          const noise = (Math.sin((tick + horse.lane * 17) / 11) + Math.cos((tick + horse.lane * 7) / 9)) * horse.variance;
          const next = Math.min(current + Math.max(0.12, horse.baseSpeed + noise) * 0.055 * speedMultiplier, FINISH_ANGLE);
          angles.set(horse.id, next);
          if (next >= FINISH_ANGLE) finished.add(horse.id);
        }

        const angle = angles.get(horse.id) ?? START_ANGLE;
        return {
          id: horse.id,
          angle,
          speed: horse.baseSpeed + Math.sin((tick + horse.lane) / 8) * horse.variance,
          lap: Math.min(Math.floor((angle - START_ANGLE) / (Math.PI * 2)), TOTAL_LAPS - 1),
          isFinished: angle >= FINISH_ANGLE
        };
      });

      setLiveData({
        raceId: seed || "demo-race",
        tick,
        status: finished.size === horses.length ? "Finished" : "Live",
        horses: states
      });
    }, 90);

    return () => clearInterval(interval);
  }, [enabled, horses, speedMultiplier, seed]);

  return liveData;
}

function useRaceReplayData(horses, results, enabled, speedMultiplier, seed, onComplete) {
  const [replayData, setReplayData] = useState(null);

  useEffect(() => {
    setReplayData(null);
  }, [seed]);

  useEffect(() => {
    if (!enabled || !horses.length || !results.length) {
      return undefined;
    }

    const startedAt = performance.now();
    let frameId = 0;
    const resultByHorseId = new Map(results.map((result) => [result.horse.id, result]));
    const finishTimes = results.map((result) => result.finishTime || result.position * 1000);
    const minFinishTime = Math.min(...finishTimes);
    const maxFinishTime = Math.max(...finishTimes);
    const finishSpread = Math.max(maxFinishTime - minFinishTime, 1);
    const baseDuration = 5600;
    const spreadDuration = 1400;

    function frame(now) {
      const elapsed = (now - startedAt) * speedMultiplier;
      let allFinished = true;

      const states = horses.map((horse, index) => {
        const result = resultByHorseId.get(horse.id);
        const rawFinishTime = result?.finishTime || (maxFinishTime || 120000) + (index + 1) * 2500;
        const finishAt = baseDuration + ((rawFinishTime - minFinishTime) / finishSpread) * spreadDuration;
        const progress = Math.min(elapsed / finishAt, 1);
        const easedProgress = progress < 1 ? 1 - Math.pow(1 - progress, 2) : 1;
        const angle = START_ANGLE + easedProgress * (FINISH_ANGLE - START_ANGLE);

        if (progress < 1) allFinished = false;

        return {
          id: horse.id,
          angle,
          speed: horse.baseSpeed + Math.max(0, 1 - progress) * 0.16,
          lap: Math.min(Math.floor((angle - START_ANGLE) / (Math.PI * 2)), TOTAL_LAPS - 1),
          isFinished: progress >= 1
        };
      });

      setReplayData({
        raceId: seed || "replay-race",
        tick: Math.round(elapsed / 100),
        status: allFinished ? "Finished" : "Live",
        horses: states
      });

      if (allFinished) {
        onComplete?.();
        return;
      }

      frameId = requestAnimationFrame(frame);
    }

    frameId = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(frameId);
  }, [enabled, horses, onComplete, results, seed, speedMultiplier]);

  return replayData;
}

function buildFallbackResults(horses) {
  return horses.map((horse, index) => ({
    position: index + 1,
    horse: {
      id: horse.id,
      horseName: horse.name,
      breed: horse.jockeyName,
      color: horse.coatColor,
      age: 4 + index
    },
    finishTime: 118000 + index * 4200,
    finishedAt: new Date(Date.now() + 118000 + index * 4200).toISOString()
  }));
}

function RacePage({ raceId, onBack }) {
  const demoMode = !raceId;
  const [race, setRace] = useState(null);
  const [apiHorses, setApiHorses] = useState([]);
  const [results, setResults] = useState([]);
  const [speedMultiplier, setSpeedMultiplier] = useState(2);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [replaying, setReplaying] = useState(false);

  const { connected, liveData, connect, disconnect } = useRaceConnection();

  const loadRace = useCallback(async () => {
    if (!raceId) {
      setRace(null);
      setApiHorses([]);
      setResults([]);
      setReplaying(false);
      return;
    }

    setLoading(true);
    setError("");
    setReplaying(false);
    try {
      const [raceData, horseData] = await Promise.all([raceApi.getRace(raceId), raceApi.getHorses(raceId).catch(() => [])]);
      setRace(raceData);
      setApiHorses(horseData);

      if (isFinished(raceData.status)) {
        setResults(await raceApi.getResults(raceId).catch(() => []));
      } else {
        setResults([]);
      }
    } catch (loadError) {
      setError(loadError.message || "Unable to load race.");
    } finally {
      setLoading(false);
    }
  }, [raceId]);

  useEffect(() => {
    loadRace();
  }, [loadRace]);

  useEffect(() => {
    if (!raceId) return undefined;
    connect(raceId);
    return () => {
      disconnect();
    };
  }, [connect, disconnect, raceId]);

  const horses = useMemo(() => {
    const mapped = mapHorsesToConfig(apiHorses);
    return mapped.length ? mapped : DEMO_HORSES;
  }, [apiHorses]);

  const shouldSimulate = demoMode || (!connected && !isFinished(race?.status));
  const demoLiveData = useDemoRaceData(horses, shouldSimulate, speedMultiplier, raceId);
  const stopReplay = useCallback(() => setReplaying(false), []);
  const replayResults = useMemo(() => {
    if (results.length) return results;
    if (["Finished", "Completed"].includes(race?.status)) return buildFallbackResults(horses);
    return [];
  }, [horses, race?.status, results]);
  const replayLiveData = useRaceReplayData(
    horses,
    replayResults,
    replaying,
    speedMultiplier,
    raceId,
    stopReplay
  );
  const effectiveLiveData = replayLiveData || liveData || demoLiveData;
  const currentStatus = race?.status || effectiveLiveData?.status || "Live";
  const canReplay = ["Finished", "Completed"].includes(race?.status) && replayResults.length > 0;

  const liveStates = useMemo(() => {
    const states = {};
    effectiveLiveData?.horses?.forEach((horse) => {
      states[horse.id] = horse;
    });
    return states;
  }, [effectiveLiveData]);

  const title = race ? `Race ${race.raceNumber} - ${race.racecourseName}` : "Demo race simulation";
  const description = race
    ? `${race.trackLength}m - ${race.location}${race.tournament?.tournamentName ? ` - ${race.tournament.tournamentName}` : ""}`
    : "Offline race simulation with mock horses, live track movement, and leaderboard projection.";

  return (
    <section className="race-live-panel">
      <div className="race-live-header">
        <div className="race-title-block">
          {onBack && (
            <button className="text-button race-back-button" type="button" onClick={onBack}>
              <ArrowLeft size={16} />
              Race list
            </button>
          )}
          <PanelHeader kicker="Live Simulation" title={title} description={description} compact />
        </div>
        <div className="race-live-actions">
          <StatusPill tone={statusTone(currentStatus)}>{statusLabel(currentStatus)}</StatusPill>
          <span className={`race-connection ${connected ? "online" : "offline"}`}>
            {connected ? <Wifi size={15} /> : <WifiOff size={15} />}
            {connected ? "Connected" : "Demo fallback"}
          </span>
          <button className="secondary-button" type="button" onClick={loadRace} disabled={loading}>
            <RotateCcw size={16} />
            Refresh
          </button>
          {canReplay && (
            <button className="secondary-button race-replay-button" type="button" onClick={() => setReplaying(true)} disabled={replaying}>
              <PlayCircle size={16} />
              {replaying ? "Replaying" : "Replay"}
            </button>
          )}
        </div>
      </div>

      {error && <div className="race-analysis-alert">{error}</div>}

      <div className="race-live-grid">
        <div className="race-simulation-column">
          <div className="race-simulation-shell">
            <RaceCanvas horses={horses} liveData={effectiveLiveData} />
          </div>

          <div className="race-control-strip">
            <span>
              <Gauge size={16} />
              {replaying
                ? "Replay running"
                : isLive(currentStatus)
                  ? "Race is running"
                  : isPending(currentStatus)
                    ? "Waiting for start"
                    : "Race complete"}
            </span>
            <label>
              Speed
              <input
                type="range"
                min="1"
                max="8"
                step="1"
                value={speedMultiplier}
                onChange={(event) => setSpeedMultiplier(Number(event.target.value))}
              />
              <strong>{speedMultiplier}x</strong>
            </label>
          </div>
        </div>

        <aside className="race-statistics-column">
          <PanelHeader kicker="Race Statistics" title="Leaderboard" description="Realtime position, lap, pace, and distance gap." compact />
          <Leaderboard horses={horses} liveStates={liveStates} results={replayResults} finished={isFinished(currentStatus)} />
        </aside>
      </div>
    </section>
  );
}

export default RacePage;
