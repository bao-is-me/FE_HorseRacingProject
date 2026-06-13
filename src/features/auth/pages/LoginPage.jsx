import React, { useState } from "react";
import { Activity, LogIn } from "lucide-react";
import MetricCard from "../../../components/ui/MetricCard";
import StatusPill from "../../../components/ui/StatusPill";
import DatabaseIcon from "../../../components/icons/DatabaseIcon";
import { roles } from "../../../mocks/roles.mock";
import { DEFAULT_LOGIN_FORM } from "../authMock";
import { loginWithFallback } from "../authService";

function LoginPage({ setSession, activateRole, setActivePage }) {
  const [form, setForm] = useState(DEFAULT_LOGIN_FORM);
  const [message, setMessage] = useState("Use backend login when API is running, or pick a demo role below.");
  const [busy, setBusy] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setMessage("Checking backend session...");
    try {
      const result = await loginWithFallback(form);
      setSession({ token: result.token, user: result.user });
      setMessage(result.message);
      activateRole(result.role, { ...result.user, token: result.token });
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="auth-layout">
      <div className="auth-visual">
        <StatusPill tone="live">Precision Performance Management</StatusPill>
        <h1>Horse Racing Tournament Management System</h1>
        <p>
          Role-based racing operations for spectators, horse owners, jockeys, referees, and tournament administrators.
        </p>
        <div className="auth-stats">
          <MetricCard label="Active races" value="4" icon={Activity} />
          <MetricCard label="Tracked entities" value="14" icon={DatabaseIcon} />
        </div>
      </div>
      <form className="auth-card" onSubmit={submit}>
        <div className="section-heading tight">
          <span>Guest Login</span>
          <h2>Welcome back</h2>
          <p>Backend endpoint: /api/Auth/login. Demo fallback is available for UI review.</p>
        </div>
        <label className="field">
          <span>Email</span>
          <input value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} type="email" required />
        </label>
        <label className="field">
          <span>Password</span>
          <input value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} type="password" required />
        </label>
        <label className="field">
          <span>Demo role fallback</span>
          <select value={form.demoRole} onChange={(event) => setForm({ ...form, demoRole: event.target.value })}>
            {Object.keys(roles).map((roleKey) => (
              <option value={roleKey} key={roleKey}>
                {roles[roleKey]}
              </option>
            ))}
          </select>
        </label>
        <button className="primary-button full" type="submit" disabled={busy}>
          <LogIn size={18} />
          {busy ? "Signing in..." : "Login"}
        </button>
        <p className="form-note">{message}</p>
        <button className="text-button" onClick={() => setActivePage("register")} type="button">
          Create a new account
        </button>
      </form>
    </section>
  );
}

export default LoginPage;
