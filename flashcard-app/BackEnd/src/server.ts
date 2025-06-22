// backend/src/server.ts

import cors from "cors";
import { Request, Response } from "express";

import {
  toBucketSets,
  practice,
  update as updateBuckets,
  getHint,
  computeProgress,
} from "./logic/algorithm";

import {
  AnswerDifficulty,
  Flashcard,
} from "./logic/flashcards";

import {
  getBuckets,
  setBuckets,
  getCurrentDay,
  incrementDay,
  getHistory,
  addHistoryRecord,
  findCard,
  findCardBucket,
} from "./state";

import { PracticeRecord } from "./types";
import { authenticate } from '../src/middleware/authenticate'; // path to the middleware
import { getAllCards, addCard } from '../src/logic/algorithm'; // your logic
import bodyParser from 'body-parser';
import express from 'express';
import { registerUser, loginUser } from '../src/logic/algorithm';
import {
  getUserCards,
  createCard,
  updateCard,
  deleteCard
} from './services/cards';

const app = express();
app.use(express.json());

// GET all flashcards
app.get('/api/cards', authenticate, (req, res) => {
  const userId = (req as any).userId;
  const cards = getUserCards(userId);
  res.json(cards);
});

// POST create new flashcard
app.post('/api/cards', authenticate, (req, res) => {
  const userId = (req as any).userId;
  const { front, back, hint, tags, deckId } = req.body;

  if (!front || !back) {
    return res.status(400).json({ error: 'Front and Back are required' });
  }

  const id = createCard({ front, back, hint, tags, deckId }, userId);
  res.status(201).json({ id });
});

// PUT update card
app.put('/api/cards/:id', authenticate, (req, res) => {
  const userId = (req as any).userId;
  const cardId = req.params.id;
  const success = updateCard(cardId, req.body, userId);
  if (success) res.json({ success: true });
  else res.status(404).json({ error: 'Card not found' });
});

// DELETE card
app.delete('/api/cards/:id', authenticate, (req, res) => {
  const userId = (req as any).userId;
  const cardId = req.params.id;
  const success = deleteCard(cardId, userId);
  if (success) res.json({ success: true });
  else res.status(404).json({ error: 'Card not found' });
});

const app = express();
const port = 3000;

app.use(bodyParser.json());


// --- Setup ---
const app = express();
const PORT = Number(process.env.PORT) || 3001; // ✅ Ensure PORT is a number

// --- Middleware ---
app.use(cors());
app.use(express.json());

// --- Routes ---

// GET /api/practice
app.get("/api/practice", (req: Request, res: Response) => {
  try {
    const day = getCurrentDay();
    const bucketMap = getBuckets();
    const bucketSets = toBucketSets(bucketMap);
    const practiceSet = practice(bucketSets, day);
    const cardsArray = Array.from(practiceSet);

    console.log(`Serving ${cardsArray.length} practice cards for day ${day}`);
    res.json({ cards: cardsArray, day });
  } catch (err) {
    console.error("Error in /api/practice:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/update
app.post("/api/update", (req: Request, res: Response) => {
  try {
    const { cardFront, cardBack, difficulty } = req.body;

    if (
      ![
        AnswerDifficulty.Wrong,
        AnswerDifficulty.Hard,
        AnswerDifficulty.Easy,
      ].includes(difficulty)
    ) {
      return res.status(400).json({ error: "Invalid difficulty value" });
    }

    const card = findCard(cardFront, cardBack);
    if (!card) {
      return res.status(404).json({ error: "Card not found" });
    }

    const buckets = getBuckets();
    const previousBucket = findCardBucket(card);
    if (previousBucket === undefined) {
      return res
        .status(500)
        .json({ error: "Previous bucket not found for the card" });
    }

    const updatedBuckets = updateBuckets(buckets, card, difficulty);
    setBuckets(updatedBuckets);

    const newBucket = findCardBucket(card);
    if (newBucket === undefined) {
      return res
        .status(500)
        .json({ error: "New bucket not found for the card" });
    }

    const record: PracticeRecord = {
      cardFront,
      cardBack,
      difficulty,
      previousBucket,
      newBucket,
      timestamp: Date.now(),
    };
    addHistoryRecord(record);

    console.log(
      `Updated card "${cardFront}" -> from bucket ${previousBucket} to ${newBucket}`
    );
    res.status(200).json({ message: "Update successful" });
  } catch (err) {
    console.error("Error in /api/update:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});
  
// GET /api/hint
app.get("/api/hint", (req: Request, res: Response) => {
  try {
    const { cardFront, cardBack } = req.query;

    if (typeof cardFront !== "string" || typeof cardBack !== "string") {
      return res.status(400).json({ error: "Missing or invalid query parameters" });
    }

    const card = findCard(cardFront, cardBack);
    if (!card) {
      return res.status(404).json({ error: "Card not found" });
    }

    const hint = getHint(card);
    console.log(`Hint requested for card "${cardFront}"`);
    res.json({ hint });
  } catch (err) {
    console.error("Error in /api/hint:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/progress
app.get("/api/progress", (req: Request, res: Response) => {
  try {
    const buckets = getBuckets();
    const history = getHistory();
    const progress = computeProgress(buckets, history);
    res.json(progress);
  } catch (err) {
    console.error("Error in /api/progress:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/day/next
app.post("/api/day/next", (req: Request, res: Response) => {
  try {
    incrementDay();
    const newDay = getCurrentDay();
    console.log(`Day incremented to ${newDay}`);
    res.status(200).json({ message: "Day advanced", day: newDay });
  } catch (err) {
    console.error("Error in /api/day/next:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`Flashcard server is running on port ${PORT}`);
});