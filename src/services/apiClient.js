export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5035";
export const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA !== "false";

export function getAuthToken() {
  try {
    return localStorage.getItem("authToken");
  } catch {
    return null;
  }
}

export function setAuthToken(token) {
  try {
    if (token) {
      localStorage.setItem("authToken", token);
    } else {
      localStorage.removeItem("authToken");
    }
  } catch {
    // Storage is optional for the demo runtime.
  }
}

export async function request(path, options = {}) {
  const token = getAuthToken();
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {})
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers
  });

  const result = await response.json().catch(() => ({}));
  if (!response.ok || result.success === false) {
    throw new Error(result.message || `Request failed: ${response.status}`);
  }

  return result.data ?? result;
}

export function decodeJwt(token) {
  try {
    const payload = token.split(".")[1];
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decodeURIComponent(escape(json)));
  } catch {
    return {};
  }
}
