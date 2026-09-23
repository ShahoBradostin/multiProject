# multiProject

A personal site made of multiple standalone projects, each living at its own page.

## Structure

- `frontend/`: the Next.js site: a project hub page plus one page per project (e.g. the Kanban board).
- `backend/`: Python (FastAPI) backend. Currently serves the Kanban board's data from a JSON file.

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
