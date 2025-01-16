import React, { useState } from "react";

const PlayerForm = ({ addPlayer }) => {
  const [name, setName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    addPlayer({ name, wins: 0, losses: 0, draws: 0, participation: 0 });
    setName("");
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: "400px", margin: "auto" }}>
      <h2>Add Player</h2>
      <div style={{ marginBottom: "10px" }}>
        <label htmlFor="name">Player Name:</label>
        <input
          id="name"
          type="text"
          placeholder="Enter player's name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{ width: "100%", padding: "8px", marginTop: "5px" }}
        />
      </div>
      <button type="submit" style={{ padding: "10px 20px", cursor: "pointer" }}>
        Add Player
      </button>
    </form>
  );
};

export default PlayerForm;
