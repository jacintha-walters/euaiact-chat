"""
One-time script: embeds each AI Act article using Google's hosted embeddings
API and saves the vectors to disk.

Run manually whenever ai_act_data/articles.py changes:
    python build_embeddings.py

Uses Google's hosted embeddings API rather than a local model (too slow when hosted)
"""

import os
import pickle
import numpy as np
from dotenv import load_dotenv
load_dotenv()

from google import genai
from ai_act_data.articles import ARTICLES

EMBEDDING_MODEL = "gemini-embedding-001"
OUTPUT_PATH = "ai_act_data/embeddings.pkl"


def main():
    client = genai.Client(api_key=os.environ["GOOGLE_API_KEY"])

    records = []
    for article in ARTICLES:
        text = f"{article['title']}\n\n{article['text']}"
        result = client.models.embed_content(model=EMBEDDING_MODEL, contents=text)
        embedding = np.array(result.embeddings[0].values)

        records.append({
            "article_number": article["article_number"],
            "title": article["title"],
            "text": article["text"],
            "embedding": embedding,
        })
        print(f"Embedded article {article['article_number']}: {article['title']}")

    with open(OUTPUT_PATH, "wb") as f:
        pickle.dump(records, f)

    print(f"Saved {len(records)} embedded articles to {OUTPUT_PATH}")


if __name__ == "__main__":
    main()