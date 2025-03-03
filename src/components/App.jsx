import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import PlayerTable from "./PlayerTable";
import MatchEntry from "./MatchEntry";
import PlayerChart from "./PlayerChart";
import MatchHistory from "./MatchHistory";
import TeamBalancer from "./TeamBalancer";

const API_URL = "http://localhost:5000";

const App = () => {
  const [players, setPlayers] = useState([]);
  const [matches, setMatches] = useState([]);
  const [currentMatchId, setCurrentMatchId] = useState(null);
  const [isMatchEntry, setIsMatchEntry] = useState(false);
  const [sortedPlayers, setSortedPlayers] = useState(players);
  const [matchToEdit, setMatchToEdit] = useState(null);

  const matchEntryRef = useRef(null);

  useEffect(() => {
    setSortedPlayers(players);
  }, [players]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const playersRes = await axios.get(`${API_URL}/players`);
        const matchesRes = await axios.get(`${API_URL}/matches`);
        setPlayers(playersRes.data);
        setMatches(matchesRes.data);
      } catch (error) {
        console.error("⚠️ Error fetching data:", error.response?.data || error.message);
      }
    };
    fetchData();
  }, []);

  const startMatchEntry = async () => {
    try {
      const response = await axios.post(`${API_URL}/matches`, { players: [] });
      setMatches((prev) => [...prev, response.data]);
      setCurrentMatchId(response.data._id);
      setIsMatchEntry(true);

      setTimeout(() => {
        matchEntryRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 200);
      
    } catch (error) {
      console.error("⚠️ Error creating match:", error.response?.data || error.message);
    }
  };

  const handlePlayerParticipation = async (name, result) => {
    if (!currentMatchId) return;

    try {
      const currentMatch = matches.find((match) => match._id === currentMatchId);
      if (!currentMatch) return;

      const isPlayerAlreadyInMatch = currentMatch.players.some((player) => player.name === name);
      if (isPlayerAlreadyInMatch) {
        alert(`${name} is already added to this match!`);
        return;
      }

      const updatedMatchPlayers = [...currentMatch.players, { name, result }];
      setMatches((prevMatches) =>
        prevMatches.map((match) =>
          match._id === currentMatchId ? { ...match, players: updatedMatchPlayers } : match
        )
      );

      await axios.put(`${API_URL}/matches/${currentMatchId}`, { players: updatedMatchPlayers });

      const response = await axios.post(`${API_URL}/players`, { name, result });
      setPlayers((prevPlayers) =>
        prevPlayers.some((p) => p.name === name)
          ? prevPlayers.map((p) => (p.name === name ? response.data : p))
          : [...prevPlayers, response.data]
      );
    } catch (error) {
      console.error("⚠️ Error updating player:", error);
    }
  };

  const finishMatchEntry = () => {
    setCurrentMatchId(null);
    setIsMatchEntry(false);
    setMatchToEdit(null);
  };

  const deleteMatch = async (matchId) => {
    try {
      await axios.delete(`${API_URL}/matches/${matchId}`);
      const updatedMatches = matches.filter((match) => match._id !== matchId);
      setMatches(updatedMatches);

      if (updatedMatches.length === 0) {
        setPlayers([]);
      } else {
        const updatedPlayersRes = await axios.get(`${API_URL}/players`);
        setPlayers(updatedPlayersRes.data);
      }

      console.log("✅ Match deleted and player stats updated.");
    } catch (error) {
      console.error("⚠️ Error deleting match:", error.response?.data || error.message);
    }
  };

  const editMatch = (matchId) => {
    const match = matches.find((m) => m._id === matchId);
    if (!match) return;

    setMatchToEdit(match);
    setCurrentMatchId(match._id);
    setIsMatchEntry(true);

    setTimeout(() => {
      matchEntryRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 200);
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
        <div ref={matchEntryRef}>
          <MatchEntry
            finishMatchEntry={finishMatchEntry}
            handlePlayerParticipation={handlePlayerParticipation}
            existingPlayers={players.map((player) => player.name)}
            matchToEdit={matchToEdit}
          />
        </div>
      )}

      <PlayerTable players={players} onSortChange={setSortedPlayers} />
      <PlayerChart players={sortedPlayers} totalMatches={matches.length} />
      <div style={{ textAlign: "center" }}>
        <h3>Total Matches: {matches.length}</h3>
      </div>
      <MatchHistory matches={matches} deleteMatch={deleteMatch} editMatch={editMatch} />
      <TeamBalancer players={players} />
    </div>
  );
};

export default App;
