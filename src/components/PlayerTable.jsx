import React, { useState, useEffect } from "react";
import playerTableStyles from "../styles/playerTableStyles";

const PlayerTable = ({ players, onSortChange }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [sortedPlayers, setSortedPlayers] = useState([...players]);
  const [currentPage, setCurrentPage] = useState(0);
  const playersPerPage = 10;

  useEffect(() => {
    setSortedPlayers([...players]);
  }, [players]);

  const defaultSortOrder = {
    name: "asc",
    wins: "desc",
    losses: "asc",
    draws: "desc",
    participation: "desc",
    winRate: "desc",
  };

  const handleSort = (key) => {
    setSortConfig((prevConfig) => {
      const newDirection =
        prevConfig.key !== key
          ? defaultSortOrder[key]
          : prevConfig.direction === defaultSortOrder[key]
          ? defaultSortOrder[key] === "asc"
            ? "desc"
            : "asc"
          : null;

      if (!newDirection) {
        setSortedPlayers(players);
        onSortChange(players);
        return { key: null, direction: null };
      }

      const sorted = [...players].sort((a, b) => {
        const aValue = a[key] ?? 0;
        const bValue = b[key] ?? 0;

        if (typeof aValue === "number" && typeof bValue === "number") {
          return newDirection === "asc" ? aValue - bValue : bValue - aValue;
        }

        if (typeof aValue === "string" && typeof bValue === "string") {
          return newDirection === "asc"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }

        return 0;
      });

      setSortedPlayers(sorted);
      onSortChange(sorted);

      return { key, direction: newDirection };
    });
  };

  const renderSortIndicator = (key) => {
    if (sortConfig.key !== key) return "";
    return sortConfig.direction === "asc" ? " ▲" : " ▼";
  };

  const totalPages = Math.ceil(sortedPlayers.length / playersPerPage);
  const startIdx = currentPage * playersPerPage;
  const displayedPlayers = sortedPlayers.slice(
    startIdx,
    startIdx + playersPerPage
  );

  useEffect(() => {
    if (currentPage >= totalPages) {
      setCurrentPage(Math.max(0, totalPages - 1));
    }
  }, [currentPage, sortedPlayers, totalPages]);

  return (
    <div style={playerTableStyles.tableContainer}>
      <h3 style={playerTableStyles.textCenter}>Player Stats</h3>
      {players.length === 0 ? (
        <p style={playerTableStyles.textCenter}>
          No players have been added yet.
        </p>
      ) : (
        <>
          <table style={playerTableStyles.table}>
            <thead>
              <tr style={playerTableStyles.tableHeader}>
                <th
                  style={playerTableStyles.clickableHeader}
                  onClick={() => handleSort("name")}
                >
                  Name{renderSortIndicator("name")}
                </th>
                <th
                  style={playerTableStyles.clickableHeader}
                  onClick={() => handleSort("wins")}
                >
                  Wins{renderSortIndicator("wins")}
                </th>
                <th
                  style={playerTableStyles.clickableHeader}
                  onClick={() => handleSort("losses")}
                >
                  Losses{renderSortIndicator("losses")}
                </th>
                <th
                  style={playerTableStyles.clickableHeader}
                  onClick={() => handleSort("draws")}
                >
                  Draws{renderSortIndicator("draws")}
                </th>
                <th
                  style={playerTableStyles.clickableHeader}
                  onClick={() => handleSort("participation")}
                >
                  Participation{renderSortIndicator("participation")}
                </th>
                <th
                  style={playerTableStyles.clickableHeader}
                  onClick={() => handleSort("winRate")}
                >
                  Win Rate (%) {renderSortIndicator("winRate")}
                </th>
              </tr>
            </thead>
            <tbody>
              {displayedPlayers.map((player, index) => (
                <tr key={index}>
                  <td style={playerTableStyles.tableCell}>{player.name}</td>
                  <td style={playerTableStyles.tableCell}>{player.wins}</td>
                  <td style={playerTableStyles.tableCell}>{player.losses}</td>
                  <td style={playerTableStyles.tableCell}>{player.draws}</td>
                  <td style={playerTableStyles.tableCell}>
                    {player.participation}
                  </td>
                  <td style={playerTableStyles.tableCell}>
                    {Math.round(player.winRate)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {totalPages > 1 && (
            <div style={playerTableStyles.paginationContainer}>
              <button
                style={playerTableStyles.paginationButton}
                onClick={() => setCurrentPage((prev) => prev - 1)}
              >
                {"<"} Prev
              </button>
              <span style={playerTableStyles.paginationText}>
                Page {currentPage + 1} of {totalPages}
              </span>
              <button
                style={playerTableStyles.paginationButton}
                onClick={() => setCurrentPage((prev) => prev + 1)}
              >
                Next {">"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PlayerTable;
