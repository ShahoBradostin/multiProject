# Backend

Python backend for the portfolio, built with FastAPI. Currently serves the Kanban
board's data (`data/cards.json`) and the calorie tracker's data
(`data/food_entries.json`).

## Setup

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## Run

```bash
uvicorn main:app --reload --port 8000
```

The frontend (running separately on `http://localhost:3000`) talks to this server
at `http://localhost:8000`.

## API

- `GET /cards`: list the current user's cards
- `POST /cards`: add a card: `{ "title": string, "columnId": "todo" | "in-progress" | "done" }` (owned by the caller)
- `PATCH /cards/{id}`: move a card: `{ "columnId": "todo" | "in-progress" | "done" }` (only the owner's own cards; 404 otherwise)
- `DELETE /cards/{id}`: delete a card (only the owner's own; 404 otherwise)

Data is persisted to `data/cards.json` on every write, grouped by column. Every card carries the id of the user who created it, and each endpoint only reads/writes cards belonging to the logged-in user:

```json
{
  "todo": [{ "id": "1", "title": "...", "userId": "..." }],
  "in-progress": [],
  "done": []
}
```

- `GET /food-entries`: list the current user's logged entries
- `POST /food-entries`: log an entry: `{ "name": string, "calories": number, "protein": number, "carbs": number }` (the server stamps today's date and the caller's user id)
- `DELETE /food-entries/{id}`: delete an entry (only the owner's own; 404 otherwise)

Data is persisted to `data/food_entries.json` as a flat list, each entry carrying its own `date` (`YYYY-MM-DD`) and `userId`:

```json
[
  { "id": "1", "name": "Oatmeal", "calories": 300, "protein": 10, "carbs": 50, "date": "2026-09-23", "userId": "..." }
]
```

Cards/entries saved before accounts existed have no `userId` and are simply inaccessible now rather than shared with everyone.

- `GET /foods?q=&lang=en|sv&limit=50`: search the reference food database (name substring match, case-insensitive), returns up to `limit` results sorted alphabetically: `{ "number": int, "name": string, "calories": number, "protein": number, "carbs": number }`

Backed by `data/food_database.json` (~2600 items, Swedish + English names, values per
100g), fetched from Livsmedelsverket's open API (CC BY 4.0) via
`scripts/fetch_food_database.py`. Re-run that script to refresh the data:

```bash
python scripts/fetch_food_database.py
```

## Auth

- `POST /auth/register`: create an account: `{ "username": string, "password": string }` (username ≥3 chars, password ≥8 chars). Logs the new user in.
- `POST /auth/login`: `{ "username": string, "password": string }`.
- `POST /auth/logout`: clears the current session.
- `GET /auth/me`: the current user, or 401 if not logged in.

All three return/expect a `{ "id": string, "username": string }` user object. Login and register set an httpOnly session cookie (`session_token`); the frontend must send requests with `credentials: "include"` for it to work.

`/cards*`, `/food-entries*`, and `/foods` all require a valid session (401 otherwise), and `/cards*`/`/food-entries*` are scoped per-user (see above). CORS is configured with `allow_credentials=True` for the frontend's origin.

The frontend's `proxy.ts` also gates every page (not just `/board`/`/calories`) by calling `GET /auth/me` on each request - a session cookie merely being present isn't enough, since most pages never call the backend themselves and so would never otherwise trigger a redirect on an expired/revoked session.

Users are persisted to `data/users.json` (passwords hashed with bcrypt) and sessions to `data/sessions.json` (7-day expiry). Both are gitignored since they hold credentials and live session tokens, not just app data.
