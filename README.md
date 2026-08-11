# EU AI Act Compliance Checker

A tool to help organizations assess their EU AI Act compliance: a risk-tier
gate, a compliance questionnaire, and a chat interface (grounded via RAG over
the actual Act text) that explains your score and how to improve it.

## Project structure

```
euaiact-check/
├── backend/       FastAPI app — scoring logic, RAG pipeline, chat endpoint
└── frontend/      React (Vite) app — questionnaire UI, results, chat UI
```

## Running locally

You'll run two things at once, in two separate terminals.

### 1. Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate       # on Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env            # then edit .env and add your Anthropic API key
uvicorn main:app --reload --port 8000
```

Visit http://localhost:8000/docs to see the interactive API docs and confirm
it's running.

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Visit http://localhost:5173 — you should see the skeleton page, and it should
say the backend status is "Backend is alive" (confirming the two apps can
talk to each other).

## Deployment (once we're ready)

- **Frontend** → Vercel or Netlify (connect the GitHub repo, point it at the
  `frontend/` folder as the project root)
- **Backend** → Railway, Render, or Fly.io (connect the GitHub repo, point it
  at the `backend/` folder as the project root)
- After deploying, add your frontend's live URL to `ALLOWED_ORIGINS` in
  `backend/main.py`, and set `VITE_API_BASE_URL` as an environment variable
  on your frontend host to point at your live backend URL.

## Status

- [x] Skeleton: FastAPI + React talking to each other
- [ ] Risk-tier gate (5 questions → prohibited / high-risk / limited-risk / minimal-risk)
- [ ] Full questionnaire + scoring logic
- [ ] RAG pipeline over AI Act text
- [ ] Chat interface with article citations
- [ ] Deployed live
