import React, { useMemo, useState } from "react";
import { CalendarDays, CheckCircle2, ClipboardCheck, Flag, UserRound } from "lucide-react";
import PanelHeader from "../../../components/ui/PanelHeader";
import StatusPill from "../../../components/ui/StatusPill";
import { formatDateTime } from "../../../utils/formatters";
import { buildRegistrationPayload, isRegistrationGateTaken } from "../../../domain";
import HorseImage from "../components/HorseImage";
import { getHorseRegistrationContext } from "../horseSelectors";
import "./horseManagement.css";

function RegisterHorsePage({ user }) {
  const ownerId = user?.id;
  const context = useMemo(() => getHorseRegistrationContext(ownerId), [ownerId]);
  const { horses: eligibleHorses, races: eligibleRaces, jockeys, registrations } = context;
  const [form, setForm] = useState({
    raceId: eligibleRaces[0]?.id || "",
    horseId: eligibleHorses[0]?.id || "",
    jockeyId: jockeys[0]?.id || "",
    gateNumber: ""
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");

  const selectedRace = eligibleRaces.find((race) => race.id === form.raceId);
  const selectedHorse = eligibleHorses.find((horse) => horse.id === form.horseId);
  const selectedJockey = jockeys.find((jockey) => jockey.id === form.jockeyId);

  const update = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setSuccess("");
  };

  const submit = (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (!form.raceId) nextErrors.raceId = "Select a Scheduled race.";
    if (!form.horseId) nextErrors.horseId = "Select an eligible horse.";
    if (!form.jockeyId) nextErrors.jockeyId = "Jockey is required by RegisterHorseToRaceRequest.";
    if (form.gateNumber && Number(form.gateNumber) < 1) nextErrors.gateNumber = "Gate number must be greater than zero.";
    if (isRegistrationGateTaken(registrations, form.raceId, form.gateNumber)) {
      nextErrors.gateNumber = "This gate is already used in the selected race.";
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    const payload = buildRegistrationPayload(form);

    setSuccess(`${selectedHorse?.name} is ready to be submitted for Race ${selectedRace?.raceNumber}. Status will be created as Pending by BE.`);
    console.info("Registration mock payload", payload);
  };

  return (
    <section className="page-stack horse-register-page">
      <PanelHeader
        kicker="Register Horse for Race"
        title="Create race entry"
        description="Choose a Scheduled race, one eligible owned horse, a Jockey, and an optional gate number."
      />

      <div className="horse-register-layout">
        <form className="panel horse-register-form" onSubmit={submit}>
          <div className="horse-form-section-title"><Flag size={19} /><div><strong>Race assignment</strong><span>RaceId is sent in the request route.</span></div></div>
          <label className="field span-all">
            <span>Race *</span>
            <select value={form.raceId} onChange={update("raceId")}>
              <option value="">Select a Scheduled race</option>
              {eligibleRaces.map((race) => <option key={race.id} value={race.id}>Race {race.raceNumber} — {formatDateTime(race.startTime)}</option>)}
            </select>
            {errors.raceId && <em>{errors.raceId}</em>}
          </label>

          <div className="horse-form-section-title"><ClipboardCheck size={19} /><div><strong>Entry details</strong><span>Fields match RegisterHorseToRaceRequest.</span></div></div>
          <div className="form-grid">
            <label className="field">
              <span>Horse *</span>
              <select value={form.horseId} onChange={update("horseId")}>
                <option value="">Select your horse</option>
                {eligibleHorses.map((horse) => <option key={horse.id} value={horse.id}>{horse.name} — {horse.status}</option>)}
              </select>
              {errors.horseId && <em>{errors.horseId}</em>}
            </label>
            <label className="field">
              <span>Jockey *</span>
              <select value={form.jockeyId} onChange={update("jockeyId")}>
                <option value="">Select an active Jockey</option>
                {jockeys.map((jockey) => <option key={jockey.id} value={jockey.id}>{jockey.name}</option>)}
              </select>
              {errors.jockeyId && <em>{errors.jockeyId}</em>}
            </label>
            <label className="field">
              <span>Gate Number</span>
              <input type="number" min="1" value={form.gateNumber} onChange={update("gateNumber")} placeholder="Optional" />
              {errors.gateNumber && <em>{errors.gateNumber}</em>}
            </label>
            <div className="horse-managed-status">
              <span>Registration Status</span>
              <StatusPill>Pending</StatusPill>
              <small>Managed by BE; not submitted as a form field.</small>
            </div>
          </div>

          {success && <div className="horse-register-success"><CheckCircle2 size={18} /><span>{success}</span></div>}
          <button className="primary-button horse-register-submit" type="submit"><ClipboardCheck size={18} /> Register entry</button>
        </form>

        <aside className="panel horse-entry-preview">
          <span className="horse-preview-kicker">Entry preview</span>
          {selectedHorse ? (
            <>
              <div className="horse-preview-horse">
                <HorseImage src={selectedHorse.imageUrl} alt={selectedHorse.name} size="hero" />
                <div><h3>{selectedHorse.name}</h3><p>{selectedHorse.breed} · {selectedHorse.age} years</p><StatusPill>{selectedHorse.status}</StatusPill></div>
              </div>
              <dl className="horse-entry-facts">
                <div><dt><CalendarDays size={15} /> Race</dt><dd>{selectedRace ? `Race ${selectedRace.raceNumber}` : "Not selected"}</dd></div>
                <div><dt>Tournament</dt><dd>{selectedRace?.tournament?.name || "—"}</dd></div>
                <div><dt>Racecourse</dt><dd>{selectedRace?.racecourseName || "—"}</dd></div>
                <div><dt><UserRound size={15} /> Jockey</dt><dd>{selectedJockey?.name || "Not selected"}</dd></div>
                <div><dt>Gate</dt><dd>{form.gateNumber || "Assigned later"}</dd></div>
              </dl>
              <p className="horse-entry-note">Only Healthy or Resting horses are available here. Injury and Retired horses are excluded according to HorseStatusPolicy.</p>
            </>
          ) : <p className="horse-empty-copy">No eligible owned horse is available.</p>}
        </aside>
      </div>
    </section>
  );
}

export default RegisterHorsePage;
