# SC4021 Information Retrieval Project

As part of the SC4021 Information Retrieval coursework, this project involves the development of an information retrieval system integrated with sentiment analysis capabilities. The objective is to first crawl a relevant text corpus based on a self-selected topic, construct a searchable index over the collected data, and subsequently analyze the sentiment embedded within the documents.

The topic and dataset domain are flexible, allowing exploration in areas such as social media marketing, political discourse, healthcare trends, financial forecasting, or personalized recommendation systems. This flexibility enables the system to be tailored according to the team's area of interest while fulfilling the core technical requirements of corpus processing, query handling, and sentiment evaluation.

Team members who contributed to the success of the project:
1. Sky Lim En Xing
2. Vijayanarayanan Sai Arunavan
3. Jaslyn Tan Hui Shan
4. Xing Kun
5. Singhal Raghav

This repository contains the work done by SC4021-Information Retrieval Team 6 for the course project. The detailed explanation on how to compile and run the source codes are found in the README files in the subfolders of each of the sub-questions for the project.


## Problem Statement
In the age of digital media, online platforms like IMDb have become central hubs for users to express their opinions about films. These movie reviews are rich in sentiment, ranging from overt praise to subtle critique. However, the sheer volume and subjectivity of user-generated content make it difficult for potential viewers, researchers, and content creators to systematically interpret public opinion.

The objective of this project is to **perform sentiment analysis on IMDb movie review**s by classifying user opinions as positive or negative, while also **capturing the emotional tone of each review** (e.g., joy, anger, sadness). To further enhance interpretability and granularity, we also implemented:
* Aspect-Based Sentiment Analysis (ABSA) to identify sentiments tied to specific aspects of a movie (e.g., acting, plot, cinematography)
* Sarcasm Detection to mitigate misclassification caused by ironic or sarcastic reviews, which often reverse sentiment polarity

These enhancements enable a more precise and nuanced understanding of audience perception, improving applications such as targeted content recommendations and sentiment-driven marketing analytics.

Nonetheless, several challenges arise:
* Subjectivity and Nuance: Reviews often express mixed or layered sentiments and may include sarcasm that confuses traditional models.
* Aspect-Level Complexity: Unlike document-level sentiment, ABSA requires extracting relevant targets from within the review and associating them with sentiment phrases.
* Language Variability: Informal language, abbreviations, and inconsistent grammar reduce classification accuracy and complicate parsing.
* Emotional Layering: A single review may express multiple emotions simultaneously, requiring multi-class or multi-label handling.

By leveraging modern NLP techniques such as transformer-based models and task-specific fine-tuning, this project addresses these challenges through a robust pipeline that extracts sentiment polarity, emotional tone, specific aspect sentiments, and sarcastic cues from IMDb reviews.

## Navigating the Repository
The folders in the repository meets the requirements of the project individually. 

* **Question 1 (Indexing):** `web_scraping_and_indexing`
* **Question 2, 3 (UI + Search Engine):** `frontend`, `backend`, `solr-9.8.1`
* **Question 4 (Classifcation):** `sentiment_analysis`
* **Question 5 (Enhanced Classfication):** `classification_enhancement`

Each folder contains its own README file that describes the contents of the folder.

## How to set up the Web Application
To use the information retrieval system for movie reviews:

**Step 1**: 
* Make sure that you have Solr installed. https://solr.apache.org/downloads.html.
* Navigate to the `solr-9.8.1` folder and run:
```
bin/solr start
```

**Step 2:**: Navigate to the `backend` folder and run:
```
npm install 
node index.js
```

**Step 3:** Navigate to the `frontend` folder and run:
```
npm install
npm start
```

**Step 4:** Navigate to `localhost:3000` to access the application. 


## 📽️ Video Presentation
To conclude our work for the SC4021 Information Retrieval Course Assignment, our team prepared a short video presentation (~5 minutes) to showcase the applications, impact, and creative elements of our project.
You can watch our video at the following link:
(LINK)

## 📁 Submission Materials
### Data Files for Questions 3 & 5
A Google Drive link containing a compressed ZIP folder with all relevant data files used in Questions 3 and 5: (LINK)

### Source Code & Libraries for UI and Search Engine
All source code files, necessary libraries, and a README explaining how to compile and run the code are available here: LINK)


