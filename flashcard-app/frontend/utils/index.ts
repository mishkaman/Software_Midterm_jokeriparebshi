// src/index.ts

import { Flashcard, retrieveFlashcards, persistFlashcards } from "./flashcards";
import {
  moveFlashcardToNextBucket,
  resetFlashcardBucket,
  selectNextFlashcard,
} from "./algorithm";

let deck: Flashcard[] = retrieveFlashcards();
let currentCard: Flashcard | null = selectNextFlashcard(deck);

/**
 * Displays the current flashcard question and its hint (if any).
 */
function showFlashcard(): void {
  if (!currentCard) {
    console.log("📭 No flashcards to review.");
    return;
  }

  console.log("📌 Question:", currentCard.front);
  console.log("💡 Hint:", currentCard.hint ?? "(No hint available)");
}

/**
 * Evaluates the user's response, adjusts flashcard bucket, and shows the next card.
 */
function handleAnswer(userInput: string): void {
  if (!currentCard) return;

  const cleanedInput = userInput.trim().toLowerCase();
  const correctAnswer = currentCard.back.trim().toLowerCase();

  if (cleanedInput === correctAnswer) {
    console.log("✅ Great job!");
    moveFlashcardToNextBucket(currentCard);
  } else {
    console.log(`❌ Incorrect! The right answer is: ${currentCard.back}`);
    resetFlashcardBucket(currentCard);
  }

  // Sync updated card into deck
  deck = deck.map(card =>
    card.front === currentCard?.front && card.back === currentCard?.back ? currentCard : card
  );

  persistFlashcards(deck);
  currentCard = selectNextFlashcard(deck);
  showFlashcard();
}

/**
 * Adds a new flashcard to the deck.
 */
function createFlashcard(
  front: string,
  back: string,
  hint?: string,
  tags?: string[]
): void {
  const card: Flashcard = { front, back, hint, tags, bucket: 0 };
  deck.push(card);
  persistFlashcards(deck);

  if (!currentCard) {
    currentCard = selectNextFlashcard(deck);
  }
}

// Sample flashcards
createFlashcard("What's the capital of Japan?", "Tokyo", "Land of the Rising Sun", ["geography"]);
createFlashcard("10 - 4?", "6", "Simple subtraction", ["math"]);

showFlashcard();

// Simulated answers
handleAnswer("tokyo");
handleAnswer("8");
