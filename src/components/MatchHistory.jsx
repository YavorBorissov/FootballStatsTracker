import React, { useState } from "react";

const MatchHistory = ({ matches, deleteMatch, editMatch }) => {
  const matchesPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const sortedMatches = [...matches].sort((a, b) => new Date(b.date) - new Date(a.date));

  const totalPages = Math.ceil(sortedMatches.length / matchesPerPage);
  const indexOfLastMatch = currentPage * matchesPerPage;
  const indexOfFirstMatch = indexOfLastMatch - matchesPerPage;
  const currentMatches = sortedMatches.slice(indexOfFirstMatch, indexOfLastMatch);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  return (
    <div style={{ marginTop: "50px" }}>
      <h2 style={{ textAlign: "center" }}>Match History</h2>
      {matches.length === 0 ? (
        <p style={{ textAlign: "center" }}>No matches have been added yet.</p>
      ) : (
        <>
          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
            <thead>
              <tr style={{ backgroundColor: "#f2f2f2" }}>
                <th style={{ width: "10%", padding: "10px", border: "1px solid #ddd" }}>Match ID</th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>Winning Players</th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>Losing Players</th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentMatches.map((match) => {
                const matchId = match._id || "N/A";
                const winningPlayers = match.players
                  .filter((p) => p.result === "wins")
                  .map((p) => p.name)
                  .join(", ") || "None";
                const losingPlayers = match.players
                  .filter((p) => p.result === "losses")
                  .map((p) => p.name)
                  .join(", ") || "None";

                return (
                  <tr key={matchId}>
                    <td
                      style={{
                        width: "10%",
                        padding: "10px",
                        border: "1px solid #ddd",
                        whiteSpace: "nowrap",
                        textAlign: "center",
                      }}
                    >
                      {matchId}
                    </td>
                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>{winningPlayers}</td>
                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>{losingPlayers}</td>
                    <td style={{ padding: "10px", border: "1px solid #ddd", textAlign: "center" }}>
                      <button
                        onClick={() => deleteMatch(matchId)}
                        style={{
                          padding: "5px 10px",
                          backgroundColor: "#FF6347",
                          color: "white",
                          border: "none",
                          borderRadius: "5px",
                          cursor: "pointer",
                          marginRight: "5px",
                        }}
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => editMatch(matchId)}
                        style={{
                          padding: "5px 10px",
                          backgroundColor: "#28a745",
                          color: "white",
                          border: "none",
                          borderRadius: "5px",
                          cursor: "pointer",
                        }}
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
            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <button onClick={handlePrevPage} disabled={currentPage === 1} style={paginationButtonStyle}>
                Previous
              </button>
              <span style={{ fontSize: "16px", fontWeight: "bold" }}>
                Page {currentPage} of {totalPages}
              </span>
              <button onClick={handleNextPage} disabled={currentPage === totalPages} style={paginationButtonStyle}>
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

const paginationButtonStyle = {
  padding: "10px 15px",
  margin: "0 10px",
  backgroundColor: "#007BFF",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
};

export default MatchHistory;
