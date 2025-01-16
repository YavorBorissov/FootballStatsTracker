import React from "react";

const PlayerList = ({ players }) => {
  return (
    <div>
      <h2>Player List</h2>
      {players.length === 0 ? (
        <p>No players added yet.</p>
      ) : (
        <ul>
          {players.map((player, index) => (
            <li key={index}>
              {player.name} - Wins: {player.wins}, Losses: {player.losses}, Draws: {player.draws}, Win Rate:{" "}
              {player.winRate.toFixed(2)}%, Participation: {player.participation}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PlayerList;
