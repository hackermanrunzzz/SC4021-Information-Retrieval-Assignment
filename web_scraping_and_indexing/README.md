# Web Scraping and Indexing 

This folder implements a full pipeline for crawling, processing, indexing, and analyzing movie reviews and metadata from IMDb using Python. It combines web scraping (Selenium + IMDbPY), data preprocessing, and indexing with Apache Solr to enable full-text search and faceted queries over the movie corpus.

---

## Project Structure

The notebook follows a modular structure:

### 1. Movie Data Collection
- Uses **IMDbPY API** to extract movie IDs and titles.
- **Selenium WebDriver** fetches HTML content for each movie's review page.
- HTML pages are saved locally for offline processing.

### 2. Data Preprocessing
- HTML is parsed using `BeautifulSoup`.
- Extracts user reviews and movie metadata (e.g., runtime, genre, IMDb rating).
- Performs deduplication and filters out movies with 0 reviews.

### 3. Data Overview
- Computes total document count, word tokens, and unique word types.
- Visualizes word frequency and stopword distribution with `matplotlib` and `seaborn`.

### 4. Apache Solr Indexing
- Review data and metadata are indexed into **two Solr cores**:
  - `moviereviewscore` (review-centric)
  - `metadatacore` (metadata-centric)
- Preprocessing includes:
  - Runtime normalization
  - Release date parsing
  - Sentiment scoring of reviews

### 5. Sanity Checks & Visualizations
- Checks for duplicate entries.
- Aggregates number of reviews per movie.
- Visualizes trends using log-normalization.
- Plots stopword frequency charts.

---

## Requirements Used

- Python 3.11
- [IMDbPY](https://imdbpy.github.io/)
- Selenium
- BeautifulSoup
- pandas, numpy
- Apache Solr
- matplotlib, seaborn, plotly

---

## How to Run

1. **Install dependencies**  
   ```bash
   pip install -r requirements.txt
