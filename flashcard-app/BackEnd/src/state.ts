import db from './db';
import { Flashcard, BucketMap, AnswerDifficulty } from './logic/flashcards';
import { PracticeRecord } from './types';
import { v4 as uuidv4 } from 'uuid';

// --------------- Flashcards -----------------

export function getAllCards(): Flashcard[] {
  const rows = db.prepare('SELECT * FROM flashcards').all();
  return rows.map(row => ({
    id: row.id,
    front: row.front,
    back: row.back,
    hint: row.hint,
    tags: row.tags ? JSON.parse(row.tags) : [],
    deckId: row.deckId,
  }));
}

export function addCard(card: Flashcard) {
  db.prepare(`
    INSERT INTO flashcards (id, front, back, hint, tags, deckId)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(
    card.id || uuidv4(),
    card.front,
    card.back,
    card.hint || null,
    JSON.stringify(card.tags || []),
    card.deckId
  );
  db.prepare(`INSERT OR IGNORE INTO buckets (cardId, bucket) VALUES (?, ?)`).run(card.id, 0);
}

// --------------- Buckets -----------------

export function getBuckets(): BucketMap {
  const result: BucketMap = new Map();
  const rows = db.prepare(`
    SELECT f.*, b.bucket FROM flashcards f
    JOIN buckets b ON f.id = b.cardId
  `).all();

  for (const row of rows) {
    const card: Flashcard = {
      id: row.id,
      front: row.front,
      back: row.back,
      hint: row.hint,
      tags: row.tags ? JSON.parse(row.tags) : [],
      deckId: row.deckId,
    };

    if (!result.has(row.bucket)) result.set(row.bucket, new Set());
    result.get(row.bucket)?.add(card);
  }

  return result;
}

export function setCardBucket(cardId: string, bucket: number) {
  db.prepare(`
    INSERT INTO buckets (cardId, bucket)
    VALUES (?, ?)
    ON CONFLICT(cardId) DO UPDATE SET bucket = excluded.bucket
  `).run(cardId, bucket);
}

// --------------- History -----------------

export function addHistoryRecord(record: PracticeRecord): void {
  db.prepare(`
    INSERT INTO history (cardFront, cardBack, previousBucket, newBucket, difficulty, timestamp)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(
    record.cardFront,
    record.cardBack,
    record.previousBucket,
    record.newBucket,
    record.difficulty,
    record.timestamp.toISOString()
  );
}

export function getHistory(): PracticeRecord[] {
  const rows = db.prepare('SELECT * FROM history').all();
  return rows.map(row => ({
    cardFront: row.cardFront,
    cardBack: row.cardBack,
    previousBucket: row.previousBucket,
    newBucket: row.newBucket,
    difficulty: row.difficulty,
    timestamp: new Date(row.timestamp),
  }));
}

// --------------- Day Counter -----------------

export function getCurrentDay(): number {
  const row = db.prepare(`SELECT value FROM meta WHERE key = 'currentDay'`).get();
  return row ? parseInt(row.value, 10) : 0;
}

export function incrementDay(): void {
  const current = getCurrentDay();
  const next = current + 1;
  db.prepare(`INSERT INTO meta (key, value) VALUES ('currentDay', ?) 
    ON CONFLICT(key) DO UPDATE SET value = excluded.value
  `).run(next.toString());
}

// --------------- Card Lookup -----------------

export function findCard(front: string, back: string): Flashcard | undefined {
  const row = db.prepare(`
    SELECT * FROM flashcards WHERE front = ? AND back = ?
  `).get(front, back);

  return row
    ? {
        id: row.id,
        front: row.front,
        back: row.back,
        hint: row.hint,
        tags: row.tags ? JSON.parse(row.tags) : [],
        deckId: row.deckId,
      }
    : undefined;
}
