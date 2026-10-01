import { NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = ["/login", "/register"];
const API_BASE =
  process.env.NEXT_PUBLIC_KANBAN_API_URL ?? "http://localhost:8000";

// The whole site requires a logged-in session now, not just /board and
// /calories - visiting anything (including "/") without one bounces to
// /login first. This asks the backend to confirm the session cookie is
// still valid (not just present) on every request, since most pages here
// (home, about) never call the backend themselves and so would never
// otherwise trigger the 401 that apiFetch (see lib/api.ts) turns into a
// redirect - that fallback only covers pages that fetch protected data.
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isPublic = PUBLIC_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
  if (isPublic) {
    return NextResponse.next();
  }

  const token = request.cookies.get("session_token")?.value;
  const isValid = token
    ? await fetch(`${API_BASE}/auth/me`, {
        headers: { Cookie: `session_token=${token}` },
      })
        .then((res) => res.ok)
        .catch(() => false)
    : false;

  if (isValid) {
    return NextResponse.next();
  }

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("from", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
