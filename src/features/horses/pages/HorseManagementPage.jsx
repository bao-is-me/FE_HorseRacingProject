import React, { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Eye, Pencil, Plus, Search, Trash2 } from "lucide-react";
import PanelHeader from "../../../components/ui/PanelHeader";
import StatusPill from "../../../components/ui/StatusPill";
import { horses as initialHorses, DEFAULT_OWNER_ID } from "../../../mocks/horses.mock";
import { races, registrations } from "../../../mocks/races.mock";
import HorseDetailDrawer from "../components/HorseDetailDrawer";
import HorseFormModal from "../components/HorseFormModal";
import HorseImage from "../components/HorseImage";
import { getActivityStatusTone, getHorseStatusTone, HORSE_STATUSES } from "../horseConstants";
import "./horseManagement.css";

const PAGE_SIZE = 6;

function deriveHorseStatus(horse) {
  const horseEntries = registrations.filter((entry) => entry.horseId === horse.id && entry.status === "Confirmed");
  if (horseEntries.some((entry) => {
    const race = races.find((item) => item.id === entry.raceId);
    return race?.status === "Live";
  })) return "Racing";
  if (horseEntries.some((entry) => {
    const race = races.find((item) => item.id === entry.raceId);
    return ["Scheduled", "BettingOpen", "BettingClosed"].includes(race?.status);
  })) return "Registered";
  return horse.status;
}

function buildHorse(horse) {
  return { ...horse, derivedStatus: horse.derivedStatus || deriveHorseStatus(horse) };
}

