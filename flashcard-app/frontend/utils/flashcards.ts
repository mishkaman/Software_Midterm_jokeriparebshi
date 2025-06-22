// src/flashcards.ts

export interface Flashcard {
  front: string;
  back: string;
  hint?: string;
  tags?: string[];
  bucket: number;
}

const STORAGE_KEY = "flashcards";

/**
 * Loads flashcards from localStorage and ensures all cards have a valid bucket number.
 */
export function retrieveFlashcards(): Flashcard[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];

  try {
    const parsed = JSON.parse(stored) as Flashcard[];

    // Ensure default bucket is set if missing
    return parsed.map(card => ({
      ...card,
      bucket: typeof card.bucket === "number" ? card.bucket : 0,
    }));
  } catch (error) {
    console.error("Failed to load flashcards from storage:", error);
    return [];
  }
}

/**
 * Saves an array of flashcards to localStorage.
 */
export function persistFlashcards(cards: Flashcard[]): void {
  const serialized = JSON.stringify(cards);
  localStorage.setItem(STORAGE_KEY, serialized);
}
