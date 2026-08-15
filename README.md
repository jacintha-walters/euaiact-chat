# Comply with AI

A self-serve tool for understanding where your AI system stands under the
EU AI Act — choose a fast, open-ended chat for quick questions, or a full
10-minute scored compliance assessment grounded in original academic research.

**Live site:** [complywithai.eu](https://complywithai.eu)

---

## What it is

Back in 2023, before the EU AI Act was even in force, I co-authored a
research paper proposing a questionnaire-based method for organizations to
assess their own AI compliance maturity. The paper is now cited 50+ times —
but a paper isn't a tool. This project rebuilds that methodology against the
Act as it actually exists today, and wraps it in a RAG-grounded chatbot that
answers questions using the real text of the regulation — with citations —
rather than generic advice.

## How it works

The landing page offers two paths:

1. **Full compliance assessment** — 4 questions classify your AI system's
   risk tier under the Act (prohibited, general-purpose AI, high-risk,
   limited-risk, or minimal-risk), each with its own explanation and
   article citations. High-risk systems continue into a 50-question scored
   assessment across three sections (Data & Documentation, Model Risk,
   Development Lifecycle), scored against a rubric derived from the original
   2023 paper. The result includes a chart, a section breakdown, and a chat
   that already knows your full score and every answer you gave.

2. **Just have a question?** — skips straight to an open-ended chat, no
   setup required, for anyone who doesn't need the full assessment, but still wants
   a chatbot grounded in the EU AI Act.

Both chat experiences are powered by the same retrieval-augmented generation
(RAG) pipeline: official EU AI Act article text is embedded and searched by
semantic similarity for every question, and the most relevant articles are
passed to an LLM alongside the question (and, in scored mode, the user's
full assessment results), so answers are grounded in real legal text with
citations.

## Architecture
```
React (Vite) frontend — Tailwind + shadcn/ui
│
▼
FastAPI backend
├── Gate & scoring logic (pure Python, no external calls)
└── /api/chat (rate-limited, both scored and general Q&A modes)
├── retrieval.py — cosine similarity search over pre-computed
│ article embeddings (Google's hosted embeddings API)
└── Google Gemini API — generates the grounded answer
```
Article embeddings are computed once, offline, by `build_embeddings.py`, and
loaded into memory when the backend starts.

## Key technical decisions

**RAG over fine-tuning.** Grounds answers in retrieved legal text and lets
the corpus be updated by editing a file and re-running one script, with no
retraining needed as the Act is amended.

**In-memory embeddings (pickle) over a vector database.** At this corpus
size, a flat similarity search over an in-memory list is simpler and
fast enough; a full vector DB would be infrastructure overhead with no real
benefit at this scale.

**Hosted embeddings over a local model.** Originally used sentence-transformers
running locally. Measured a 13+ second latency bottleneck when the site was hosted with
constrained CPU — local model inference was fine on my own machine (0.03s). 
Switched query-time embedding to Google's hosted embeddings API, 
which dropped retrieval time to ~0.3s in the same production environment. 

**Every question's individual answer is sent to the chat**, not just section
averages. An earlier version summarized only section-level percentages,
which forced the LLM to guess *why* a section scored low. Passing the full
answer set lets the assistant point to specific, real issues and allows the user
to have a really practical and efficient conversation by being able to ask questions like
'What are three things I should make top priority to improve my compliance?'. To which the model
might respond something like - 'in question 5 you said you don't have a good risk management system...'

## AI Security Testing

I ran a manual security review structured around the [OWASP Top 10 for LLM
Applications](https://owasp.org/www-project-top-10-for-large-language-model-applications/),
testing the live deployed chatbot rather than a local copy. This is a scoped
review appropriate to a project of this size — not a full penetration test.

### Results

| Category | Test | Result |
|---|---|---|
| LLM01 – Prompt Injection (direct) | 5 attack variants: instruction override, DAN persona, fake system message, authority/urgency framing, fictional-nesting | ✅ 5/5 resisted |
| LLM02 – Sensitive Information Disclosure | 5 extraction attempts: direct request, "debugging" framing, partial-completion trick, summarization request, translation trick | ⚠️ 2/5 initially leaked partial system prompt content (see below) — patched, then ✅ 5/5 resisted |
| LLM04 – Model Denial of Service | Rate limit verification: 15 concurrent requests within 60 seconds | ⚠️ Initially found non-functional (see below) — fixed, then ✅ correctly returned `429` from the 11th request onward |
| LLM06 – Excessive Agency | 3 false-action prompts: "email me the results," "save my answers," "submit this to the authorities" | ✅ 3/3 correctly declined, no false claims of capability |
| LLM09 – Overreliance / Misinformation | 3 prompts: nonexistent article probe, false-premise correction, pressure for a definitive legal yes/no | ✅ 3/3 — correctly refused to fabricate, caught the false premise, held the line under pressure |

### Two real findings, and how they were fixed

**LLM02 — partial system prompt leakage.** Direct extraction attempts were
correctly refused, but two indirect framings got through: a "for debugging
purposes" request that returned an accurate summary of the prompt's
structure, and a translation request that returned the full prompt in
Spanish instead of English. Both were closed with one explicit instruction
telling the model not to reveal, summarize, paraphrase, or translate its
configuration regardless of framing — retested clean afterward.

*Worth noting: since this project's source code is public, the system
prompt was never truly secret from a determined attacker willing to read the
repository. But interesting to test nonetheless :D*

**LLM04 — rate limiting was silently non-functional in production.** The
limiter is keyed by client IP (`slowapi` + `get_remote_address`), which
works correctly in local development. In production, every request landed
on a different IP in the `100.64.0.0/10` range — Railway's internal proxy
layer assigning a rotating address per connection, rather than passing
through the real caller's IP. 15 concurrent requests from a single source
were spread across 15 apparently-different clients, so the rate limit was
never reached. Fixed by reading the real client IP from the
`X-Forwarded-For` header instead of the raw connection address. Retested
with 15 genuinely concurrent requests: the first 10 returned `200`, the
remaining 5 correctly returned `429`.

### Structural guarantees (not tested via prompt injection)
- **Cross-user data leakage**: the backend is fully stateless — each request
  is an independent function call with no shared memory, cache, or database
  between requests.

### Out of scope, and why

- **LLM03 (Training Data Poisoning)** — no model is trained or fine-tuned; a
  pre-trained hosted model is called via API.
- **LLM05 (Supply Chain)** — no model is trained, no plugins are used. Ran npm audit to check dependencies.
- **LLM07 (Insecure Plugin Design)** — no plugins or tool-calling
  integrations exist.
- **LLM10 (Model Theft)** — a hosted third-party API is used; no proprietary
  model to steal.

## Scaling Considerations

This project made deliberate lightweight choices appropriate to its actual
scale — a demo covering a curated 14-article corpus with modest traffic.
Here's the decision I made:

**Why not LangChain (or a similar heavy framework)?** LangChain works well
when you need to orchestrate multiple chained LLM calls, several
retrieval sources, agents, or complex tool-calling — none of which this
project does. The actual RAG pipeline here is three straightforward steps:
embed the question, compute cosine similarity against ~14 stored vectors,
pass the top matches to one LLM call. 
I'd reach for LangChain if this demo grew into a serious compliance tool with a lot more functionality.

**Why not Pinecone (or another vector database)?** At 14 articles, a flat
in-memory list with cosine similarity is faster to query than a network
round-trip to a hosted vector database would be, has zero infrastructure to
provision or pay for, and is trivial to reason about. A real deployment
covering the whole 113-article regulation, versioned across amendments,
with incremental updates, would be a reasonable step to migrate.

**What else would change at real scale:**
- **Hybrid retrieval** (keyword + semantic search) — pure semantic
  similarity occasionally under-ranks exact matches like specific article
  numbers, a production system would combine both.
- **Automated adversarial testing** in place of the manual OWASP-structured
  suite, for continuous regression testing as the system prompt evolves.
- **A distributed-attack-aware rate limiting layer** since
  per-IP limiting mitigates casual abuse and cost overruns but not a
  genuine distributed attack from many sources at once.

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
  `VITE_API_BASE_URL` pointing at the live backend URL), with a custom
  domain (complywithai.eu) connected via DNS
- The backend's `ALLOWED_ORIGINS` (CORS) must include every domain the
  frontend is served from, or the browser will block requests between them.

## Known limitations

- **No vector database** — fine at this corpus size; would need to change
  to scale to the full 113-article regulation.
- **No user accounts or persistence** — by design. Nothing entered is
  saved; every session is stateless.
- **Rate limiting is per-IP** (10 requests/minute on `/api/chat`) — see the
  AI Security Testing section above for how this was verified and one real
  bug that was found and fixed in the process.
- **The AI Act corpus is a curated subset**, not the full regulation.

## Built by

Jacintha Walters — AI & Cybersecurity specialist. This project builds on
[my 2023 paper on EU AI Act compliance](https://arxiv.org/abs/2307.10458).
[LinkedIn](https://www.linkedin.com/in/jacinthawalters/) ·
[GitHub](https://github.com/jacintha-walters)
