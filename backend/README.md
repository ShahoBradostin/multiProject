# Backend

Python backend for the portfolio, built with FastAPI. Currently serves the Kanban
board's data, stored in `data/cards.csv`.

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

- `GET /cards` — list all cards
- `POST /cards` — add a card: `{ "title": string, "columnId": "todo" | "in-progress" | "done" }`
- `PATCH /cards/{id}` — move a card: `{ "columnId": "todo" | "in-progress" | "done" }`
- `DELETE /cards/{id}` — delete a card

Data is persisted to `data/cards.csv` on every write.

Planned next: sessions, cookies, and login information (also CSV-backed for now).
