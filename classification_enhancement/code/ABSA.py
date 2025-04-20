import json
import pandas as pd

# Load the nested JSON
with open("/Users/xingkun/Desktop/Information Retrieval/CZ4021--Information-Retreival--Movies-/sarcasm.json", "r", encoding="utf-8") as f:
    movie_data = json.load(f)

# Flatten the nested structure into a list of rows
rows = []
for movie, reviews in movie_data.items():
    for review in reviews:
        review_row = {"movie": movie, **review}  # add movie title to each row
        rows.append(review_row)

# Convert to DataFrame
data = pd.DataFrame(rows)



#data = data.head(100)



import spacy
from transformers import AutoTokenizer, AutoModelForSequenceClassification, pipeline
import torch
import pandas as pd
import string

# Load spaCy model for aspect extraction and normalization.
nlp = spacy.load("en_core_web_sm")

# Load the ABSA model and tokenizer.
model_name = "yangheng/deberta-v3-base-absa-v1.1"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSequenceClassification.from_pretrained(model_name)

# Create a pipeline for convenience.
absa_classifier = pipeline("text-classification", model=model, tokenizer=tokenizer)

# Define a set of relevant aspects for movie reviews.
relevant_aspects = {
   "act", "plot", "soundtrack", "dialogue", "story", "character", "scene",
    "film", "movie", "actor", "director", "script", "visual", "effect",
    "camera", "cinematography", "screenplay", "cast", "quality", "direct", "technology"
}


def extract_relevant_aspects(text: str) -> list:
    """
    Extract noun chunks from the text and return canonical aspect names (from relevant_aspects)
    if they match after lemmatization.
    """
    doc = nlp(text)
    matched = set()

    for chunk in doc.noun_chunks:
        lemma = " ".join([token.lemma_.lower() for token in nlp(chunk.text) if not token.is_punct])
        if lemma in relevant_aspects:
            matched.add(lemma)
    return list(matched)

def analyze_aspect_sentiment(aspect: str, text: str) -> str:
    """
    Run the ABSA classifier for a given aspect and text.
    The classifier expects a text-pair input (text as the review and aspect as the second part).
    """
    # Format the input. The model expects "review [SEP] aspect" if trained that way.
    input_text = f"{text} [SEP] {aspect}"
    output = absa_classifier(input_text)
    # Assume output returns a list of dictionaries with keys "label" and "score".
    sentiment = output[0]["label"] if output and isinstance(output, list) else "UNKNOWN"
    return sentiment


global_counter = 0

def extract_aspects_with_sentiment(text: str) -> list:
    """
    First extract candidate aspects from the review using spaCy. 
    Then, only run the ABSA classifier on the aspects that are relevant.
    Returns a list of dictionaries containing both the aspect and its predicted sentiment.
    """
    global global_counter
    global_counter += 1
    if global_counter % 500 == 0:
        print(f"Processed {global_counter} rows...")

    matched_aspects = extract_relevant_aspects(text)
    return [
        {"aspect": aspect, "sentiment": analyze_aspect_sentiment(aspect, text)}
        for aspect in matched_aspects
    ]



import json
from concurrent.futures import ProcessPoolExecutor
if __name__ == "__main__":
    from concurrent.futures import ProcessPoolExecutor

    with ProcessPoolExecutor(max_workers=6) as exe:
        data["ABSA"] = list(exe.map(extract_aspects_with_sentiment, data["body"]))

    # (Optional) Continue with your JSON creation code here...


    movie_data = {}

    for _, row in data.iterrows():
        movie = row["movie"]

        # Extract all review info directly from the row
        review_info = {
            "title": row["title"],
            "body": row["body"],
            "rating": row["rating"],
            "upvotes": row["upvotes"],
            "downvotes": row["downvotes"],
            "emotion": row["emotion"],
            "sentiment": row["sentiment"],
            "sarcasm": row["sarcasm"],
            "ABSA": row["ABSA"]
        }

        # Create inner list if the movie hasn't been seen yet
        if movie not in movie_data:
            movie_data[movie] = []

        # Append review info to the list of reviews for this movie
        movie_data[movie].append(review_info)

    # Save to JSON
    with open("/Users/xingkun/Desktop/Information Retrieval/CZ4021--Information-Retreival--Movies-/SarcasmABSA.json", "w", encoding="utf-8") as f:
        json.dump(movie_data, f, indent=2, ensure_ascii=False)