// src/db.ts
import Database from 'better-sqlite3';
import path from 'path';

// Create or open the SQLite database file
const db = new Database(path.resolve(__dirname, '../data/flashcards.db'));

<<<<<<< HEAD
// --- USERS ---
db.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    passwordHash TEXT NOT NULL
  )
`).run();

// Add `userId` to all existing tables:
db.prepare(`
=======
// Initialize schema (runs once)
db.exec(`
>>>>>>> 4f7672da6b6b1c422f38fc8d5ed419cb9565b5c5
  CREATE TABLE IF NOT EXISTS flashcards (
    id TEXT PRIMARY KEY,
    front TEXT NOT NULL,
    back TEXT NOT NULL,
    hint TEXT,
    tags TEXT,
<<<<<<< HEAD
    deckId TEXT,
    userId TEXT NOT NULL
  )
`).run();

db.prepare(`
  CREATE TABLE IF NOT EXISTS buckets (
    cardId TEXT PRIMARY KEY,
    bucket INTEGER,
    userId TEXT NOT NULL
  )
`).run();

db.prepare(`
=======
    deckId TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS buckets (
    cardId TEXT PRIMARY KEY,
    bucket INTEGER NOT NULL,
    FOREIGN KEY(cardId) REFERENCES flashcards(id)
  );

>>>>>>> 4f7672da6b6b1c422f38fc8d5ed419cb9565b5c5
  CREATE TABLE IF NOT EXISTS history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cardFront TEXT,
    cardBack TEXT,
    previousBucket INTEGER,
    newBucket INTEGER,
    difficulty TEXT,
<<<<<<< HEAD
    timestamp TEXT,
    userId TEXT NOT NULL
  )
`).run();

db.prepare(`
  CREATE TABLE IF NOT EXISTS meta (
    key TEXT PRIMARY KEY,
    value TEXT,
    userId TEXT NOT NULL
  )
`).run();

=======
    timestamp TEXT
  );

  CREATE TABLE IF NOT EXISTS meta (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );
`);
>>>>>>> 4f7672da6b6b1c422f38fc8d5ed419cb9565b5c5

export default db;
