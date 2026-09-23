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

- `GET /cards`: list all cards
- `POST /cards`: add a card: `{ "title": string, "columnId": "todo" | "in-progress" | "done" }`
- `PATCH /cards/{id}`: move a card: `{ "columnId": "todo" | "in-progress" | "done" }`
- `DELETE /cards/{id}`: delete a card

Data is persisted to `data/cards.json` on every write, grouped by column:

```json
{
  "todo": [{ "id": "1", "title": "..." }],
  "in-progress": [],
  "done": []
}
```

- `GET /food-entries`: list all food entries
- `POST /food-entries`: log an entry: `{ "name": string, "calories": number, "protein": number, "carbs": number }` (the server stamps today's date)
- `DELETE /food-entries/{id}`: delete an entry

Data is persisted to `data/food_entries.json` as a flat list, each entry carrying its own `date` (`YYYY-MM-DD`):

```json
[
  { "id": "1", "name": "Oatmeal", "calories": 300, "protein": 10, "carbs": 50, "date": "2026-09-23" }
]
```

Planned next: sessions, cookies, and login information (also JSON-backed for now).
