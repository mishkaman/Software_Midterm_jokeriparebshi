import db from '../src/db';
import { v4 as uuidv4 } from 'uuid';
import { Flashcard } from '../dist/logic/flashcards';

export function getUserCards(userId: string): Flashcard[] {
  const rows = db.prepare('SELECT * FROM flashcards WHERE userId = ?').all(userId);
  return rows.map(row => ({
    id: row.id,
    front: row.front,
    back: row.back,
    hint: row.hint,
    tags: row.tags ? JSON.parse(row.tags) : [],
    deckId: row.deckId,
  }));
}

export function createCard(card: Omit<Flashcard, 'id'>, userId: string): string {
  const id = uuidv4();
  db.prepare(`
    INSERT INTO flashcards (id, front, back, hint, tags, deckId, userId)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    card.front,
    card.back,
    card.hint || null,
    JSON.stringify(card.tags || []),
    card.deckId,
    userId
  );

  db.prepare(`INSERT OR IGNORE INTO buckets (cardId, bucket, userId) VALUES (?, ?, ?)`)
    .run(id, 0, userId);

  return id;
}

export function updateCard(cardId: string, updates: Partial<Flashcard>, userId: string): boolean {
  const row = db.prepare('SELECT * FROM flashcards WHERE id = ? AND userId = ?').get(cardId, userId);
  if (!row) return false;

  db.prepare(`
    UPDATE flashcards SET front = ?, back = ?, hint = ?, tags = ?, deckId = ?
    WHERE id = ? AND userId = ?
  `).run(
    updates.front || row.front,
    updates.back || row.back,
    updates.hint || row.hint,
    JSON.stringify(updates.tags || JSON.parse(row.tags || '[]')),
    updates.deckId || row.deckId,
    cardId,
    userId
  );

  return true;
}

export function deleteCard(cardId: string, userId: string): boolean {
  const res = db.prepare(`DELETE FROM flashcards WHERE id = ? AND userId = ?`).run(cardId, userId);
  db.prepare(`DELETE FROM buckets WHERE cardId = ? AND userId = ?`).run(cardId, userId);
  return res.changes > 0;
}
