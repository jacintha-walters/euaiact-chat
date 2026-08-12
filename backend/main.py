"""
EU AI Act Compliance Checker - Backend API skeleton.

Run locally:
    pip install -r requirements.txt
    uvicorn main:app --reload --port 8000

Then visit http://localhost:8000/docs for the interactive API docs.
"""

from dotenv import load_dotenv
load_dotenv()

import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from questions_data import QUESTIONS
from typing import Dict, List, Union
from google import genai
from google.genai import types
from retrieval import find_relevant_articles
from fastapi import Request
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

app = FastAPI(title="EU AI Act Compliance Checker API")
limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Allow the local React dev server (and later, your deployed frontend URL)
# to call this API. Add your production frontend URL here once deployed.
ALLOWED_ORIGINS = [
    "http://localhost:5173",  # Vite dev server default
    "http://localhost:3000",
    "https://euaiact-chat.vercel.app",  # <-- add once deployed
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class HealthResponse(BaseModel):
    status: str
    message: str

# Determines the AI classification
class GateAnswers(BaseModel):
    prohibited_practice: bool
    is_gpai_model: bool
    annex_iii_domain: bool
    transparency_trigger: bool

# Communicates the classification
class GateResult(BaseModel):
    tier: str
    explanation: str

@app.get("/", response_model=HealthResponse)
def root():
    return HealthResponse(status="ok", message="EU AI Act Compliance Checker API is running")


@app.get("/api/health", response_model=HealthResponse)
def health():
    return HealthResponse(status="ok", message="Backend is alive")


@app.post("/api/gate", response_model=GateResult)
def classify_tier(answers: GateAnswers):
    if answers.prohibited_practice:
        return GateResult(
            tier="prohibited",
            explanation="This system falls under Article 5 prohibited practices and cannot legally be deployed in the EU.",
        )

    if answers.is_gpai_model:
        return GateResult(
            tier="gpai",
            explanation="This is a general-purpose AI model, which has its own separate obligations track under the Act (in effect since August 2025), not covered by this questionnaire yet.",
        )

    if answers.annex_iii_domain:
        return GateResult(
            tier="high-risk",
            explanation="This system falls under an Annex III high-risk domain. Proceed to the full compliance questionnaire.",
        )

    if answers.transparency_trigger:
        return GateResult(
            tier="limited-risk",
            explanation="This system has transparency obligations under Article 50 (e.g. disclosure to users), but isn't high-risk.",
        )

    return GateResult(
        tier="minimal-risk",
        explanation="Based on your answers, this system doesn't currently trigger specific obligations under the Act.",
    )

class QuestionnaireAnswers(BaseModel):
    answers: Dict[str, Union[str, List[str]]] # either one answer or a list for multi-select


class SectionScore(BaseModel):
    section: str
    score_percent: float

class AnsweredQuestion(BaseModel):
    text: str
    section: str
    answer_given: str
    score_percent: float


class ScoreResult(BaseModel):
    overall_percent: float
    sections: list[SectionScore]
    all_questions: list[AnsweredQuestion]


@app.get("/api/questionnaire/questions")
def get_questions():
    return QUESTIONS


def get_points_for_answer(question: dict, raw_answer) -> float:
    if question["type"] == "informational":
        return 0.0

    if question["type"] == "multi_select":
        if not isinstance(raw_answer, list):
            raise ValueError(f"Question {question['id']} expects a list of selected options")
        label_points = {opt["label"]: opt["points"] for opt in question["options"]}
        return sum(label_points.get(label, 0.0) for label in raw_answer)

    for option in question["options"]:
        if option["label"] == raw_answer:
            return option["points"]
    raise ValueError(f"'{raw_answer}' is not a valid option for question {question['id']}")


@app.post("/api/questionnaire/submit", response_model=ScoreResult)
def submit_questionnaire(payload: QuestionnaireAnswers):
    section_totals: dict[str, list[tuple[float, float]]] = {}
    all_questions = []

    for question in QUESTIONS:
        qid = question["id"]
        if qid not in payload.answers:
            continue
        points = get_points_for_answer(question, payload.answers[qid])
        section_totals.setdefault(question["section"], []).append((points, question["max_points"]))

        raw_answer = payload.answers[qid]
        # multi_select answers arrive as a list -- join into one readable string
        answer_display = ", ".join(raw_answer) if isinstance(raw_answer, list) else raw_answer

        if question["max_points"] > 0:
            all_questions.append(AnsweredQuestion(
                text=question["text"],
                section=question["section"],
                answer_given=answer_display,
                score_percent=round((points / question["max_points"]) * 100, 1),
            ))

    section_scores = []
    total_points = 0.0
    total_max = 0.0
    for section, pairs in section_totals.items():
        section_points = sum(p for p, _ in pairs)
        section_max = sum(m for _, m in pairs)
        section_scores.append(
            SectionScore(section=section, score_percent=round((section_points / section_max) * 100, 1))
        )
        total_points += section_points
        total_max += section_max

    overall = round((total_points / total_max) * 100, 1) if total_max else 0.0

    return ScoreResult(overall_percent=overall, sections=section_scores, all_questions=all_questions)

class ChatMessage(BaseModel):
    role: str
    content: str = Field(..., max_length=4000)


class ChatRequest(BaseModel):
    question: str = Field(..., max_length=2000)
    score_result: ScoreResult
    conversation_history: list[ChatMessage] = Field(default=[], max_length=20)


class ChatResponse(BaseModel):
    answer: str
    sources: list[dict]

client = genai.Client(api_key=os.environ["GOOGLE_API_KEY"])  # reads .env
GEMINI_MODEL = os.environ["GEMINI_MODEL"]

def build_system_prompt(score_result: ScoreResult, retrieved_articles: list[dict]) -> str:
    section_summary = "\n".join(
        f"- {s.section}: {s.score_percent}%" for s in score_result.sections
    )

    all_answers_summary = "\n".join(
        f"- [{q.section}] \"{q.text}\" -> answered \"{q.answer_given}\" (scored {q.score_percent}%)"
        for q in score_result.all_questions
    )

    articles_text = "\n\n".join(
        f"### Article {a['article_number']}: {a['title']}\n{a['text']}"
        for a in retrieved_articles
    )

    return f"""You are an EU AI Act compliance consultant helping an organization
understand their compliance self-assessment results and how to improve.

THIS USER'S RESULTS:
Overall compliance score: {score_result.overall_percent}%
Section breakdown:
{section_summary}

Every question they answered, their actual answer, and how it scored:
{all_answers_summary}

RELEVANT AI ACT TEXT (use this to ground your answer -- cite specific
article numbers when relevant, and do not cite articles that are not
provided below):
{articles_text}

Answer the user's question as a knowledgeable, practical consultant would --
base your assessment of their weaknesses on the actual answers listed above,
not just section percentages. Cite specific articles from the text above
when making legal claims, and give concrete, actionable advice. If the
provided article text doesn't cover what they're asking, say so honestly
rather than guessing."""


@app.post("/api/chat", response_model=ChatResponse)
@limiter.limit("10/minute")
def chat(request: Request, payload: ChatRequest):
    retrieved = find_relevant_articles(payload.question, top_k=3)
    system_prompt = build_system_prompt(payload.score_result, retrieved)

    messages = [{"role": m.role, "content": m.content} for m in payload.conversation_history]
    messages.append({"role": "user", "content": payload.question})

    # Gemini expects roles as "user"/"model" (not "assistant"), and history +
    # the new question combined into one `contents` list, rather than a
    # separate `system` field for everything except the system instruction.
    gemini_history = []
    for m in payload.conversation_history:
        role = "model" if m.role == "assistant" else "user"
        gemini_history.append(types.Content(role=role, parts=[types.Part(text=m.content)]))
    gemini_history.append(types.Content(role="user", parts=[types.Part(text=payload.question)]))

    response = client.models.generate_content(
        model=GEMINI_MODEL,
        contents=gemini_history,
        config=types.GenerateContentConfig(system_instruction=system_prompt),
    )

    answer_text = response.text

    return ChatResponse(
        answer=answer_text,
        sources=[{"article_number": a["article_number"], "title": a["title"]} for a in retrieved],
    )