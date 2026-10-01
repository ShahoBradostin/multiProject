export const API_BASE =
  process.env.NEXT_PUBLIC_KANBAN_API_URL ?? "http://localhost:8000";

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
