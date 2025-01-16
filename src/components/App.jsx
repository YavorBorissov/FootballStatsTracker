import React, { useState, useEffect } from "react";
import PlayerTable from "./PlayerTable";
import MatchEntry from "./MatchEntry";
import PlayerChart from "./PlayerChart";
import MatchHistory from "./MatchHistory";
import TeamBalancer from "./TeamBalancer";

const App = () => {
  const [players, setPlayers] = useState([]);
  const [matches, setMatches] = useState([]);
  const [currentMatchId, setCurrentMatchId] = useState(null);
  const [isMatchEntry, setIsMatchEntry] = useState(false);
  const [sortedPlayers, setSortedPlayers] = useState(players);

  useEffect(() => {
    setSortedPlayers(players); // Ensure chart updates on initial load or player updates
  }, [players]);

  // Load data from localStorage
  useEffect(() => {
    const storedPlayers = JSON.parse(localStorage.getItem("players")) || [];
    const storedMatches = JSON.parse(localStorage.getItem("matches")) || [];
    setPlayers(storedPlayers);
    setMatches(storedMatches);
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem("players", JSON.stringify(players));
    localStorage.setItem("matches", JSON.stringify(matches));
  }, [players, matches]);

  const startMatchEntry = () => {
    const newMatchId = (matches.length > 0 ? Math.max(...matches.map(m => m.id)) : 0) + 1;
    setMatches(prev => [...prev, { id: newMatchId, players: [] }]);
    setCurrentMatchId(newMatchId);
    setIsMatchEntry(true);
  };

  const handlePlayerParticipation = (name, result) => {
    if (!currentMatchId) return;

    // Update player stats
    setPlayers(prevPlayers => {
      const existingPlayer = prevPlayers.find(p => p.name === name);

      if (existingPlayer) {
        return prevPlayers.map(player => {
          if (player.name === name) {
            const newWins = player.wins + (result === "wins" ? 1 : 0);
            const newLosses = player.losses + (result === "losses" ? 1 : 0);
            const newDraws = player.draws + (result === "draws" ? 1 : 0);
            const newParticipation = newWins + newLosses + newDraws;

            return {
              ...player,
              wins: newWins,
              losses: newLosses,
              draws: newDraws,
              participation: newParticipation,
              winRate: Math.round((newWins / newParticipation) * 100)
            };
          }
          return player;
        });
      }

      // Add new player
      return [...prevPlayers, {
        name,
        wins: result === "wins" ? 1 : 0,
        losses: result === "losses" ? 1 : 0,
        draws: result === "draws" ? 1 : 0,
        participation: 1,
        winRate: result === "wins" ? 100 : 0
      }];
    });

    // Add player to current match
    setMatches(prevMatches =>
      prevMatches.map(match => {
        if (match.id === currentMatchId) {
          return {
            ...match,
            players: [...match.players, { name, result }]
          };
        }
        return match;
      })
    );
  };

  const finishMatchEntry = () => {
    setCurrentMatchId(null);
    setIsMatchEntry(false);
  };

  const deleteMatch = (matchId) => {
    const matchToDelete = matches.find(match => match.id === matchId);
    if (!matchToDelete) return;

    // Update all players' stats at once
    setPlayers(prevPlayers => {
      const updatedPlayers = prevPlayers.map(player => {
        // Find all occurrences of this player in the match
        const playerInMatch = matchToDelete.players.find(p => p.name === player.name);
        if (!playerInMatch) return player;

        const newWins = player.wins - (playerInMatch.result === "wins" ? 1 : 0);
        const newLosses = player.losses - (playerInMatch.result === "losses" ? 1 : 0);
        const newDraws = player.draws - (playerInMatch.result === "draws" ? 1 : 0);
        const newParticipation = newWins + newLosses + newDraws;

        // Remove player if no matches left
        if (newParticipation === 0) return null;

        return {
          ...player,
          wins: newWins,
          losses: newLosses,
          draws: newDraws,
          participation: newParticipation,
          winRate: Math.round((newWins / newParticipation) * 100)
        };
      });

      return updatedPlayers.filter(Boolean); // Remove null entries
    });

    // Remove the match
    setMatches(prevMatches => prevMatches.filter(match => match.id !== matchId));
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "20px" }}>
      <h1 style={{ textAlign: "center" }}>Football Stats Tracker</h1>

      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <button
          onClick={startMatchEntry}
          disabled={isMatchEntry}
          style={{
            padding: "10px 20px",
            backgroundColor: isMatchEntry ? "#cccccc" : "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: isMatchEntry ? "default" : "pointer",
            fontSize: "16px",
          }}
        >
          Add New Match
        </button>
      </div>

      {isMatchEntry && (
        <MatchEntry
          finishMatchEntry={finishMatchEntry}
          handlePlayerParticipation={handlePlayerParticipation}
          existingPlayers={players.map(player => player.name)}
        />
      )}

      <PlayerTable players={players} onSortChange={setSortedPlayers} />
      <PlayerChart players={sortedPlayers} totalMatches={matches.length}/>
      <div style={{ textAlign: "center" }}>
        <h3>Total Matches: {matches.length}</h3>
      </div>
      <MatchHistory matches={matches} deleteMatch={deleteMatch} />
      <TeamBalancer players={players} />
    </div>
  );
};

export default App;