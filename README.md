# multiProject

A personal site made of multiple standalone projects, each living at its own page.

## Structure

- `frontend/`: the Next.js site: a project hub page plus one page per project (e.g. the Kanban board, the calorie tracker).
- `backend/`: Python (FastAPI) backend. Serves the Kanban board's data, the calorie tracker's logged entries, and a reference food database (name/calorie/protein/carb search) sourced from Livsmedelsverket's open API.

## Running locally

Two separate servers, each in its own terminal:

```bash
# Terminal 1: backend
cd backend
source .venv/bin/activate
uvicorn main:app --reload --port 8000

# Terminal 2: frontend
cd frontend
npm run dev
```

Then open http://localhost:3000. See `frontend/README.md` and `backend/README.md`
for more detail (including first-time setup for the backend's virtual environment).
