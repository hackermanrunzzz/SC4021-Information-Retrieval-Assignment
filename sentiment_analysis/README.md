## This notebook performs sentiment and emotion classification on movie reviews using state-of-the-art transformer models from HuggingFace. It fulfills the Classification component (Part C – Question 4) of the SC4021 Information Retrieval group assignment.

### 💻 Note: This notebook was executed on Google Colab due to compatibility issues encountered with Jupyter Notebook. However, this change in environment does not affect the validity or integrity of the results, as the code, models, and data remain consistent across platforms.


### **📂 This directory contains the following key files:**
* **Final Sentiment Analysis.ipynb:** This Jupyter Notebook includes the complete classification workflow and is used for both **sentiment & emotion classification**, and the evaluation of the manually labeled dataset. This file addresses the requirements of **Part C – Classification, specifically Question 4 of the assignment.**
* **analysis_all_movies (JSON and CSV formats):** These output files consist of movie reviews that have been annotated with both sentiment (positive, neutral, negative) and emotion tags, generated through the classification pipeline.
* **manual labelled data.csv:** This file contains a manually annotated dataset of 1,000 movie reviews. It serves as the ground truth for evaluating model performance and conducting the random accuracy assessment on unlabeled data.
* **all_review_information.json:** This data file comprises all the crawled data which will be used as an input for our classification pipeline. Access this file from the Google Drive link.

### 🎯 **Objective**
To analyze movie reviews by:
* Predicting the sentiment (positive or negative)
* Detecting the emotion (e.g., joy, sadness, anger, etc.)

### 📁 **Input Data**
- Loads data from a JSON file (all_review_information.json) containing movie reviews structured under each movie title.
- Each review includes fields such as title, body, rating, upvotes, and downvotes.

### 🧠 **Models Used**
- Sentiment Classifier: distilbert-base-uncased-finetuned-sst-2-english
- Emotion Classifier: bhadresh-savani/distilbert-base-uncased-emotion
Models are accessed via the HuggingFace Transformers library.

### 🔧 **Preprocessing**
No manual preprocessing required.
Tokenizers of the models handle:
1. Lowercasing
2. Padding
3. Truncation (max length = 512 tokens)
4. Special tokens

### 🧪 **Workflow Overview**
1. Data Loading: Load all or a specific movie's reviews.
2. Model Initialization: Load both emotion and sentiment classification models and tokenizers.
3. Classification: Apply each model to the review body (or fallback to title if empty).
4. Results Compilation:
* Adds sentiment and emotion columns to the dataset.
* Saves results to both CSV and JSON formats.
5. Visualization:
- Generates doughnut charts for emotion and sentiment distributions.
- Categorized Output:
- Displays top categorized reviews (up to 3 per category) for human inspection.

### 📊 **Output**
* analysis_.csv: A flat file with all review metadata and prediction results.
* analysis_.json: A nested format organized by movie, with each review's text and predicted labels.
* Console output: Distribution statistics and sample reviews for each emotion/sentiment.

### Steps to run the classfication models:
#### STEP 1: Upload the notebook to drive and open them with google colab.
The folder contains the Jupyter notebook, namely "Final Sentiment Analysis.ipynb". To run the notebooks, we will need TPU hardware accelerator as well as the built-in environment of google colab. Therefore, rather than running on the local machine, using google colab to execute these notebooks is recommended.

#### STEP 2: Upload the data file to drive
Ensure that **all_review_information.json** is uploaded in the drive and change the file path under this section of code:
```
# =============================================
# 2. USER INPUT
# =============================================

# Get user input
movie_name = input("Enter movie name to analyze (or press Enter for all movies): ").strip()

# Load data
try:
    df = load_movie_data("/content/all_review_information.json",
                        movie_name if movie_name else None)

    print(f"\nLoaded {len(df)} reviews for: {df['movie'].iloc[0] if movie_name else 'All movies'}")

except ValueError as e:
    print(e)
    exit()
```

#### STEP 3: Run the code
Please note that executing the full classification pipeline on all movies may take approximately 8–9 hours due to the large dataset size.

To explore the workflow more quickly, you may choose to analyze a single movie by providing its name under `User Input` during runtime. You can refer to the available movie titles in Movie List.pdf. Alternatively, you may press Enter to process the entire dataset (takes up to ~8 hours).

Upon completion, the following output files will be generated:
- analysis_all_movies.json – Structured output grouped by movie, including review metadata, sentiment, and emotion predictions.
- analysis_all_movies.csv – Tabular version of the same data, suitable for filtering and analysis.

#### In the event when there is any error running the Final Sentiment Analysis.ipynb on your own local Google Collab, you may access https://colab.research.google.com/drive/1AlH8-NGQGOIWOpWvjG7O-aQg3SFm_pc6?usp=sharing to take a look.
