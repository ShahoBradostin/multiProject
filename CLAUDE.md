# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Project structure and architecture

This repo holds several small portfolio projects, usually split into a frontend and a backend folder. Since projects and folders here can be added, changed, or removed over time, don't assume a specific structure, always check the actual folder layout at the repo root first.

## Commands

Always check `package.json` (Node/frontend) and `requirements.txt` (Python/backend) in the relevant project folder for exact, current commands, since they can change.

General pattern right now:
- Frontend (Node/Next.js): run from the frontend folder, e.g. `npm run dev`, `npm run build`, `npm run lint`.
- Backend (Python): create/activate a venv, `pip install -r requirements.txt`, then run the server (e.g. via `uvicorn`).

## Current state (expected to change)

- No test suite or CI is configured yet. Don't assume a `test` command or CI check exists.
- Local dev currently runs two servers at once: backend on `http://localhost:8000`, frontend on `http://localhost:3000`, talking over plain HTTP. This is expected to move to HTTPS in the future.
- The backend currently persists state to local JSON files under `backend/data/`. Files holding user data/credentials are gitignored, not committed. This is expected to move to a MySQL database (for login and general data storage) in the future, check whether it still applies before relying on it.
- Secrets go in `.env` files (gitignored); `.env.example` stays tracked.

## Code style and conventions

- Frontend: TypeScript/Next.js, follow the project's ESLint config.
- Frontend supports i18n (English/Swedish) via `frontend/lib/i18n`, follow this pattern when adding user-facing text instead of hardcoding one language.
- Backend: Python, follow the existing code style in the project.
- Don't add new lint/formatting tools, use what's already configured in each project.

## Post-task review

- After finishing a coding task, spawn another agent acting as a coding and architecture specialist to review the work, and have it do this 3 times (3 separate review passes).
- Each pass gives the code a rating from 1-8:
  - 1-3: low quality
  - 4-5: medium quality
  - 6: upper medium quality
  - 7-8: high quality (this is the goal whenever possible)
- If a pass rates the code below 7, address the feedback and re-review before considering the task done.

## Things to avoid / always do

- Never use em dashes ("—") in code, docs, UI copy, or commit messages. Use ",", ".", or ":" instead.
- Create a new branch before starting a work session/feature, don't work directly on `main`.
- Don't add abstractions, error handling, or functionality beyond what's actually requested.
- Never run `git commit` without asking the user first and getting a clear yes, even mid-session after earlier commits were approved. Each commit needs its own go-ahead.

## Deployment (planned, not started yet)

The user plans to publish this site on a hosting provider in an upcoming session. Notes from an earlier planning discussion, check all of this against current code before acting on it:

- Frontend (Next.js): a host like Vercel is the easy fit. Backend (FastAPI): needs a host that runs a long-lived process (e.g. Railway, Render, Fly.io), not static hosting. Database: local MySQL isn't reachable from the internet, needs a managed MySQL service or a VPS running MySQL.
- Code changes needed: `backend/main.py`'s CORS `allow_origins` is hardcoded to `localhost:3000`/`127.0.0.1:3000`, needs the real frontend URL. Frontend's `NEXT_PUBLIC_KANBAN_API_URL` needs to point at the real backend URL. `backend/schema.sql` needs to be run against whatever new hosted database is chosen.
- Trickiest part: the session cookie is httpOnly with `SameSite=Lax`. If frontend and backend end up on different domains, this likely breaks and needs `SameSite=None; Secure` plus HTTPS on both sides. Simpler alternative: use Next.js `rewrites()` to proxy `/api/*` to the backend, so the browser sees one origin, no cookie/CORS changes needed in backend code.
- A more unified alternative discussed: containerize frontend + backend + MySQL with Docker Compose onto a single VPS, one deployable unit instead of three separate hosted services, more ops work but no cross-domain concerns at all.
- No hosting provider or approach has been chosen yet, this is still an open decision for the next session.
