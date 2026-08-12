"""
Retrieval logic for the AI Act RAG pipeline. Loads the pre-computed article
embeddings once when the backend starts, and exposes a function to find the
most relevant articles for a given question.
"""

import pickle
import numpy as np
from sentence_transformers import SentenceTransformer

MODEL_NAME = "all-MiniLM-L6-v2"  # must match the model used in build_embeddings.py
EMBEDDINGS_PATH = "ai_act_data/embeddings.pkl"

# Loaded once, at import time -- not on every request. Loading the model and
# the embeddings file are both slow-ish operations (hundreds of ms), so doing
# this once when the server starts keeps individual chat requests fast.
print("Loading embedding model and AI Act embeddings...")
_model = SentenceTransformer(MODEL_NAME)

with open(EMBEDDINGS_PATH, "rb") as f:
    _articles = pickle.load(f)

print(f"Retrieval ready: {len(_articles)} articles loaded.")


def cosine_similarity(a: np.ndarray, b: np.ndarray) -> float:
    """How similar two vectors are, from -1 (opposite) to 1 (identical).
    For sentence embeddings, values are typically 0 to 1 in practice."""
    return float(np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b)))


def find_relevant_articles(question: str, top_k: int = 3) -> list[dict]:
    """Given a user's question, return the top_k most relevant AI Act
    articles, ranked by similarity."""
    query_embedding = _model.encode(question)

    scored = []
    for article in _articles:
        score = cosine_similarity(query_embedding, article["embedding"])
        scored.append((score, article))

    scored.sort(key=lambda pair: pair[0], reverse=True)

    return [
        {"article_number": a["article_number"], "title": a["title"], "text": a["text"], "score": score}
        for score, a in scored[:top_k]
    ]