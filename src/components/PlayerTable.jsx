import React, { useState } from "react";

const PlayerTable = ({ players, onSortChange }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

  const sortedPlayers = [...players].sort((a, b) => {
    if (!sortConfig.key || !sortConfig.direction) return 0;
    const aValue = typeof a[sortConfig.key] === "string" ? a[sortConfig.key].toLowerCase() : a[sortConfig.key];
    const bValue = typeof b[sortConfig.key] === "string" ? b[sortConfig.key].toLowerCase() : b[sortConfig.key];

    if (sortConfig.direction === "asc") {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else if (sortConfig.direction === "desc") {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
    return 0;
  });

  // Notify parent of the sorted players
  const handleSort = (key) => {
    setSortConfig((prev) => {
      const newConfig =
        prev.key === key
          ? prev.direction === "asc"
            ? { key, direction: "desc" }
            : prev.direction === "desc"
            ? { key: null, direction: null }
            : { key, direction: "asc" }
          : { key, direction: "asc" };

      if (newConfig.key) {
        const sorted = [...players].sort((a, b) => {
          const aValue = typeof a[newConfig.key] === "string" ? a[newConfig.key].toLowerCase() : a[newConfig.key];
          const bValue = typeof b[newConfig.key] === "string" ? b[newConfig.key].toLowerCase() : b[newConfig.key];
          return newConfig.direction === "asc"
            ? aValue < bValue
              ? -1
              : aValue > bValue
              ? 1
              : 0
            : aValue > bValue
            ? -1
            : aValue < bValue
            ? 1
            : 0;
        });
        onSortChange(sorted);
      } else {
        onSortChange(players);
      }

      return newConfig;
    });
  };

  const renderSortIndicator = (key) => {
    if (sortConfig.key !== key) return "";
    return sortConfig.direction === "asc" ? " ▲" : " ▼";
  };

  return (
    <div style={{ marginTop: "20px" }}>
      <h2 style={{ textAlign: "center" }}>Player Stats</h2>
      {players.length === 0 ? (
        <p style={{ textAlign: "center" }}>No players have been added yet.</p>
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
              <th
                style={{ padding: "10px", border: "1px solid #ddd", cursor: "pointer" }}
                onClick={() => handleSort("name")}
              >
                Name{renderSortIndicator("name")}
              </th>
              <th
                style={{ padding: "10px", border: "1px solid #ddd", cursor: "pointer" }}
                onClick={() => handleSort("wins")}
              >
                Wins{renderSortIndicator("wins")}
              </th>
              <th
                style={{ padding: "10px", border: "1px solid #ddd", cursor: "pointer" }}
                onClick={() => handleSort("losses")}
              >
                Losses{renderSortIndicator("losses")}
              </th>
              <th
                style={{ padding: "10px", border: "1px solid #ddd", cursor: "pointer" }}
                onClick={() => handleSort("draws")}
              >
                Draws{renderSortIndicator("draws")}
              </th>
              <th
                style={{ padding: "10px", border: "1px solid #ddd", cursor: "pointer" }}
                onClick={() => handleSort("participation")}
              >
                Participation{renderSortIndicator("participation")}
              </th>
              <th
                style={{ padding: "10px", border: "1px solid #ddd", cursor: "pointer" }}
                onClick={() => handleSort("winRate")}
              >
                Win Rate (%) {renderSortIndicator("winRate")}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedPlayers.map((player, index) => (
              <tr key={index}>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{player.name}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{player.wins}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{player.losses}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{player.draws}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{player.participation}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{Math.round(player.winRate)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PlayerTable;
