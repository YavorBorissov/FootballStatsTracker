import React, { useState, useEffect } from "react";
import matchHistoryStyles from "../styles/matchHistoryStyles";

const MatchHistory = ({ matches, deleteMatch, editMatch }) => {
  const matchesPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const totalPages = Math.ceil(matches.length / matchesPerPage);
    if (currentPage > totalPages) {
      setCurrentPage(Math.max(1, totalPages));
    }
  }, [currentPage, matches]);

  const sortedMatches = [...matches].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  const totalPages = Math.ceil(sortedMatches.length / matchesPerPage);
  const indexOfLastMatch = currentPage * matchesPerPage;
  const indexOfFirstMatch = indexOfLastMatch - matchesPerPage;
  const currentMatches = sortedMatches.slice(
    indexOfFirstMatch,
    indexOfLastMatch
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  return (
    <div style={matchHistoryStyles.container}>
      <h3 style={matchHistoryStyles.title}>Match History</h3>
      {matches.length === 0 ? (
        <p style={matchHistoryStyles.emptyState}>
          No matches have been added yet.
        </p>
      ) : (
        <>
          <table style={matchHistoryStyles.table}>
            <thead>
              <tr style={matchHistoryStyles.tableHeader}>
                <th style={{ ...matchHistoryStyles.tableCell, width: "10%" }}>
                  Match ID
                </th>
                <th style={matchHistoryStyles.tableCell}>Winning Players</th>
                <th style={matchHistoryStyles.tableCell}>Losing Players</th>
                <th style={{ ...matchHistoryStyles.tableCell, width: "10%" }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {currentMatches.map((match) => {
                const matchId = match._id || "N/A";
                const winningPlayers =
                  match.players
                    .filter((p) => p.result === "wins")
                    .map((p) => p.name)
                    .join(", ") || "None";
                const losingPlayers =
                  match.players
                    .filter((p) => p.result === "losses")
                    .map((p) => p.name)
                    .join(", ") || "None";

                return (
                  <tr key={matchId}>
                    <td style={matchHistoryStyles.tableCellCentered}>
                      {matchId}
                    </td>
                    <td style={matchHistoryStyles.tableCell}>
                      {winningPlayers}
                    </td>
                    <td style={matchHistoryStyles.tableCell}>
                      {losingPlayers}
                    </td>
                    <td style={matchHistoryStyles.tableCellCentered}>
                      <button
                        onClick={() => deleteMatch(matchId)}
                        style={matchHistoryStyles.buttonDelete}
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => editMatch(matchId)}
                        style={matchHistoryStyles.buttonEdit}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {totalPages > 1 && (
            <div style={matchHistoryStyles.paginationContainer}>
              <button
                onClick={handlePrevPage}
                style={matchHistoryStyles.paginationButton}
              >
                {"<"} Prev
              </button>
              <span style={matchHistoryStyles.paginationText}>
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={handleNextPage}
                style={matchHistoryStyles.paginationButton}
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

export default MatchHistory;
