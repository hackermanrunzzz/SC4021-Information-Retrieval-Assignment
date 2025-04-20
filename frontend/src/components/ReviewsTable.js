import React, { useState } from "react";

// --- Styles ---
const cardStyle = {
  border: "1px solid #e0e0e0",
  borderRadius: "12px",
  padding: "16px",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
  backgroundColor: "#ffffff",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  boxSizing: "border-box",
  width: "100%",
};

const cardFooterStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: "auto",
  paddingTop: "10px",
  borderTop: "1px solid #eee",
  fontSize: "1.3rem",
  color: "#666",
};

const badgeBaseStyle = {
  display: "inline-block",
  padding: "6px 12px",
  borderRadius: "20px",
  fontWeight: "bold",
  fontSize: "0.85rem",
  marginTop: "10px",
  marginRight: "10px",
  alignSelf: "flex-start",
};

const sentimentColors = {
  positive: {
    backgroundColor: "#d4edda",
    color: "#155724",
  },
  negative: {
    backgroundColor: "#f8d7da",
    color: "#721c24",
  },
};

const emotionColors = {
  joy: {
    border: "1px solid #ffc000",
    color: "#ffc000",
  },
  sadness: {
    border: "1px solid #6FC4D3",
    color: "#6FC4D3",
  },
  anger: {
    border: "1px solid #E06666",
    color: "#E06666",
  },
  fear: {
    border: "1px solid #8e44ad",  // deep purple
    color: "#8e44ad",
  },
  love: {
    border: "1px solid #FF69B4",  // hot pink
    color: "#FF69B4",
  },
  surprise: {
    border: "1px solid #f39c12",  // bright orange
    color: "#f39c12",
  },
};

const tabStyle = (active) => ({
  padding: "8px 16px",
  marginRight: "10px",
  border: "1px solid #ccc",
  borderRadius: "8px",
  cursor: "pointer",
  backgroundColor: active ? "#007bff" : "#f1f1f1",
  color: active ? "#fff" : "#333",
  fontWeight: active ? "bold" : "normal",
});

const gridContainerStyle = {
  display: "flex",
  flexWrap: "wrap",
  gap: "20px",
  marginTop: "20px",
};


// --- Component ---
const ReviewsTable = ({ reviews }) => {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [sortBy, setSortBy] = useState(null);
  const [sortDirection, setSortDirection] = useState("desc"); // "dsc" by default

  const allTabs = ["all", "positive", "negative", "joy", "sadness", "anger", "fear", "love", "surprise", "sarcastic"];

  const filteredReviews = reviews
  .filter((r) => {
    if (selectedFilter === "all") return true;

    if (selectedFilter === "sarcastic") return r.sarcasm === 1;

    const sentiment = r.sentiment?.toLowerCase();
    const emotion = r.emotion?.toLowerCase();

    return sentiment === selectedFilter || emotion === selectedFilter;
  })
  .sort((a, b) => {
    if (!sortBy) return 0;

    // Fallback to 0 if values are undefined
    const valA = a[sortBy] ?? 0;
    const valB = b[sortBy] ?? 0;

    return sortDirection === "asc" ? valA - valB : valB - valA;
  });

  return (
    <div style={{ padding: "20px" }}>
      {/* Unified Filter Tabs */}
      <div style={{ marginBottom: "20px", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between" }}>
        {/* Tabs container */}
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {allTabs.map((tab) => (
            <div
              key={tab}
              style={tabStyle(selectedFilter === tab)}
              onClick={() => setSelectedFilter(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </div>
          ))}
        </div>

        {/* Sort Dropdown */}
        <div>
          <select
            value={sortBy ? `${sortBy}_${sortDirection}` : ""}
            onChange={(e) => {
              const [field, direction] = e.target.value.split("_");
              setSortBy(field);
              setSortDirection(direction);
            }}
            style={{ padding: "8px", borderRadius: "8px", border: "1px solid #ccc", marginLeft: "10px", fontSize: "16px" }}
          >
            <option value="">Sort by</option>
            <option value="upvotes_desc">Upvotes (highest to lowest)</option>
            <option value="upvotes_asc">Upvotes (lowest to highest)</option>
            <option value="downvotes_desc">Downvotes (highest to lowest)</option>
            <option value="downvotes_asc">Downvotes (lowest to highest)</option>
            <option value="rating_desc">Rating (highest to lowest)</option>
            <option value="rating_asc">Rating (lowest to highest)</option>
          </select>
        </div>
      </div>

      {/* Grid of Cards */}
      <div style={gridContainerStyle}>
        {filteredReviews.map((review) => {
          const sentiment = review.sentiment?.toLowerCase();
          const emotion = review.emotion?.toLowerCase();

          const sentimentBadgeStyle = {
            ...badgeBaseStyle,
            ...(sentimentColors[sentiment] || {})
          };

          const emotionBadgeStyle = {
            ...badgeBaseStyle,
            ...(emotionColors[emotion] || {})
          };

          const sarcasmBadgeStyle = {
            ...badgeBaseStyle,
            border: "1px dashed #999",
            color: "#999",
          };

          return (
            <div key={review.id} style={cardStyle}>
              {review.movie_name && (
                <p style={{ marginTop: "0", marginBottom: "0px", fontWeight: "bold", color: "#007bff" }}>
                  Movie Title: {review.movie_name}
                </p>
              )}
              <h3 style={{ marginTop: "5px", marginBottom: "10px", color: "#333" }}>
                {review.title}
              </h3>
              <p style={{ margin: "0 0 10px", color: "#555" }}>{review.body}</p>
          
              {/* NEW: Footer with votes & rating */}
              <div style={cardFooterStyle}>
                <div>
                  👍 {review.upvotes || 0} &nbsp;&nbsp;👎 {review.downvotes || 0}
                </div>
                {/* Tags */}
                <div style={{ display: "flex", flexWrap: "wrap" }}>
                  {sentiment && <span style={sentimentBadgeStyle}>{sentiment}</span>}
                  {emotion && <span style={emotionBadgeStyle}>{emotion}</span>}
                  {review.sarcasm === 1 && <span style={sarcasmBadgeStyle}>likely sarcastic</span>}
                </div>
                <div>
                  ⭐ {review.rating?.toFixed(1) || "N/A"}/10
                </div>
              </div>
          
              
            </div>
          );
          
        })}
      </div>
    </div>
  );
};

export default ReviewsTable;
