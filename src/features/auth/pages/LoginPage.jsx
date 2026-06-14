import React, { useState } from "react";
import { Activity, Bike, Home, LogIn, ShieldCheck, UserRound, UsersRound } from "lucide-react";
import MetricCard from "../../../components/ui/MetricCard";
import StatusPill from "../../../components/ui/StatusPill";
import DatabaseIcon from "../../../components/icons/DatabaseIcon";
import { roles } from "../../../mocks/roles.mock";
import { USE_MOCK_DATA } from "../../../services/apiClient";
import { DEFAULT_LOGIN_FORM } from "../authMock";
import { loginWithFallback } from "../authService";

const demoRoleLabels = {
  Spectator: "Spectator",
  HorseOwner: "Owner",
  Jockey: "Jockey",
  Referee: "Referee",
  Admin: "Admin"
};

const demoRoleOrder = ["Spectator", "HorseOwner", "Jockey", "Referee", "Admin"];

const demoRoleIcons = {
  Spectator: UsersRound,
  HorseOwner: Home,
  Jockey: Bike,
  Referee: ShieldCheck,
  Admin: UserRound
};

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
    <div className="auth-content-canvas">
      <section className="auth-layout">
        <div className="auth-visual">
          <StatusPill tone="live">Precision Performance Management</StatusPill>
          <h1>Horse Racing Tournament Management System</h1>
          <p>
            Role-based racing operations for spectators, horse owners, jockeys, referees, and tournament administrators.
          </p>
          <div className="auth-stats">
            <MetricCard label="Active races" value="4" icon={Activity} description="Live races in progress" />
            <MetricCard label="Tracked entities" value="14" icon={DatabaseIcon} description="Horses & participants" />
          </div>
        </div>
        <div className="auth-form-column">
          <form className="auth-card" onSubmit={submit}>
            <div className="section-heading tight">
              <span>Guest Login</span>
              <h2>Welcome back</h2>
              <p>Sign in to continue</p>
            </div>
            <label className="field">
              <span>Email</span>
              <input value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} type="email" required />
            </label>
            <label className="field">
              <span>Password</span>
              <input value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} type="password" required />
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

        </div>
      </section>

      {USE_MOCK_DATA && (
        <div className="auth-demo-dock">
          <div className="demo-access">
            <div className="demo-divider" />
            <span>Demo access:</span>
            <div className="demo-role-grid">
              {demoRoleOrder.map((roleKey) => {
                const DemoIcon = demoRoleIcons[roleKey];
                return (
                  <button
                    className={`demo-role-button ${form.demoRole === roleKey ? "active" : ""}`}
                    key={roleKey}
                    onClick={() => setForm({ ...form, demoRole: roleKey })}
                    type="button"
                  >
                    <DemoIcon size={14} />
                    {demoRoleLabels[roleKey] || roles[roleKey]}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LoginPage;
