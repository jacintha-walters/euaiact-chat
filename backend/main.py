"""
EU AI Act Compliance Checker - Backend API skeleton.

Run locally:
    pip install -r requirements.txt
    uvicorn main:app --reload --port 8000

Then visit http://localhost:8000/docs for the interactive API docs.
"""

import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="EU AI Act Compliance Checker API")

# Allow the local React dev server (and later, your deployed frontend URL)
# to call this API. Add your production frontend URL here once deployed.
ALLOWED_ORIGINS = [
    "http://localhost:5173",  # Vite dev server default
    "http://localhost:3000",
    # "https://your-frontend-domain.vercel.app",  # <-- add once deployed
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


@app.get("/", response_model=HealthResponse)
def root():
    return HealthResponse(status="ok", message="EU AI Act Compliance Checker API is running")


@app.get("/api/health", response_model=HealthResponse)
def health():
    return HealthResponse(status="ok", message="Backend is alive")


# --- Placeholder for what comes next ---
#
# @app.post("/api/gate")
#   Takes answers to the 5 risk-tier gate questions, returns the tier
#   (prohibited / high-risk / limited-risk / minimal-risk).
#
# @app.post("/api/questionnaire")
#   Takes the full set of answers for a high-risk system, returns a
#   compliance score + breakdown by section.
#
# @app.post("/api/chat")
#   Takes the score + conversation history, runs the RAG pipeline
#   against the AI Act text, and returns a Claude-generated response
#   with citations to specific articles.
#
# We'll build these one at a time.
