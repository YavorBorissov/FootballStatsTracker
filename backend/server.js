require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

mongoose
    .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("✅ MongoDB Connected"))
    .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Define Player Schema
const playerSchema = new mongoose.Schema({
    name: String,
    wins: { type: Number, default: 0 },
    losses: { type: Number, default: 0 },
    draws: { type: Number, default: 0 },
    participation: { type: Number, default: 0 },
    winRate: { type: Number, default: 0 },
});

const Player = mongoose.model("Player", playerSchema);

// Define Match Schema
const matchSchema = new mongoose.Schema({
    players: [{ name: String, result: String }],
    date: { type: Date, default: Date.now },
});

const Match = mongoose.model("Match", matchSchema);

// ✅ API Routes

app.get("/", (req, res) => {
    res.send("⚽ Football Tracker API is running!");
});

// ✅ Get all players
app.get("/players", async (req, res) => {
    try {
        const players = await Player.find();
        res.json(players);
    } catch (error) {
        console.error("⚠️ Error fetching players:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// ✅ Add or Update a player
app.post("/players", async (req, res) => {
    try {
        const { name, result } = req.body;
        if (!name || !result) {
            return res.status(400).json({ message: "Missing player name or result." });
        }

        let player = await Player.findOne({ name });

        if (player) {
            // Update stats
            player[result]++;
            player.participation = player.wins + player.losses + player.draws;
            player.winRate = player.participation > 0 ? Math.round((player.wins / player.participation) * 100) : 0;
            await player.save();
        } else {
            // Create new player
            player = new Player({
                name,
                wins: result === "wins" ? 1 : 0,
                losses: result === "losses" ? 1 : 0,
                draws: result === "draws" ? 1 : 0,
                participation: 1,
                winRate: result === "wins" ? 100 : 0,
            });
            await player.save();
        }

        res.json(player);
    } catch (error) {
        console.error("⚠️ Error updating player:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// ✅ Get match history
app.get("/matches", async (req, res) => {
    try {
        const matches = await Match.find();
        res.json(matches);
    } catch (error) {
        console.error("⚠️ Error fetching matches:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// ✅ Add a new match
app.post("/matches", async (req, res) => {
    try {
        const match = new Match({ players: req.body.players });
        const savedMatch = await match.save();
        res.json(savedMatch); // Ensure response includes _id
    } catch (error) {
        console.error("⚠️ Error creating match:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// ✅ Update a match (Fix for 404 error)
app.put("/matches/:id", async (req, res) => {
    try {
        const matchId = req.params.id;
        const { players } = req.body;

        const updatedMatch = await Match.findByIdAndUpdate(
            matchId,
            { players },
            { new: true, runValidators: true }
        );

        if (!updatedMatch) {
            return res.status(404).json({ message: "Match not found" });
        }

        res.json(updatedMatch);
    } catch (error) {
        console.error("⚠️ Error updating match:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// ✅ Delete a match
app.delete("/matches/:id", async (req, res) => {
    try {
        const matchId = req.params.id;
        const match = await Match.findById(matchId);

        if (!match) {
            return res.status(404).json({ message: "Match not found" });
        }

        // Update player participation
        for (const playerData of match.players) {
            const { name, result } = playerData;
            const player = await Player.findOne({ name });

            if (player) {
                // Subtract stats for the deleted match
                player[result] = Math.max(0, player[result] - 1);
                player.participation = Math.max(0, player.wins + player.losses + player.draws);
                player.winRate = player.participation > 0 ? Math.round((player.wins / player.participation) * 100) : 0;

                if (player.participation === 0) {
                    // Remove player if they no longer have any matches
                    await Player.deleteOne({ name });
                } else {
                    await player.save();
                }
            }
        }

        // Delete the match after updating players
        await Match.findByIdAndDelete(matchId);

        // If there are no matches left, delete all players
        const remainingMatches = await Match.countDocuments();
        if (remainingMatches === 0) {
            await Player.deleteMany({});
        }

        res.json({ message: "✅ Match deleted, player stats updated." });
    } catch (error) {
        console.error("⚠️ Error deleting match:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// ✅ Bulk update players (used for match deletion)
app.post("/players/update-all", async (req, res) => {
    try {
        const { players } = req.body;
        if (!Array.isArray(players)) {
            return res.status(400).json({ message: "Invalid player data format" });
        }

        // Update players in database
        for (let playerData of players) {
            await Player.findOneAndUpdate({ name: playerData.name }, playerData, { new: true });
        }

        res.json({ message: "✅ Players updated successfully" });
    } catch (error) {
        console.error("⚠️ Error updating players:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// ✅ Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
