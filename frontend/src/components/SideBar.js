import SearchBar from "./SearchBar";
import { FaHome } from "react-icons/fa";
import React, { useEffect, useState } from "react";

const Sidebar = ({   
  onSearch,
  onReset,
  searchError,
  errorType,
  reviewCount,
  suggestions,
  selectedLanguages,
  selectedRuntimes,
  setSelectedLanguages,
  setSelectedRuntimes
}) => {

  const [showMoreLanguages, setShowMoreLanguages] = useState(false);

  const allLanguages = [
    "English", "Spanish", "French", "Russian", "Bengali", "Japanese", "Hungarian", "Hindi", "German", "Romanian",
    "Arabic", "Madarin", "Portugese", "Telugu", "Malayalam", "Kannada", "Turkish", "Latin", "Korean", "Tamil", "Norwegian",
    "Hungarian", "Thai"
  ];

  const visibleLanguages = showMoreLanguages ? allLanguages : allLanguages.slice(0, 5);

  const toggleLanguage = (lang) => {
    setSelectedLanguages(prev =>
      prev.includes(lang) ? prev.filter(l => l !== lang) : [...prev, lang]
    );
  };

  const toggleRuntime = (runtime) => {
    setSelectedRuntimes(prev =>
      prev.includes(runtime) ? prev.filter(r => r !== runtime) : [...prev, runtime]
    );
  };

  const filterContainerStyle = {
    backgroundColor: "#fff",
    border: "1px solid #ccc",
    borderRadius: "10px",
    padding: "20px",
    marginTop: "10px",
    marginBottom: "15px"
  };
  
  const filterButtonStyle = {
    padding: "6px 6px",
    border: "none",
    backgroundColor: "transparent",
    cursor: "pointer",
    fontWeight: "500",
    display: "flex",
    alignItems: "center",
    gap: "6px"
  };
  
  const checkboxStyle = (isSelected) => ({
    width: "16px",
    height: "16px",
    display: "inline-block",
    border: "2px solid #007bff",
    borderRadius: "3px",
    textAlign: "center",
    fontSize: "12px",
    lineHeight: "12px",
    backgroundColor: isSelected ? "#007bff" : "#fff",
    color: isSelected ? "#fff" : "#007bff"
  });  

  const moreButtonStyle = {
      marginTop: "5px",
      padding: "4px 4px",
      border: "none",
      background: "none",
      color: "#007bff",
      cursor: "pointer",
      fontWeight: "500",
      textDecoration: "underline"
  }
  
    return (
    <div style={{ width: "25%", paddingLeft: "30px", padding: "20px", background: "#f2f2f2"}}>

      <div style={{ textAlign: "center" }}>
        <button
          onClick={onReset}
          title="Reset to Home"
          style={{
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "50%",
            padding: "12px",
            cursor: "pointer",
            width: "48px",
            height: "48px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <FaHome size={20} />
        </button>
      </div>

      <h1 style={{ fontSize: "70px", marginTop:"5px", marginBottom: "5px", textAlign: "center" }}>{reviewCount}</h1>
      <p style={{ textAlign: "center", marginTop: "0px", marginBottom: "35px" }}>Number of reviews</p>

      <p style={{ marginLeft: "20px", marginBottom: "0px", fontWeight: "bold", fontSize:"20px" }}>Search for Movie Reviews</p>
      
      <div style={filterContainerStyle}>

        {/* Language Filters */}
        <div style={{ marginBottom: "20px" }}>
          <p style={{marginBottom: "5px", marginTop: "0px", fontWeight: "bold"}}>Filter by Language:</p>
          <div style={{display: "flex", flexWrap: "wrap", gap: "8px"}}>
            {visibleLanguages .map((lang) => {
              const isSelected = selectedLanguages.includes(lang);
              return (
                <button
                  key={lang}
                  onClick={() => toggleLanguage(lang)}
                  style={filterButtonStyle}
                >
                  <span style={checkboxStyle(isSelected)}>
                    {isSelected ? "✓" : ""}
                  </span>
                  {lang}
                </button>
              );
            })}
          </div>
          {allLanguages.length > 5 && (
            <button
              onClick={() => setShowMoreLanguages(!showMoreLanguages)}
              style={moreButtonStyle}
            >
              {showMoreLanguages ? "Show Less" : "Show More"}
            </button>
          )}
        </div>

        {/* Runtime Filters */}
        <div>
          <p style={{marginBottom: "5px", marginTop: "0px", fontWeight: "bold"}}>Filter by Runtime:</p>
          <div style={{display: "flex", flexWrap: "wrap", gap: "8px"}}>
            {["<90 mins", "90-120 mins", "120-150 mins", ">150 mins"].map((runtime) => {
              const isSelected = selectedRuntimes.includes(runtime);
              return (
                <button
                  key={runtime}
                  onClick={() => toggleRuntime(runtime)}
                  style={filterButtonStyle}
                >
                  <span style={checkboxStyle(isSelected)}>
                    {isSelected ? "✓" : ""}
                  </span>
                  {runtime}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <SearchBar onSearch={onSearch} onReset={onReset} />
      
      {/* suggestions */}
      {Object.values(suggestions).some(arr => arr.length > 0) && (
        <div style={{ marginTop: "30px" }}>
          
          <p style={{ fontWeight: "bold", marginBottom: "10px", color: "#FF0000" }}>
            {errorType === "movie_suggestions"
              ? `You searched for '${searchError}'. Your search directed/wrote/starred in these movies:`
              : `No records found for '${searchError}'. Did you mean these?`}
          </p>

          {Object.entries(suggestions).map(([category, items]) => {
            if (items.length === 0) return null;

            const capitalized = category.charAt(0).toUpperCase() + category.slice(1);

            return (
              <div key={category} style={{ marginBottom: "20px" }}>
                <p style={{ fontWeight: "bold", marginBottom: "6px" }}>{capitalized}:</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {items.map((suggestion, idx) => (
                    <div
                      key={idx}
                      onClick={() => onSearch(suggestion)}
                      style={{
                        cursor: "pointer",
                        backgroundColor: "#e6f0ff",
                        color: "#007bff",
                        borderRadius: "20px",
                        padding: "6px 14px",
                        fontSize: "14px",
                        fontWeight: "500",
                        border: "1px solid #007bff",
                        transition: "background-color 0.2s",
                      }}
                      onMouseOver={(e) => {
                        e.target.style.backgroundColor = "#cce0ff";
                      }}
                      onMouseOut={(e) => {
                        e.target.style.backgroundColor = "#e6f0ff";
                      }}
                    >
                      {suggestion}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}



    </div>
  );
};

export default Sidebar;