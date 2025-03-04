import React, { useState, useEffect, useRef } from "react";
import teamBalancerStyles from "../styles/teamBalancerStyles";

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
    const sortedPlayers = [...inputPlayers].sort(
      (a, b) => b.winRate - a.winRate
    );

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
    <div ref={containerRef} style={teamBalancerStyles.container}>
      <h2 style={teamBalancerStyles.title}>Team Balancer</h2>
      <div style={teamBalancerStyles.inputContainer}>
        <input
          type="text"
          value={name}
          onChange={handleNameChange}
          onKeyDown={handleKeyDown}
          placeholder="Enter player name"
          style={teamBalancerStyles.input}
        />
        {suggestions.length > 0 && (
          <ul style={teamBalancerStyles.suggestionsList}>
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                onClick={() => handleNameSelect(suggestion)}
                style={teamBalancerStyles.suggestionItem}
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
      <button onClick={handleAddPlayer} style={teamBalancerStyles.addButton}>
        Add Player
      </button>
      {inputPlayers.length > 0 && (
        <div style={teamBalancerStyles.addedPlayersContainer}>
          <h4>Added Players:</h4>
          <ul>
            {inputPlayers.map((player, index) => (
              <li key={index} style={teamBalancerStyles.playerItem}>
                {player.name} - Win Rate: {player.winRate}%
              </li>
            ))}
          </ul>
        </div>
      )}
      <button
        onClick={calculateTeams}
        style={teamBalancerStyles.teamButton("#28a745")}
      >
        Calculate Teams
      </button>
      <button
        onClick={clearPlayers}
        style={teamBalancerStyles.teamButton("#dc3545")}
      >
        Clear Players
      </button>
      {teams.length > 0 && (
        <div style={teamBalancerStyles.teamsContainer}>
          {teams.map((team, index) => (
            <div key={index} style={teamBalancerStyles.teamBox}>
              <h4 style={teamBalancerStyles.teamTitle}>
                Team {index + 1} (Total Win Rate: {team.totalWinRate.toFixed(2)}
                %)
              </h4>
              <ul>
                {team.players.map((player, idx) => (
                  <li key={idx} style={teamBalancerStyles.playerItem}>
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
