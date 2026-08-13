# EU AI Act Compliance Checker

A self-serve tool that classifies an AI system's risk tier under the EU AI
Act, runs a scored 50-question compliance assessment for high-risk systems,
and lets users discuss their results with a RAG-grounded LLM assistant —
one that cites the actual text of the Act rather than guessing.

**Live demo:** [EU AI Act Compliance Tool](https://euaiact-chat.vercel.app/)
**API docs:** [Back-end docs](euaiact-chat-production.up.railway.app/docs)

---

## What it is

Back in 2023, before the EU AI Act was even in force, I co-authored a
research paper proposing a questionnaire-based method for organizations to
assess their own AI compliance maturity. The paper is now cited 50+ times —
but a paper isn't a tool. This project rebuilds that methodology against the
Act as it actually exists today (including 2026 amendments like the Digital
Omnibus delays), and turns it into something an organization can actually
use: a live web app that classifies risk, scores compliance, and explains —
with real legal citations — what to do about it.

## How it works
1. **Risk classification** — 4 yes/no questions route the user to one of
   five outcomes: prohibited, general-purpose AI model, high-risk,
   limited-risk (transparency only), or minimal-risk. Each outcome gets its
   own explanation page with relevant article citations.

2. **Scored questionnaire** *(high-risk systems only)* — 50 questions
   across three sections (Data & Documentation, Model Risk, Development
   Lifecycle), each scored per a rubric derived from the original 2023
   paper's methodology. Returns an overall percentage, a per-section
   breakdown, and every individual answer.

3. **RAG-grounded chat** *(high-risk systems only)* — the user's full score and answers, 
   plus the most relevant EU AI Act articles (retrieved via semantic search over locally
   embedded article text), are passed to an LLM. This means the assistant's
   advice is grounded in the user's actual answers and the real text of the
   law — not a generic summary of "AI compliance best practices."

## Architecture
```
React (Vite) frontend
│
▼
FastAPI backend
├── Gate & scoring logic (pure Python, no external calls)
└── /api/chat
├── retrieval.py — cosine similarity search over pre-computed
│ article embeddings (sentence-transformers, run locally)
└── Google Gemini API — generates the grounded answer

The article embeddings are computed once, offline, by `build_embeddings.py`,
and loaded into memory when the backend starts — no external vector
database, no per-request embedding cost.
```
---

## Key technical decisions

**RAG over fine-tuning.** Fine-tuning a model on legal text is expensive,
hard to keep current as the law is amended, and — critically — doesn't
reliably improve citation accuracy for specific articles. Retrieval means
every answer is grounded in the actual retrieved text, and the corpus can
be updated by just editing a file and re-running one script, with no
retraining.

**In-memory embeddings (pickle) over a vector database.** At 13 articles,
a full vector DB (Pinecone, Chroma) would be infrastructure overhead with
no real benefit. This is a deliberate tradeoff that wouldn't
hold at the scale of the full 113-article regulation; a production version
covering the whole Act would warrant a real vector store.

**sentence-transformers (local, free) over a hosted embeddings API.** No
API key, no per-embedding cost, runs fully offline once the model is
cached. A reasonable tradeoff of embedding quality for zero marginal cost
at this project's scale.

**Google Gemini** Gemini's API was the only one that worked with my; 
available payment methods. API is easy to use and keeps costs to a minimum.

**The AI gets the articles + all answers** An earlier version didn't pass the full questionnaire
to the AI chat, which forced the LLM to guess *why* a section scored low. Passing the full
answer set (question text, the user's actual answer, and its score) lets
the assistant point to specific, real issues.

## Running locally

You'll need two terminals.

### Backend

```bash
cd backend
python3.11 -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env               # add your GOOGLE_API_KEY and GEMINI_MODEL
python build_embeddings.py         # embeds the AI Act article corpus
uvicorn main:app --reload --port 8000
```

Visit http://localhost:8000/docs for the interactive API docs.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Visit http://localhost:5173.

## Deployment

- **Backend** → Railway (root directory `backend/`, start command
  `uvicorn main:app --host 0.0.0.0 --port $PORT`, environment variables
  `GOOGLE_API_KEY` and `GEMINI_MODEL`)
- **Frontend** → Vercel (root directory `frontend/`, environment variable
  `VITE_API_BASE_URL` pointing at the live backend URL)
- The backend's `ALLOWED_ORIGINS` (CORS) must include the deployed frontend
  URL, or the browser will block requests between them.

## Known limitations

- **No vector database** — fine at this corpus size (13 articles); would
  need to change to scale to the full regulation.
- **No user accounts or persistence** — by design. Nothing entered is
  saved; every session is stateless.
- **Rate limiting is per-IP** (10 requests/minute on `/api/chat`) — this
  mitigates casual abuse and runaway API costs, but doesn't protect against
  a genuine distributed attack from many IPs at once, which would need
  infrastructure-level protection.
- **The AI Act corpus is a curated subset** (13 articles covering the
  obligations the questionnaire actually scores), not the full 113-article
  regulation.

## Built by

Jacintha Walters — AI & Cybersecurity specialist. This project builds on
[my 2023 paper on EU AI Act compliance](https://arxiv.org/abs/2307.10458).
[LinkedIn](https://www.linkedin.com/in/jacinthawalters/) ·
[GitHub](https://github.com/jacintha-walters)