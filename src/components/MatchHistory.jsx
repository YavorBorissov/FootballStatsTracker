import React from "react";

const MatchHistory = ({ matches, deleteMatch }) => {
  return (
    <div style={{ marginTop: "50px" }}>
      <h2 style={{ textAlign: "center" }}>Match History</h2>
      {matches.length === 0 ? (
        <p style={{ textAlign: "center" }}>No matches have been added yet.</p>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "20px",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#f2f2f2" }}>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>Match ID</th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>Winning Players</th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>Losing Players</th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {matches.map((match) => {
              const winningPlayers = match.players
                .filter((p) => p.result === "wins")
                .map((p) => p.name)
                .join(", ");
              const losingPlayers = match.players
                .filter((p) => p.result === "losses")
                .map((p) => p.name)
                .join(", ");

              return (
                <tr key={match.id}>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>{match.id}</td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>{winningPlayers || "None"}</td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>{losingPlayers || "None"}</td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    <button
                      onClick={() => deleteMatch(match.id)}
                      style={{
                        padding: "5px 10px",
                        backgroundColor: "#FF6347",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MatchHistory;
