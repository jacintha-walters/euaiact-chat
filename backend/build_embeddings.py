"""
One-time script: embeds each AI Act article and saves the vectors to disk.

Run this manually whenever ai_act_data/articles.py changes (new articles
added, existing text edited):

    python build_embeddings.py

It does NOT run automatically when the server starts -- embedding is a
build step, not a runtime step. The backend just loads the saved output.
"""

import pickle
from sentence_transformers import SentenceTransformer
from ai_act_data.articles import ARTICLES

# small BERT model is chosen for embeddings. 6 layers.
# lightweight so it can run locally
MODEL_NAME = "all-MiniLM-L6-v2"  
# pickle is used to save the embedding (numpy object)
# this way the embedding only has to be done once
OUTPUT_PATH = "ai_act_data/embeddings.pkl"


def main():
    print(f"Loading model '{MODEL_NAME}'... (downloads once, then cached)")
    model = SentenceTransformer(MODEL_NAME)

    texts = [article["text"] for article in ARTICLES]
    print(f"Embedding {len(texts)} articles...")
    embeddings = model.encode(texts, show_progress_bar=True)

    records = []
    for article, embedding in zip(ARTICLES, embeddings):
        records.append({
            "article_number": article["article_number"],
            "title": article["title"],
            "text": article["text"],
            "embedding": embedding,
        })

    with open(OUTPUT_PATH, "wb") as f:
        pickle.dump(records, f)

    print(f"Saved {len(records)} embedded articles to {OUTPUT_PATH}")


if __name__ == "__main__":
    main()