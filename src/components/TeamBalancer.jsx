import React, { useState, useEffect, useRef } from "react";

const TeamBalancer = ({ players }) => {
  const [inputPlayers, setInputPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [name, setName] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const containerRef = useRef(null);

  useEffect(() => {
    const savedPlayers = JSON.parse(localStorage.getItem("inputPlayers")) || [];
    const savedTeams = JSON.parse(localStorage.getItem("teams")) || [];
    setInputPlayers(savedPlayers);
    setTeams(savedTeams);
  }, []);

  useEffect(() => {
    localStorage.setItem("inputPlayers", JSON.stringify(inputPlayers));
    localStorage.setItem("teams", JSON.stringify(teams));
  }, [inputPlayers, teams]);

  const handleNameChange = (e) => {
    const input = e.target.value;
    setName(input);

    if (input) {
      const matches = players
        .map((player) => player.name)
        .filter((playerName) =>
          playerName.toLowerCase().startsWith(input.toLowerCase())
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

  const handleAddPlayer = () => {
    if (!name.trim()) return;

    const existingPlayer = players.find((p) => p.name === name);
    const newPlayer = {
      name,
      winRate: existingPlayer ? existingPlayer.winRate : 50,
    };

    if (!inputPlayers.some((player) => player.name === name)) {
      setInputPlayers((prev) => [...prev, newPlayer]);
    }
    setName("");
  };

  const clearPlayers = () => {
    setInputPlayers([]);
    setTeams([]);
    localStorage.removeItem("inputPlayers");
    localStorage.removeItem("teams");
  };

  const calculateTeams = () => {
    const sortedPlayers = [...inputPlayers].sort((a, b) => b.winRate - a.winRate);
  
    const team1 = [];
    const team2 = [];
  
    sortedPlayers.forEach((player) => {
      const totalWinRate1 = team1.reduce((sum, p) => sum + p.winRate, 0);
      const totalWinRate2 = team2.reduce((sum, p) => sum + p.winRate, 0);
  
      if (
        team1.length <= team2.length &&
        (totalWinRate1 <= totalWinRate2 || team1.length < team2.length)
      ) {
        team1.push(player);
      } else {
        team2.push(player);
      }
    });

    const newTeams = [
      {
        players: team1,
        totalWinRate: team1.reduce((sum, player) => sum + player.winRate, 0),
      },
      {
        players: team2,
        totalWinRate: team2.reduce((sum, player) => sum + player.winRate, 0),
      },
    ];
  
    setTeams(newTeams);
  };  

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setSuggestions([]);
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
        maxWidth: "600px",
        margin: "auto",
        marginTop: "50px",
        padding: "40px 20px",
        border: "1px solid #ccc",
        borderRadius: "10px",
        backgroundColor: "#f9f9f9",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "30px" }}>Team Balancer</h2>
      <div style={{ marginBottom: "30px", position: "relative" }}>
        <input
          type="text"
          value={name}
          onChange={handleNameChange}
          onKeyDown={handleKeyDown}
          placeholder="Enter player name"
          style={{
            width: "100%",
            padding: "10px",
            boxSizing: "border-box",
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
              padding: "0px 0",
              width: "100%",
              borderRadius: "5px",
            }}
          >
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                onClick={() => handleNameSelect(suggestion)}
                style={{
                  padding: "10px",
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
      <button
        onClick={handleAddPlayer}
        style={{
          width: "100%",
          padding: "10px",
          backgroundColor: "#007BFF",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          marginBottom: "20px",
        }}
      >
        Add Player
      </button>
      {inputPlayers.length > 0 && (
        <div style={{ marginBottom: "20px" }}>
          <h4>Added Players:</h4>
          <ul>
            {inputPlayers.map((player, index) => (
              <li key={index} style={{ marginBottom: "5px" }}>
                {player.name} - Win Rate: {player.winRate}%
              </li>
            ))}
          </ul>
        </div>
      )}
      <button
        onClick={calculateTeams}
        style={{
          width: "100%",
          padding: "10px",
          backgroundColor: "#28a745",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          marginBottom: "20px",
        }}
      >
        Calculate Teams
      </button>
      <button
        onClick={clearPlayers}
        style={{
          width: "100%",
          padding: "10px",
          backgroundColor: "#dc3545",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Clear Players
      </button>
      {teams.length > 0 && (
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
          {teams.map((team, index) => (
            <div
              key={index}
              style={{
                width: "48%",
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "5px",
                backgroundColor: "#fff",
              }}
            >
              <h4 style={{ textAlign: "center", marginBottom: "10px" }}>
                Team {index + 1} (Total Win Rate: {team.totalWinRate.toFixed(2)}%)
              </h4>
              <ul>
                {team.players.map((player, idx) => (
                  <li key={idx} style={{ marginBottom: "5px" }}>
                    {player.name} - Win Rate: {player.winRate}%
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeamBalancer;
