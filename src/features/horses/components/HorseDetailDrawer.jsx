import React from "react";
import { CalendarDays, MapPin, Trophy, UserRound, X } from "lucide-react";
import StatusPill from "../../../components/ui/StatusPill";
import { demoAccounts } from "../../../mocks/accounts.mock";
import { prizes } from "../../../mocks/results.mock";
import { racecourses, races, registrations } from "../../../mocks/races.mock";
import { tournaments } from "../../../mocks/tournaments.mock";
import { formatCurrency, formatDateTime } from "../../../utils/formatters";
import { getActivityStatusTone, getHorseStatusTone } from "../horseConstants";
import HorseImage from "./HorseImage";

function HorseDetailDrawer({ horse, onClose }) {
  if (!horse) return null;
  const owner = demoAccounts.find((account) => account.id === horse.ownerId);
  const entries = registrations.filter((entry) => entry.horseId === horse.id);
  const rewards = entries.flatMap((entry) => prizes.filter((prize) => prize.registrationId === entry.id));
  const totalRewards = rewards.reduce((total, reward) => total + (reward.amount || 0), 0);

  return (
    <div className="horse-overlay drawer-overlay" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <aside className="horse-drawer" role="dialog" aria-modal="true" aria-labelledby="horse-detail-title">
        <header className="horse-drawer-hero">
          <HorseImage src={horse.imageUrl} alt={horse.horseName} size="hero" />
          <div>
            <span>Horse detail</span>
            <h2 id="horse-detail-title">{horse.horseName}</h2>
            <p>{horse.breed || "Breed not provided"} · {horse.color || "Color not provided"} · {horse.age ?? "—"} years</p>
            <div className="horse-status-row">
              <StatusPill tone={getHorseStatusTone(horse.status)}>{horse.status || "Unknown"}</StatusPill>
              <StatusPill tone={getActivityStatusTone(horse.derivedStatus)}>{horse.derivedStatus || horse.status || "Unknown"}</StatusPill>
            </div>
          </div>
          <button className="icon-button" type="button" onClick={onClose} aria-label="Close details"><X size={20} /></button>
        </header>

        <div className="horse-detail-content">
          <section>
            <h3>Overview</h3>
            <dl className="horse-detail-grid">
              <div><dt>Horse ID</dt><dd>{horse.id}</dd></div>
              <div><dt>Owner ID</dt><dd>{horse.ownerId}</dd></div>
              <div><dt>Weight</dt><dd>{horse.weight != null ? `${horse.weight} kg` : "—"}</dd></div>
              <div><dt>Record wins</dt><dd>{horse.recordWins ?? 0}</dd></div>
              <div><dt>Created at</dt><dd>{formatDateTime(horse.createAt)}</dd></div>
              <div><dt>Updated at</dt><dd>{formatDateTime(horse.updatedAt)}</dd></div>
            </dl>
          </section>

          <section>
            <h3><UserRound size={17} /> Owner</h3>
            <div className="horse-owner-card">
              <strong>{owner?.fullName || "Owner information unavailable"}</strong>
              <span>{owner?.email || horse.ownerId}</span>
              {owner?.phone && <small>{owner.phone}</small>}
            </div>
          </section>

          <section>
            <h3><CalendarDays size={17} /> Registrations & schedule</h3>
            <div className="horse-relation-list">
              {entries.length ? entries.map((entry) => {
                const race = races.find((item) => item.id === entry.raceId);
                const racecourse = racecourses.find((item) => item.id === race?.racecourseId);
                const tournament = tournaments.find((item) => item.id === race?.tournamentId);
                const jockey = demoAccounts.find((item) => item.id === entry.jockeyId);
                return (
                  <article key={entry.id}>
                    <div><strong>Race {race?.raceNumber}</strong><StatusPill tone="warning">{entry.status}</StatusPill></div>
                    <p>{tournament?.tournamentName || "Tournament unavailable"}</p>
                    <small><MapPin size={13} /> {racecourse?.racecourseName || "Racecourse unavailable"} · Gate {entry.gateNumber ?? "—"}</small>
                    <small>Jockey: {jockey?.fullName || entry.jockeyId} · {formatDateTime(race?.startTime)}</small>
                    <small>Owner: {entry.ownerConfirmation ? "Confirmed" : "Pending"} · Jockey: {entry.jockeyConfirmation ? "Confirmed" : "Pending"}</small>
                  </article>
                );
              }) : <p className="horse-empty-copy">No registrations found for this horse.</p>}
            </div>
          </section>

          <section>
            <h3><Trophy size={17} /> Rewards</h3>
            <div className="horse-reward-summary">
              <div><span>Total rewards</span><strong>{formatCurrency(totalRewards)}</strong></div>
              <div><span>Reward count</span><strong>{rewards.length}</strong></div>
            </div>
            <div className="horse-relation-list">
              {rewards.map((reward) => <article key={reward.id}><div><strong>{reward.prizeType}</strong><b>{formatCurrency(reward.amount)}</b></div><small>{reward.distributedAt ? formatDateTime(reward.distributedAt) : "Not distributed"}</small></article>)}
            </div>
          </section>
        </div>
      </aside>
    </div>
  );
}

export default HorseDetailDrawer;
