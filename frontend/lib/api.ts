// Relative, so browser requests stay same-origin and go through the
// rewrite in next.config.ts instead of crossing to the backend's own
// domain (which would make the session cookie subject to SameSite rules).
export const API_BASE = "/api";

// Used server-side only (middleware, next.config.ts), where a relative
// path can't be used as a fetch target and same-origin doesn't apply.
export const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:8000";

// All data endpoints require a session now. A 401 means it expired or was
// never there (e.g. the tab was left open across a logout elsewhere), so
// send the user back to log in rather than showing a confusing empty state.
export async function apiFetch(
  path: string,
  init?: RequestInit,
): Promise<Response> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    credentials: "include",
  });
  if (res.status === 401 && typeof window !== "undefined") {
    // Plain function, not a component, so useRouter() isn't available here.
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    window.location.href = `/login?from=${encodeURIComponent(window.location.pathname)}`;
  }
  return res;
}
