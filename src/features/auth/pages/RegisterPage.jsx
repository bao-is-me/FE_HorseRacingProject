import React, { useState } from "react";
import { Activity, UserPlus } from "lucide-react";
import MetricCard from "../../../components/ui/MetricCard";
import StatusPill from "../../../components/ui/StatusPill";
import DatabaseIcon from "../../../components/icons/DatabaseIcon";
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
    <div className="auth-content-canvas register-content-canvas">
      <section className="auth-layout register-layout">
        <div className="auth-form-column register-form-column">
          <form className="auth-card register-card" onSubmit={submit}>
            <div className="section-heading tight">
              <span>Guest Registration</span>
              <h2>Create Account</h2>
              <p>Sign up to join races, tournaments, and role-based workflows.</p>
            </div>
            <div className="register-form-grid">
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
              <label className="field span-all">
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
            </div>
            <div className="form-actions">
              <button className="primary-button" type="submit" disabled={busy}>
                <UserPlus size={18} />
                {busy ? "Creating..." : "Register"}
              </button>
              <button className="secondary-button" onClick={() => setActivePage("login")} type="button">
                Back to login
              </button>
            </div>
            <p className="form-note">{message}</p>
          </form>
        </div>
        <div className="auth-visual register-visual">
          <StatusPill tone="live">New Racing Identity</StatusPill>
          <h1>Join the Horse Racing Management System</h1>
          <p>Create a demo account for spectator access or request approval for operational racing roles.</p>
          <div className="auth-stats">
            <MetricCard label="Active races" value="4" icon={Activity} description="Live races in progress" />
            <MetricCard label="Tracked entities" value="14" icon={DatabaseIcon} description="Horses & participants" />
          </div>
        </div>
      </section>
    </div>
  );
}

export default RegisterPage;
