# Backend Code
This folder contains the code for the backend of the system, serving as the bridge between Solr client and the frontend. 

The backend is responsible for:
* Communicating with the Solr server
* Handling HTTP GET requests from the frontend
* Formatting and returning relevant data

The output of the sentiment analysis and enhancement implementations can be found in `data/reviewData.js`. This file is used for displaying the movie reviews after querying.

## How to start the application
Step 1. In this directory, run to start the backend:
```
npm install
node index.js
```

Step 2. Navigate to `solr-9.8.1` folder and run:
```
bin/solr start
```

Step 3. Navigate to `frontend` folder and run:
```
npm install
npm start
```

Step 4. Navigate to `localhost:3000` to access the application. 
