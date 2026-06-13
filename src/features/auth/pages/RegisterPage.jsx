import React, { useState } from "react";
import { UserPlus } from "lucide-react";
import PanelHeader from "../../../components/ui/PanelHeader";
import { roles } from "../../../mocks/roles.mock";
import { DEFAULT_REGISTER_FORM } from "../authMock";
import { registerWithFallback } from "../authService";

function RegisterPage({ activateRole, setActivePage }) {
  const [form, setForm] = useState(DEFAULT_REGISTER_FORM);
  const [message, setMessage] = useState("Spectator becomes Active immediately. Other roles wait for Admin approval.");
  const [busy, setBusy] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    try {
      const result = await registerWithFallback(form);
      setMessage(result.message);
      activateRole(result.role, result.user);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="form-page">
      <PanelHeader
        kicker="Guest Registration"
        title="Create Account"
        description="Mapped to Account, UserProfiles, and JockeyProfile fields described in the RDS and txt file."
      />
      <form className="form-grid" onSubmit={submit}>
        <label className="field">
          <span>Full Name</span>
          <input value={form.fullName} onChange={(event) => setForm({ ...form, fullName: event.target.value })} />
        </label>
        <label className="field">
          <span>Phone</span>
          <input value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} />
        </label>
        <label className="field">
          <span>Email</span>
          <input value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} type="email" />
        </label>
        <label className="field">
          <span>Password</span>
          <input value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} type="password" />
        </label>
        <label className="field">
          <span>Requested Role</span>
          <select value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })}>
            {Object.keys(roles).map((roleKey) => (
              <option value={roleKey} key={roleKey}>
                {roles[roleKey]}
              </option>
            ))}
          </select>
        </label>
        {form.role === "Jockey" && (
          <>
            <label className="field">
              <span>Experience Years</span>
              <input type="number" min="0" placeholder="5" />
            </label>
            <label className="field">
              <span>Jockey Rating</span>
              <input type="number" min="0" max="5" step="0.01" placeholder="4.72" />
            </label>
          </>
        )}
        <div className="form-actions">
          <button className="primary-button" type="submit" disabled={busy}>
            <UserPlus size={18} />
            {busy ? "Creating..." : "Register"}
          </button>
          <button className="secondary-button" onClick={() => setActivePage("login")} type="button">
            Back to login
          </button>
        </div>
        <p className="form-note span-all">{message}</p>
      </form>
    </section>
  );
}

export default RegisterPage;
