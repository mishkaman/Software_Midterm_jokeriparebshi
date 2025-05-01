"use strict";
// backend/src/server.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const algorithm_1 = require("./logic/algorithm");
const flashcards_1 = require("./logic/flashcards");
const state_1 = require("./state");
// --- Setup ---
const app = (0, express_1.default)();
const PORT = Number(process.env.PORT) || 3001; // ✅ Ensure PORT is a number
// --- Middleware ---
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// --- Routes ---
// GET /api/practice
app.get("/api/practice", (req, res) => {
    try {
        const day = (0, state_1.getCurrentDay)();
        const bucketMap = (0, state_1.getBuckets)();
        const bucketSets = (0, algorithm_1.toBucketSets)(bucketMap);
        const practiceSet = (0, algorithm_1.practice)(bucketSets, day);
        const cardsArray = Array.from(practiceSet);
        console.log(`Serving ${cardsArray.length} practice cards for day ${day}`);
        res.json({ cards: cardsArray, day });
    }
    catch (err) {
        console.error("Error in /api/practice:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});
// POST /api/update
app.post("/api/update", (req, res) => {
    try {
        const { cardFront, cardBack, difficulty } = req.body;
        if (![
            flashcards_1.AnswerDifficulty.Wrong,
            flashcards_1.AnswerDifficulty.Hard,
            flashcards_1.AnswerDifficulty.Easy,
        ].includes(difficulty)) {
            return res.status(400).json({ error: "Invalid difficulty value" });
        }
        const card = (0, state_1.findCard)(cardFront, cardBack);
        if (!card) {
            return res.status(404).json({ error: "Card not found" });
        }
        const buckets = (0, state_1.getBuckets)();
        const previousBucket = (0, state_1.findCardBucket)(card);
        if (previousBucket === undefined) {
            return res
                .status(500)
                .json({ error: "Previous bucket not found for the card" });
        }
        const updatedBuckets = (0, algorithm_1.update)(buckets, card, difficulty);
        (0, state_1.setBuckets)(updatedBuckets);
        const newBucket = (0, state_1.findCardBucket)(card);
        if (newBucket === undefined) {
            return res
                .status(500)
                .json({ error: "New bucket not found for the card" });
        }
        const record = {
            cardFront,
            cardBack,
            difficulty,
            previousBucket,
            newBucket,
            timestamp: Date.now(),
        };
        (0, state_1.addHistoryRecord)(record);
        console.log(`Updated card "${cardFront}" -> from bucket ${previousBucket} to ${newBucket}`);
        res.status(200).json({ message: "Update successful" });
    }
    catch (err) {
        console.error("Error in /api/update:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});
// GET /api/hint
app.get("/api/hint", (req, res) => {
    try {
        const { cardFront, cardBack } = req.query;
        if (typeof cardFront !== "string" || typeof cardBack !== "string") {
            return res.status(400).json({ error: "Missing or invalid query parameters" });
        }
        const card = (0, state_1.findCard)(cardFront, cardBack);
        if (!card) {
            return res.status(404).json({ error: "Card not found" });
        }
        const hint = (0, algorithm_1.getHint)(card);
        console.log(`Hint requested for card "${cardFront}"`);
        res.json({ hint });
    }
    catch (err) {
        console.error("Error in /api/hint:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});
// GET /api/progress
app.get("/api/progress", (req, res) => {
    try {
        const buckets = (0, state_1.getBuckets)();
        const history = (0, state_1.getHistory)();
        const progress = (0, algorithm_1.computeProgress)(buckets, history);
        res.json(progress);
    }
    catch (err) {
        console.error("Error in /api/progress:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});
// POST /api/day/next
app.post("/api/day/next", (req, res) => {
    try {
        (0, state_1.incrementDay)();
        const newDay = (0, state_1.getCurrentDay)();
        console.log(`Day incremented to ${newDay}`);
        res.status(200).json({ message: "Day advanced", day: newDay });
    }
    catch (err) {
        console.error("Error in /api/day/next:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});
// --- Start Server ---
app.listen(PORT, () => {
    console.log(`Flashcard server is running on port ${PORT}`);
});
