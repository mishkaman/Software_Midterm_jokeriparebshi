import { addCard } from '../state';
import { Flashcard } from '../logic/flashcards';

const sampleCards: Flashcard[] = [
  new Flashcard("Capital of France", "Paris", "geo", "Starts with P", ["europe", "capital"]),
  new Flashcard("2 + 2", "4", "math", "Basic addition", ["math", "easy"]),
  new Flashcard("Water's chemical formula", "H2O", "science", "Two H's, one O", ["chemistry"]),
  new Flashcard("Largest planet", "Jupiter", "space", "Gas giant", ["astronomy"]),
];

for (const card of sampleCards) {
  addCard(card);
}

console.log('Sample cards added!');
