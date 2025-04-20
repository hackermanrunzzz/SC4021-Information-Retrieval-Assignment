import React, { useState, useEffect, useRef } from "react";
import { FaSearch } from "react-icons/fa";

const SearchBar = ({ onSearch, onReset }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSelectingSuggestion, setIsSelectingSuggestion] = useState(false);
  const dropdownRef = useRef();

  useEffect(() => {
    if (isSelectingSuggestion) {
      setIsSelectingSuggestion(false); // reset for next time
      return;
    }
  
    if (query.trim() === "") {
      setSuggestions([]);
      setShowDropdown(false); // also hide dropdown here
      return;
    }
  
    const fetchSuggestions = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/suggestions?q=${query}`);
        const data = await res.json();
        setSuggestions(data);
        setShowDropdown(true);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions({});
        setShowDropdown(false);
      }
    };
  
    fetchSuggestions();
  }, [query]);  

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(query);
    setShowDropdown(false);
  };

  const handleSuggestionClick = (e, suggestion) => {
    e.preventDefault();
    setQuery(suggestion);
    setIsSelectingSuggestion(true);
    onSearch(suggestion);
    setShowDropdown(false);
  };  

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    if (onReset) {
      setQuery("");       // Clear the search box
      setSuggestions([]); // Optional: clear suggestions
      setShowDropdown(false);
    }
  }, [onReset]);

  return (
    <form onSubmit={handleSearch} style={{ width: "100%" }}>
      <div style={{ position: "relative" }} ref={dropdownRef}>
        
        <div style={{ display: "flex", gap: "8px"}}>
          <input
            type="text"
            value={query}
            placeholder="Movie Title / Stars / Directors / Writers"
            onChange={(e) => setQuery(e.target.value)}
            style={{
              padding: "12px 16px",
              flexGrow: 1,
              width: "100%",
              borderRadius: "10px",
              border: "2px solid #ccc",
              fontSize: "16px",
              boxSizing: "border-box"
            }}
          />

          <button
            type="submit"
            style={{
              padding: "12px 16px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: "#007bff",
              color: "white",
              fontSize: "16px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <FaSearch />
          </button>
        </div>

        {showDropdown && Object.keys(suggestions).some(key => suggestions[key].length > 0) && (
          <div
            style={{
              marginTop: "5px",
              border: "1px solid #ccc",
              borderRadius: "6px",
              backgroundColor: "#fff",
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              zIndex: 1000,
              maxHeight: "300px",
              overflowY: "auto"
            }}
          >
            {["movie_suggestions", "directors_suggestions", "writers_suggestions", "stars_suggestions"].map((category) => (
              suggestions[category]?.length > 0 && (
                <div key={category} style={{ marginBottom: "10px" }}>
                  <div style={{ 
                    fontWeight: "bold", 
                    padding: "6px 10px", 
                    backgroundColor: "#f7f7f7", 
                    borderBottom: "1px solid #ddd",
                    fontSize: "14px",
                    textTransform: "capitalize"
                  }}>
                    {category.replace("_", " ")}
                  </div>
                  <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                    {suggestions[category].map((suggestion, i) => (
                      <li
                        key={`${category}-${i}`}
                        onMouseDown={(e) => handleSuggestionClick(e, suggestion)}
                        style={{
                          padding: "10px",
                          cursor: "pointer",
                          borderBottom: "1px solid #eee"
                        }}
                      >
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                </div>
              )
            ))}
          </div>
        )}
      </div>
    </form>
  );
};

export default SearchBar;
