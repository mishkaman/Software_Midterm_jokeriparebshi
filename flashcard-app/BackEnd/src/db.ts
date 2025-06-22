// src/db.ts
import Database from 'better-sqlite3';
import path from 'path';

// Create or open the SQLite database file
const db = new Database(path.resolve(__dirname, '../data/flashcards.db'));

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
  CREATE TABLE IF NOT EXISTS flashcards (
    id TEXT PRIMARY KEY,
    front TEXT NOT NULL,
    back TEXT NOT NULL,
    hint TEXT,
    tags TEXT,
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
  CREATE TABLE IF NOT EXISTS history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cardFront TEXT,
    cardBack TEXT,
    previousBucket INTEGER,
    newBucket INTEGER,
    difficulty TEXT,
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


export default db;
