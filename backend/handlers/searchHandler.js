const solrClient = require('../solrClient');

function applySolrFilters(query, { languages = [], runtimes = [] }) {
    // Language filter
    if (languages.length > 0) {
      query.fq({field:"language", value:languages});
    }
  
    // Runtime filter with OR
    const runtimeQueries = runtimes.map(rt => {
      if (rt === "<90 mins") return "[0 TO 89]";
      if (rt === "90-120 mins") return "[90 TO 120]";
      if (rt === "120-150 mins") return "[121 TO 150]";
      if (rt === ">150 mins") return "[151 TO *]";
      return null;
    }).filter(Boolean);
  
    if (runtimeQueries.length > 0) {
      query.fq({field:"runtime_minutes", value:runtimeQueries});
    }
  
    return query;
  }  

const searchHandler = async (queryText, languageFilters, runtimeFilters) => {

    const results_dict = {
        found_exact: [],
        found_auto: false,
        movies: [],
        directors: [],
        stars: [],
        writers: [],
        moviesList: []
      };

    // 1. Search for Matches in Movie Names
	var moviesQuery = solrClient
        .query()
        .q(queryText || "*:*")
        .defType("edismax")
        .qf({ movie_name_autocomplete: 2 })
        .fl("movie_name")
        .rows(28097)

    moviesQuery = applySolrFilters(moviesQuery, {
        languages: languageFilters,
        runtimes: runtimeFilters
    });

    const moviesObj = await solrClient.search(moviesQuery);
    const moviesResults = moviesObj.response.docs
    const moviesList = [...new Set(moviesResults.map(doc => doc.movie_name))];
    const moviesFinal = moviesList.filter(name => name.toLowerCase().includes(queryText));

    if (moviesFinal.length > 0) {
        const exactMatch = moviesFinal.find(name => name.toLowerCase() === queryText.toLowerCase());
        if (exactMatch) {
            results_dict['movies'] = [exactMatch]
            results_dict['found_exact'].push('movie_name')
            return results_dict
        } else {
            results_dict['movies'].push(...moviesFinal)
            results_dict['found_auto'] = true
        }
    } 
    // If no search query entered, just search movies.
    if (queryText === "") {
        return results_dict
    }

    // 2. Search for Matches in Directors
	var directorQuery = solrClient
        .query()
        .q(queryText || "*:*")
        .defType("edismax")
        .qf({ directors_autocomplete: 2 })
        .fl("directors, movie_name")
        .rows(28097);

    directorQuery = applySolrFilters(directorQuery, {
        languages: languageFilters,
        runtimes: runtimeFilters
    });

    const directorObj = await solrClient.search(directorQuery);
    const directorResults = directorObj.response.docs;
    const directorList = [...new Set(directorResults.flatMap(doc => doc.directors || []))];
    const directorFinal = directorList.filter(name => name.toLowerCase().includes(queryText));

    if (directorFinal.length > 0) {
        const exactMatch = directorFinal.find(name => name.toLowerCase() === queryText.toLowerCase());
        if (exactMatch) {
            results_dict['directors'] = [exactMatch]
            results_dict['found_exact'].push('directors')

            const filteredResults = directorResults.flat().filter(item => 
                item.directors && item.directors.some(director => 
                    director.toLowerCase().includes(queryText.toLowerCase())
                )
              );
            const moviesFound = [...new Set(filteredResults.flatMap(doc => doc.movie_name || []))];
            results_dict['moviesList'].push(...moviesFound)
            return results_dict
        } else {
            results_dict['directors'].push(...directorFinal)
            results_dict['found_auto'] = true
        }
    } 

    // 3. Search for Matches in Stars
	var starsQuery = solrClient
        .query()
        .q(queryText || "*:*")
        .defType("edismax")
        .qf({ stars_autocomplete: 1 })
        .fl("stars, movie_name")
        .rows(28097);

    starsQuery = applySolrFilters(starsQuery, {
        languages: languageFilters,
        runtimes: runtimeFilters
    });

    const starsObj = await solrClient.search(starsQuery);
    const starsResults = starsObj.response.docs
    const starsList = [...new Set(starsResults.flatMap(doc => doc.stars || []))];
    const starsFinal = starsList.filter(name => name.toLowerCase().includes(queryText));

    if (starsFinal.length > 0) {
        const exactMatch = starsFinal.find(name => name.toLowerCase() === queryText.toLowerCase());
        if (exactMatch) {
            results_dict['stars'] = [exactMatch]
            results_dict['found_exact'].push('stars')

            const filteredResults = starsResults.flat().filter(item => 
                item.stars && item.stars.some(star => 
                  star.toLowerCase().includes(queryText.toLowerCase())
                )
              );
            const moviesFound = [...new Set(filteredResults.flatMap(doc => doc.movie_name || []))];
            results_dict['moviesList'].push(...moviesFound)
            return results_dict
        } else {
            results_dict['stars'].push(...starsFinal)
            results_dict['found_auto'] = true
        }
    } 

    // 4. Search for Matches in Writers
	var writersQuery = solrClient
        .query()
        .q(queryText || "*:*")
        .defType("edismax")
        .qf({ writers_autocomplete: 1 })
        .fl("writers, movie_name")
        .rows(28097);

    writersQuery = applySolrFilters(writersQuery, {
        languages: languageFilters,
        runtimes: runtimeFilters
    });

    const writersObj = await solrClient.search(writersQuery);
    const writersResults = writersObj.response.docs
    const writersList = [...new Set(writersResults.flatMap(doc => doc.writers || []))];
    const writersFinal = writersList.filter(name => name.toLowerCase().includes(queryText));

    if (writersFinal.length > 0) {
        const exactMatch = writersFinal.find(name => name.toLowerCase() === queryText.toLowerCase());
        if (exactMatch) {
            results_dict['writers'] = [exactMatch]
            results_dict['found_exact'].push('writers')

            const filteredResults = writersResults.flat().filter(item => 
                item.writers && item.writers.some(writer => 
                  writer.toLowerCase().includes(queryText.toLowerCase())
                )
              );
            const moviesFound = [...new Set(filteredResults.flatMap(doc => doc.movie_name || []))];
            results_dict['moviesList'].push(...moviesFound)

            return results_dict
        } else {
            results_dict['writers'].push(...writersFinal)
            results_dict['found_auto'] = true
        }
    } 

    return results_dict
}
module.exports = { searchHandler };