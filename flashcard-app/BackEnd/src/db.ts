// src/db.ts
import Database from 'better-sqlite3';
import path from 'path';

// Create or open the SQLite database file
const db = new Database(path.resolve(__dirname, '../data/flashcards.db'));

// Initialize schema (runs once)
db.exec(`
  CREATE TABLE IF NOT EXISTS flashcards (
    id TEXT PRIMARY KEY,
    front TEXT NOT NULL,
    back TEXT NOT NULL,
    hint TEXT,
    tags TEXT,
    deckId TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS buckets (
    cardId TEXT PRIMARY KEY,
    bucket INTEGER NOT NULL,
    FOREIGN KEY(cardId) REFERENCES flashcards(id)
  );

  CREATE TABLE IF NOT EXISTS history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cardFront TEXT,
    cardBack TEXT,
    previousBucket INTEGER,
    newBucket INTEGER,
    difficulty TEXT,
    timestamp TEXT
  );

  CREATE TABLE IF NOT EXISTS meta (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );
`);

export default db;
