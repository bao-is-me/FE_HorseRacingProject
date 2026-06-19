import React, { useState } from "react";
import { CalendarDays, CheckCircle2 } from "lucide-react";
import PanelHeader from "../../../components/ui/PanelHeader";
import { WorkspaceNotice } from "../../../components/ui/WorkspaceUI";
import { getRacecourseOptions, getTournamentOptions } from "../raceSelectors";

function RaceEditor() {
  const racecourses = getRacecourseOptions();
  const tournaments = getTournamentOptions();
  const [form, setForm] = useState({ tournamentId: tournaments[0]?.id || "", racecourseId: racecourses[0]?.id || "", raceNumber: "7", startTime: "2026-08-01T15:00", trackLength: "1800", maxParticipants: "10", grade: "Open" });
  const [notice, setNotice] = useState("");
  const update = (field) => (event) => setForm((current) => ({ ...current, [field]: event.target.value }));
  const save = () => {
    if (!form.raceNumber || !form.startTime) return setNotice("Race number and start time are required.");
    setNotice(`Race ${form.raceNumber} preview saved locally.`);
  };
  return <section className="panel workspace-form"><PanelHeader kicker="Admin Action" title="Create race preview" description="Complete the BE-aligned race fields. This remains local demo state." compact /><WorkspaceNotice tone={notice.includes("required") ? "warning" : "success"} onClose={() => setNotice("")}>{notice}</WorkspaceNotice><div className="workspace-form-grid"><label className="field"><span>Tournament</span><select value={form.tournamentId} onChange={update("tournamentId")}>{tournaments.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label><label className="field"><span>Racecourse</span><select value={form.racecourseId} onChange={update("racecourseId")}>{racecourses.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label><label className="field"><span>Race Number</span><input type="number" min="1" value={form.raceNumber} onChange={update("raceNumber")} /></label><label className="field"><span>Start Time</span><input type="datetime-local" value={form.startTime} onChange={update("startTime")} /></label><label className="field"><span>Track Length (m)</span><input type="number" value={form.trackLength} onChange={update("trackLength")} /></label><label className="field"><span>Max Participants</span><input type="number" min="1" value={form.maxParticipants} onChange={update("maxParticipants")} /></label><label className="field"><span>Grade</span><select value={form.grade} onChange={update("grade")}>{["G1", "G2", "G3", "Listed", "Open"].map((item) => <option key={item}>{item}</option>)}</select></label></div><button className="primary-button fit" type="button" onClick={save}><CalendarDays size={18} /> Save race preview</button></section>;
}
export default RaceEditor;
