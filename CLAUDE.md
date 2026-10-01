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

## Things to avoid / always do

- Never use em dashes ("—") in code, docs, UI copy, or commit messages. Use ",", ".", or ":" instead.
- Create a new branch before starting a work session/feature, don't work directly on `main`.
- Don't add abstractions, error handling, or functionality beyond what's actually requested.
