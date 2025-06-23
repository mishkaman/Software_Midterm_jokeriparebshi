// /src/utils/tagFilter.js

/**
 * Filters flashcards based on selected tags.
 * @param {Array} cards - The full list of flashcards.
 * @param {Array} selectedTags - The tags to filter by.
 * @returns {Array} Filtered flashcards.
 */
import { flashcards } from '../src/data/Cards';
import { Flashcard } from '../src/data/logic';

export const filterFlashcardsByTags = (cards: Flashcard[], selectedTags: string[]): Flashcard[] => {
  if (selectedTags.length === 0) return cards;
  return cards.filter(card => card.tags?.some(tag => selectedTags.includes(tag)));
};


