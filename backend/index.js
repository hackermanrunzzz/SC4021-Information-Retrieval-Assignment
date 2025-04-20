const express = require("express");
const cors = require("cors");
const solrClient = require('./solrClient');
const reviewData = require("./data/reviewData");
const { searchHandler } = require("./handlers/searchHandler");

const app = express();
const PORT = 5000;
app.use(cors());
app.use(express.json());

solrClient.autoCommit = true;

// Retrieve data with sentiment
app.get("/api/reviews", (req, res) => {
	let all_reviews = [];
    for (const movie_name in reviewData) {
        const reviews = reviewData[movie_name];
        for (const review of reviews) {
            const review_with_title = { ...review, movie_name: movie_name };
            all_reviews.push(review_with_title);
        }
    }
    res.json(all_reviews);
});

// Querying with Solr Movie Names only
app.get("/api/reviews/search", async (req, res) => {

	const queryText = req.query.q.toLowerCase() || "";
	const languages = req.query.language || [];
	const runtimes = req.query.runtime || [];

	// Formatting
	const normalizeArray = (val) => Array.isArray(val) ? val : val ? [val] : [];
	const languageFilters = normalizeArray(languages);
	const runtimeFilters = normalizeArray(runtimes);

	// Search solr core
	const autocompleteMatchDict = await searchHandler(queryText, languageFilters, runtimeFilters)

	// If found_exact
	if ((autocompleteMatchDict.found_exact).length != 0){
		if (autocompleteMatchDict.found_exact.includes('movie_name')){
			const match = Object.keys(reviewData).find(key => key.toLowerCase() === queryText);
			const dataResults = reviewData[match];
			return res.json({ results: dataResults, suggestions: null, error: null });
		}
		else {
			return res.json({ results: [], suggestions: { movies: autocompleteMatchDict.moviesList, directors: [], stars: [], writers: [] }, error: "movie_suggestions" });
		}
	}

	// If found in autocomplete field
	if (autocompleteMatchDict.found_auto) {
		return res.json({ results: [], 
			suggestions: { movies: autocompleteMatchDict["movies"], directors:autocompleteMatchDict["directors"],
				stars: autocompleteMatchDict["stars"], writers: autocompleteMatchDict["writers"] },
			error: null
			});
	}
	else { // Randomly get 10 movie names
		const randomQuery = solrClient
			.query()
			.q('*:*')
			.rows(28097); 

		const obj = await solrClient.search(randomQuery);
		const randomMovies = obj.response.docs;
		const movie_list = [...new Set(randomMovies.map(doc => doc.movie_name))].slice(0, 10);
		return res.json({ resultsDict: {}, suggestions: {movies: movie_list}, error: null });
	}
});

app.get("/api/suggestions", async (req, res) => {
	const queryText = req.query.q?.toLowerCase() || "";
	
	var suggestionQuery = solrClient
        .query()
        .q(queryText || "*:*")
        .defType("edismax")
        .qf({ movie_name_autocomplete:1, writers_autocomplete:1, directors_autocomplete:1, stars_autocomplete:1 })
        .fl("movie_name, directors, writers, stars")
        .rows(28097)

    const suggestionsObj = await solrClient.search(suggestionQuery);
    const suggestionsResults = suggestionsObj.response.docs;

	const movieNames = [];
	const directors = [];
	const writers = [];
	const stars = [];

	suggestionsResults.forEach(item => {
		if (item.movie_name?.toLowerCase().includes(queryText) && !movieNames.includes(item.movie_name)) {
			movieNames.push(item.movie_name);
		}
		item.directors?.forEach(dir => {
			if (dir.toLowerCase().includes(queryText) && !directors.includes(dir)) {
			directors.push(dir);
			}
		});
		item.writers?.forEach(writer => {
			if (writer.toLowerCase().includes(queryText)&& !writers.includes(writer)) {
			writers.push(writer);
			}
		});
		item.stars?.forEach(star => {
			if (star.toLowerCase().includes(queryText) && !stars.includes(star)) {
			  stars.push(star);
			}
		  });
	})
	
	return res.json({ movie_suggestions: movieNames.slice(0,3), 
		directors_suggestions: directors.slice(0,3), 
		writers_suggestions: writers.slice(0,3), 
		stars_suggestions: stars.slice(0,3) });
})

app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
  });