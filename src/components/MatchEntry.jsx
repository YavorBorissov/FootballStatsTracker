import React, { useState, useEffect, useRef } from "react";

const MatchEntry = ({ handlePlayerParticipation, finishMatchEntry, existingPlayers }) => {
  const [name, setName] = useState("");
  const [result, setResult] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const containerRef = useRef(null);

  const handleNameChange = (e) => {
    const input = e.target.value;
    setName(input);

    // Filter suggestions based on input
    if (input) {
      const matches = existingPlayers.filter((player) =>
        player.toLowerCase().startsWith(input.toLowerCase())
      );
      setSuggestions(matches);
    } else {
      setSuggestions([]);
    }
  };

  const handleNameSelect = (suggestion) => {
    setName(suggestion);
    setSuggestions([]);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Tab" && suggestions.length > 0) {
      e.preventDefault();
      setName(suggestions[0]); // Fill with the first suggestion
      setSuggestions([]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !result) {
      alert("Please enter a name and select a result.");
      return;
    }
    handlePlayerParticipation(name, result);
    setName("");
    setResult("");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setSuggestions([]); // Hide suggestions when clicking outside
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        maxWidth: "400px",
        margin: "auto",
        border: "1px solid #ccc",
        padding: "20px",
        borderRadius: "10px",
        backgroundColor: "#f9f9f9",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Add Player to Match</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px", position: "relative" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>Player Name:</label>
          <input
            type="text"
            value={name}
            onChange={handleNameChange}
            onKeyDown={handleKeyDown}
            placeholder="Enter player's name"
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />
          {suggestions.length > 0 && (
            <ul
              style={{
                position: "absolute",
                zIndex: 1,
                backgroundColor: "white",
                border: "1px solid #ccc",
                listStyle: "none",
                margin: 0,
                padding: "5px 0",
                width: "100%",
                borderRadius: "5px",
              }}
            >
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  onClick={() => handleNameSelect(suggestion)}
                  style={{
                    padding: "5px 10px",
                    cursor: "pointer",
                  }}
                  onMouseOver={(e) => (e.target.style.backgroundColor = "#f0f0f0")}
                  onMouseOut={(e) => (e.target.style.backgroundColor = "white")}
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>Result:</label>
          <select
            value={result}
            onChange={(e) => setResult(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          >
            <option value="">Select Result</option>
            <option value="wins">Win</option>
            <option value="losses">Loss</option>
            <option value="draws">Draw</option>
          </select>
        </div>
        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#007BFF",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Add Player
        </button>
      </form>
      <button
        onClick={finishMatchEntry}
        style={{
          marginTop: "20px",
          width: "100%",
          padding: "10px",
          backgroundColor: "#FF6347",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Finish Match Entry
      </button>
    </div>
  );
};

export default MatchEntry;
