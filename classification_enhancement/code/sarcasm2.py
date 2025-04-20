import pandas as pd


data = pd.read_csv('/Users/xingkun/Desktop/Information Retrieval/CZ4021--Information-Retreival--Movies-/finalized data + sentiment analysis/analysis_all_movies.csv')


#data = data.head(100)



from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch

from transformers import AutoTokenizer, AutoModelForSequenceClassification

tokenizer = AutoTokenizer.from_pretrained("helinivan/english-sarcasm-detector")
model = AutoModelForSequenceClassification.from_pretrained("helinivan/english-sarcasm-detector")
# Function to predict sarcasm
def detect_sarcasm(text):
    inputs = tokenizer(text, return_tensors="pt", truncation=True, padding=True)
    with torch.no_grad():
        logits = model(**inputs).logits
    predicted_class = torch.argmax(logits, dim=1).item()
    return predicted_class  # 0 = not sarcastic, 1 = sarcastic

data['sarcasm'] = data['body'].apply(detect_sarcasm)






import json

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
        "sarcasm": row["sarcasm"]
    }

    # Create inner list if the movie hasn't been seen yet
    if movie not in movie_data:
        movie_data[movie] = []

    # Append review info to the list of reviews for this movie
    movie_data[movie].append(review_info)

# Save to JSON
with open("/Users/xingkun/Desktop/Information Retrieval/CZ4021--Information-Retreival--Movies-/sarcasm.json", "w", encoding="utf-8") as f:
    json.dump(movie_data, f, indent=2, ensure_ascii=False)


