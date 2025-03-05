import React, { useState, useEffect, useRef } from "react";
import matchEntryStyles from "../styles/matchEntryStyles";

const MatchEntry = ({
  handlePlayerParticipation,
  finishMatchEntry,
  existingPlayers,
  matchToEdit,
}) => {
  const [name, setName] = useState("");
  const [result, setResult] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [playersInMatch, setPlayersInMatch] = useState(
    matchToEdit ? matchToEdit.players : []
  );
  const containerRef = useRef(null);

  useEffect(() => {
    if (matchToEdit) {
      setPlayersInMatch(matchToEdit.players);
    }
  }, [matchToEdit]);

  const handleNameChange = (e) => {
    const input = e.target.value;
    setName(input);

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
      setName(suggestions[0]);
      setSuggestions([]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !result) {
      alert("Please enter a name and select a result.");
      return;
    }

    const newPlayer = { name, result };

    if (playersInMatch.some((p) => p.name === name)) {
      alert(`${name} is already in this match!`);
      return;
    }

    setPlayersInMatch((prev) => [...prev, newPlayer]);
    handlePlayerParticipation(name, result);

    setName("");
    setResult("");
  };

  const handleRemovePlayer = (playerName) => {
    setPlayersInMatch((prev) => prev.filter((p) => p.name !== playerName));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setSuggestions([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={containerRef} style={matchEntryStyles.container}>
      <h2 style={matchEntryStyles.heading}>Add Players to Match</h2>

      <form onSubmit={handleSubmit}>
        <div style={matchEntryStyles.inputContainer}>
          <label style={matchEntryStyles.label}>Player Name:</label>
          <input
            type="text"
            value={name}
            onChange={handleNameChange}
            onKeyDown={handleKeyDown}
            placeholder="Enter player's name"
            style={matchEntryStyles.input}
          />
          {suggestions.length > 0 && (
            <ul style={matchEntryStyles.suggestions}>
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  onClick={() => handleNameSelect(suggestion)}
                  style={matchEntryStyles.suggestionItem}
                  onMouseOver={(e) =>
                    (e.target.style.backgroundColor = "#f0f0f0")
                  }
                  onMouseOut={(e) => (e.target.style.backgroundColor = "white")}
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div style={matchEntryStyles.inputContainer}>
          <label style={matchEntryStyles.label}>Result:</label>
          <select
            value={result}
            onChange={(e) => setResult(e.target.value)}
            style={matchEntryStyles.input}
          >
            <option value="">Select Result</option>
            <option value="wins">Win</option>
            <option value="losses">Loss</option>
            <option value="draws">Draw</option>
          </select>
        </div>

        <button type="submit" style={matchEntryStyles.button}>
          Add Player
        </button>
      </form>

      <div style={matchEntryStyles.playersContainer}>
        {playersInMatch.length === 0 ? (
          <p style={matchEntryStyles.emptyState}>No players added yet</p>
        ) : (
          playersInMatch.map((p, index) => (
            <div key={index} style={matchEntryStyles.playerItem}>
              {p.name}{" "}
              <span
                style={
                  p.result === "wins"
                    ? matchEntryStyles.winnerTag
                    : p.result === "losses"
                    ? matchEntryStyles.loserTag
                    : matchEntryStyles.drawTag
                }
              >
                ({p.result === "wins" ? "W" : p.result === "losses" ? "L" : "D"}
                )
              </span>
              <button
                onClick={() => handleRemovePlayer(p.name)}
                style={matchEntryStyles.removeButton}
              >
                ❌
              </button>
            </div>
          ))
        )}
      </div>

      <button onClick={finishMatchEntry} style={matchEntryStyles.finishButton}>
        Finish Match Entry
      </button>
    </div>
  );
};

export default MatchEntry;
