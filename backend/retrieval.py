"""
Retrieval logic for the AI Act RAG pipeline. Loads the pre-computed article
embeddings once when the backend starts, and finds the most relevant
articles for a given question -- embedding the question via Google's hosted
embeddings API (not a local model), since local inference was confirmed to
be the actual latency bottleneck on constrained hosting.
"""

import os
import pickle
import numpy as np
from google import genai

EMBEDDING_MODEL = "gemini-embedding-001"  # must match build_embeddings.py
EMBEDDINGS_PATH = "ai_act_data/embeddings.pkl"

_client = genai.Client(api_key=os.environ["GOOGLE_API_KEY"])

with open(EMBEDDINGS_PATH, "rb") as f:
    _articles = pickle.load(f)

print(f"Retrieval ready: {len(_articles)} articles loaded.")


def cosine_similarity(a: np.ndarray, b: np.ndarray) -> float:
    return float(np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b)))


def find_relevant_articles(question: str, top_k: int = 3) -> list[dict]:
    result = _client.models.embed_content(model=EMBEDDING_MODEL, contents=question)
    query_embedding = np.array(result.embeddings[0].values)

    scored = []
    for article in _articles:
        score = cosine_similarity(query_embedding, article["embedding"])
        scored.append((score, article))

    scored.sort(key=lambda pair: pair[0], reverse=True)

    return [
        {"article_number": a["article_number"], "title": a["title"], "text": a["text"], "score": score}
        for score, a in scored[:top_k]
    ]