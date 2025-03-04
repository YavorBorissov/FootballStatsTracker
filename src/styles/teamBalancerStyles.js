const teamBalancerStyles = {
    container: {
        maxWidth: "600px",
        margin: "auto",
        marginTop: "50px",
        padding: "40px 20px",
        border: "1px solid #ccc",
        borderRadius: "10px",
        backgroundColor: "#f9f9f9",
    },
    title: {
        textAlign: "center",
        marginBottom: "30px",
    },
    inputContainer: {
        marginBottom: "30px",
        position: "relative",
    },
    input: {
        width: "100%",
        padding: "10px",
        boxSizing: "border-box",
        borderRadius: "5px",
        border: "1px solid #ccc",
    },
    suggestionsList: {
        position: "absolute",
        zIndex: 1,
        backgroundColor: "white",
        border: "1px solid #ccc",
        listStyle: "none",
        margin: 0,
        padding: "5px 0",
        width: "100%",
        borderRadius: "5px",
    },
    suggestionItem: {
        padding: "10px",
        cursor: "pointer",
    },
    addButton: {
        width: "100%",
        padding: "10px",
        backgroundColor: "#007BFF",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        marginBottom: "20px",
    },
    addedPlayersContainer: {
        marginBottom: "20px",
    },
    teamButton: (color) => ({
        width: "100%",
        padding: "10px",
        backgroundColor: color,
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        marginBottom: "20px",
    }),
    teamsContainer: {
        display: "flex",
        justifyContent: "space-between",
        marginTop: "20px",
    },
    teamBox: {
        width: "48%",
        padding: "10px",
        border: "1px solid #ccc",
        borderRadius: "5px",
        backgroundColor: "#fff",
    },
    teamTitle: {
        textAlign: "center",
        marginBottom: "10px",
    },
    playerItem: {
        marginBottom: "5px",
    },
};

export default teamBalancerStyles;