function HorseManagementPage({ ownerOnly = false, user, embedded = false }) {
  const ownerId = user?.id || DEFAULT_OWNER_ID;
  const [horseList, setHorseList] = useState(() => initialHorses.map(buildHorse));
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [breed, setBreed] = useState("All");
  const [color, setColor] = useState("All");
  const [page, setPage] = useState(1);
  const [formState, setFormState] = useState(null);
  const [selectedHorse, setSelectedHorse] = useState(null);
  const [notice, setNotice] = useState("");

  const scopedHorses = useMemo(
    () => ownerOnly ? horseList.filter((horse) => horse.ownerId === ownerId || horse.ownerId === DEFAULT_OWNER_ID) : horseList,
    [horseList, ownerOnly, ownerId]
  );
  const breeds = useMemo(() => [...new Set(scopedHorses.map((horse) => horse.breed).filter(Boolean))].sort(), [scopedHorses]);
  const colors = useMemo(() => [...new Set(scopedHorses.map((horse) => horse.color).filter(Boolean))].sort(), [scopedHorses]);
  const filteredHorses = useMemo(() => scopedHorses.filter((horse) => {
    const term = search.trim().toLowerCase();
    const matchesSearch = !term || [horse.horseName, horse.breed, horse.color, horse.status]
      .some((value) => String(value || "").toLowerCase().includes(term));
    return matchesSearch
      && (status === "All" || horse.status === status)
      && (breed === "All" || horse.breed === breed)
      && (color === "All" || horse.color === color);
  }), [scopedHorses, search, status, breed, color]);

  const totalPages = Math.max(1, Math.ceil(filteredHorses.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const visibleHorses = embedded
    ? scopedHorses.slice(0, 3)
    : filteredHorses.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const resetPage = (setter) => (event) => {
    setter(event.target.value);
    setPage(1);
  };

  const saveHorse = (values) => {
    const now = new Date().toISOString();
    if (formState?.mode === "edit") {
      setHorseList((current) => current.map((horse) => horse.id === formState.horse.id
        ? {
            ...horse,
            horseName: values.horseName,
            age: values.age,
            breed: values.breed,
            weight: values.weight,
            status: values.status,
            recordWins: values.recordWins,
            color: values.color,
            derivedStatus: values.status,
            updatedAt: now
          }
        : horse));
      setNotice(`${values.horseName} was updated in the FE demo state.`);
    } else {
      const created = buildHorse({
        id: globalThis.crypto?.randomUUID?.() || `horse-${Date.now()}`,
        ownerId: ownerOnly ? ownerId : values.ownerId,
        horseName: values.horseName,
        age: values.age,
        breed: values.breed,
        weight: values.weight,
        status: values.status,
        recordWins: values.recordWins,
        color: values.color,
        imageUrl: values.imageUrl,
        createAt: now,
        updatedAt: now
      });
      setHorseList((current) => [created, ...current]);
      setNotice(`${created.horseName} was added to the FE demo state.`);
      setPage(1);
    }
    setFormState(null);
  };

  const removeHorse = (horse) => {
    if (!window.confirm(`Delete ${horse.horseName} from the FE demo list?`)) return;
    setHorseList((current) => current.filter((item) => item.id !== horse.id));
    setNotice(`${horse.horseName} was removed from the FE demo state.`);
    if (selectedHorse?.id === horse.id) setSelectedHorse(null);
  };

  const horseTable = (
    <div className="horse-table-wrap">
      <table className="horse-table">
        <thead>
          <tr>
            <th>Horse</th>
            <th>Information</th>
            <th>Weight</th>
            <th>Wins</th>
            <th>Health</th>
            <th>Activity</th>
            {!embedded && <th aria-label="Actions" />}
          </tr>
        </thead>
        <tbody>
          {visibleHorses.map((horse) => (
            <tr key={horse.id}>
              <td>
                <button className="horse-name-cell" type="button" onClick={() => setSelectedHorse(horse)}>
                  <HorseImage src={horse.imageUrl} alt={horse.horseName} />
                  <span><strong>{horse.horseName}</strong><small>ID: {horse.id}</small></span>
                </button>
              </td>
              <td><strong>{horse.breed || "—"}</strong><small>{horse.age ?? "—"} years · {horse.color || "—"}</small></td>
              <td>{horse.weight != null ? `${horse.weight} kg` : "—"}</td>
              <td><strong>{horse.recordWins ?? 0}</strong></td>
              <td><StatusPill tone={getHorseStatusTone(horse.status)}>{horse.status || "Unknown"}</StatusPill></td>
              <td><StatusPill tone={getActivityStatusTone(horse.derivedStatus)}>{horse.derivedStatus || horse.status || "Unknown"}</StatusPill></td>
              {!embedded && (
                <td>
                  <div className="horse-row-actions">
                    <button type="button" onClick={() => setSelectedHorse(horse)} aria-label={`View ${horse.horseName}`}><Eye size={17} /></button>
                    <button type="button" onClick={() => setFormState({ mode: "edit", horse })} aria-label={`Edit ${horse.horseName}`}><Pencil size={17} /></button>
                    <button className="danger" type="button" onClick={() => removeHorse(horse)} aria-label={`Delete ${horse.horseName}`}><Trash2 size={17} /></button>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {!visibleHorses.length && <div className="horse-empty">No horses match the current filters.</div>}
    </div>
  );

  if (embedded) {
    return (
      <section className="panel horse-embedded">
        <PanelHeader kicker={ownerOnly ? "My Horse Management" : "Horse Management"} title="Horse roster" description="Health and current race activity at a glance." compact />
        {horseTable}
        <HorseDetailDrawer horse={selectedHorse} onClose={() => setSelectedHorse(null)} />
      </section>
    );
  }

  const start = filteredHorses.length ? (safePage - 1) * PAGE_SIZE + 1 : 0;
  const end = Math.min(safePage * PAGE_SIZE, filteredHorses.length);

  return (
    <section className="page-stack horse-management-page">
      <div className="horse-page-header">
        <PanelHeader
          kicker={ownerOnly ? "My Horse Management" : "Admin Horse Management"}
          title={ownerOnly ? "My stable" : "All registered horses"}
          description="Manage identity, health, performance, images, ownership, and race activity."
        />
        <button className="primary-button horse-add-button" type="button" onClick={() => setFormState({ mode: "create" })}>
          <Plus size={18} /> Add Horse
        </button>
      </div>

      {notice && <div className="horse-notice"><span>{notice}</span><button type="button" onClick={() => setNotice("")}>Dismiss</button></div>}

      <section className="panel horse-directory">
        <div className="horse-toolbar">
          <label className="horse-search">
            <Search size={18} />
            <input value={search} onChange={resetPage(setSearch)} placeholder="Search name, breed, color or status..." />
          </label>
          <label><span>Status</span><select value={status} onChange={resetPage(setStatus)}><option>All</option>{HORSE_STATUSES.map((item) => <option key={item}>{item}</option>)}</select></label>
          <label><span>Breed</span><select value={breed} onChange={resetPage(setBreed)}><option>All</option>{breeds.map((item) => <option key={item}>{item}</option>)}</select></label>
          <label><span>Color</span><select value={color} onChange={resetPage(setColor)}><option>All</option>{colors.map((item) => <option key={item}>{item}</option>)}</select></label>
        </div>

        {horseTable}

        <footer className="horse-pagination">
          <span>Showing {start}–{end} of {filteredHorses.length} horses</span>
          <div>
            <button type="button" disabled={safePage <= 1} onClick={() => setPage((current) => Math.max(1, current - 1))}><ChevronLeft size={16} /> Previous</button>
            <strong>{safePage} / {totalPages}</strong>
            <button type="button" disabled={safePage >= totalPages} onClick={() => setPage((current) => Math.min(totalPages, current + 1))}>Next <ChevronRight size={16} /></button>
          </div>
        </footer>
      </section>

      <HorseFormModal
        open={Boolean(formState)}
        mode={formState?.mode}
        horse={formState?.horse}
        ownerOnly={ownerOnly}
        user={user}
        onClose={() => setFormState(null)}
        onSubmit={saveHorse}
      />
      <HorseDetailDrawer horse={selectedHorse} onClose={() => setSelectedHorse(null)} />
    </section>
  );
}

export default HorseManagementPage;
