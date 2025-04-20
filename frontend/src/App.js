import React, { useEffect, useState } from "react";
import Sidebar from "./components/SideBar";
import ReviewsTable from "./components/ReviewsTable";
import SentimentPieChart from "./components/SentimentPieChart";
import EmotionPieChart from "./components/EmotionPieChart";

const App = () => {
  const [reviews, setReviews] = useState([]);
  const [reviewCount, setReviewCount] = useState(0);
  const [sentiments, setSentiments] = useState({});
  const [emotions, setEmotions] = useState({});
  const [searchQuery, setSearchQuery] = useState("All Movies");
  const [searchError, setSearchError] = useState("");
  const [errorType, setErrorType] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  // Filters
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [selectedRuntimes, setSelectedRuntimes] = useState([]);

  // Helper functions
  const calculateSentiments = (reviewsArray) => {
    return reviewsArray.reduce((acc, review) => {
      acc[review.sentiment] = (acc[review.sentiment] || 0) + 1;
      return acc;
    }, {});
  };
  const calculateEmotions = (reviewsArray) => {
    return reviewsArray.reduce((acc, review) => {
      acc[review.emotion] = (acc[review.emotion] || 0) + 1;
      return acc;
    }, {});
  };

  useEffect(() => {
      fetch("http://localhost:5000/api/reviews")
      .then(res => res.json())
      .then(data => {
        const slicedData = data.slice(0, 100);
        setReviews(slicedData);
        setReviewCount(data.length);
        setSentiments(calculateSentiments(data));
        setEmotions(calculateEmotions(data));
      });  
    }, []);

  const handleSearch = (query) => {
    setSearchError(""); setErrorType("");
    const queryParams = new URLSearchParams();
    queryParams.append("q", query);
    selectedLanguages.forEach(lang => queryParams.append("language", lang));
    selectedRuntimes.forEach(rt => queryParams.append("runtime", rt));
  
    fetch(`http://localhost:5000/api/reviews/search?${queryParams.toString()}`)
      .then(res => res.json())
      .then(data => {
        if (data.suggestions && Object.keys(data.suggestions).length > 0) {
          setSuggestions(data.suggestions || []);
          setSearchError(query);
          if (data.error && data.error === "movie_suggestions") {
            setErrorType("movie_suggestions");
          }
        }
        else {
          setSearchQuery(query);
          setSuggestions([]);
          setReviews(data.results);
          setReviewCount(data.results.length);
          setSentiments(calculateSentiments(data.results));
          setEmotions(calculateEmotions(data.results));
        }
      });
  };

  const handleReset = () => {
    fetch("http://localhost:5000/api/reviews")
      .then(res => res.json())
      .then(data => {
        setReviews(data.slice(0,100))
        setReviewCount(data.length);
        setSearchQuery("All Movies");
        setSuggestions([]);
        setSelectedLanguages([]);
        setSelectedRuntimes([]);
        setSentiments(calculateSentiments(data));
        setEmotions(calculateEmotions(data));
      });
  };  

  return (
    <div style={{ display: "flex", height: "100%", overflowY: "scroll" }}>

      {/* Sidebar */}
      <Sidebar onSearch={handleSearch}
        onReset={handleReset}
        searchError={searchError}
        errorType={errorType}
        reviewCount={reviewCount}
        suggestions={suggestions}
        setSelectedLanguages={setSelectedLanguages}
        setSelectedRuntimes={setSelectedRuntimes}
        selectedLanguages={selectedLanguages}
        selectedRuntimes={selectedRuntimes}
      />

      {/* Contents */}
      <div style={{ flex: 1, overflowY: "scroll", }}>
        <h2 style={{paddingLeft: "20px", marginBottom:"0px", color: "#555"}}>Search Results</h2>
        {searchQuery && (
          <p style={{ paddingLeft: "20px", marginTop: "5px", marginBottom:"5px", fontSize: "40px", fontStyle: "italic" }}>
            For <strong style={{ color:"#007bff" }}>{searchQuery}</strong>
          </p>
        )}
        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", padding: "0 20px" }}>
          <div style={{ flex: 1, minWidth: "300px" }}>
            <SentimentPieChart data={sentiments} />
          </div>
          <div style={{ flex: 1, minWidth: "300px" }}>
            <EmotionPieChart data={emotions} />
          </div>
        </div>
        <ReviewsTable reviews={reviews} />
      </div>
    </div>
  );
};

export default App;