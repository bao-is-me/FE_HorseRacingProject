import { demoAccounts } from "../../mocks/accounts.mock";
import { roles } from "../../mocks/roles.mock";
import { decodeJwt, request, setAuthToken } from "../../services/apiClient";
import { normalizeRole } from "../../utils/roleUtils";
import { DEFAULT_LOGIN_FORM, getRegisteredDemoUser } from "./authMock";

export async function loginWithBackend(payload) {
  return request("/api/Auth/login", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export async function registerWithBackend(payload) {
  return request("/api/Auth/register", {
    method: "POST",
    body: JSON.stringify({
      email: payload.email,
      password: payload.password,
      requestedRole: payload.role
    })
  });
}

export async function loginWithFallback(form = DEFAULT_LOGIN_FORM) {
  try {
    const data = await loginWithBackend({ email: form.email, password: form.password });
    const token = data?.token || data;
    const claims = decodeJwt(token || "");
    const roleClaim =
      claims["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
      claims.role ||
      form.demoRole;
    const nextRole = normalizeRole(roleClaim);
    const demoUser = demoAccounts.find((account) => account.email === form.email) || demoAccounts.find((account) => account.role === nextRole);
    setAuthToken(token);
    return {
      mode: "api",
      token,
      user: { ...demoUser, email: form.email, role: nextRole },
      role: nextRole,
      message: "Login successful."
    };
  } catch (error) {
    const nextRole = form.demoRole;
    const demoUser = demoAccounts.find((account) => account.role === nextRole);
    return {
      mode: "mock",
      token: "demo-token",
      user: demoUser,
      role: nextRole,
      message: `${error.message} Demo session opened as ${roles[nextRole]}.`
    };
  }
}

export async function registerWithFallback(form) {
  const status = form.role === "Spectator" ? "Active" : "Pending";
  try {
    await registerWithBackend(form);
    return {
      mode: "api",
      user: getRegisteredDemoUser(form, status),
      role: form.role,
      message: `Registered successfully. Account status: ${status}.`
    };
  } catch (error) {
    return {
      mode: "mock",
      user: getRegisteredDemoUser(form, status),
      role: form.role,
      message: `${error.message} Demo account created locally with status ${status}.`
    };
  }
}
