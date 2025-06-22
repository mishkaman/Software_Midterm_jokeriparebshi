// src/state.ts

import { Flashcard, retrieveFlashcards } from "./flashcards";
import { selectNextFlashcard } from "./algorithm";

/**
 * Structure of the app's flashcard state.
 */
export interface State {
  flashcards: Flashcard[];
  currentCard: Flashcard | null;
}

/**
 * Initializes the application state by loading flashcards
 * and selecting the first card to display.
 */
export function initializeState(): State {
  const flashcards = retrieveFlashcards();
  const currentCard = selectNextFlashcard(flashcards);
  return { flashcards, currentCard };
}

/**
 * Updates the current card by selecting the next one in line.
 */
export function updateCurrentCard(state: State): void {
  state.currentCard = selectNextFlashcard(state.flashcards);
}
