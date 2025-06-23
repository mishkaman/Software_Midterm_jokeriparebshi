export interface Flashcard {
  id: string;
  front: string;
  back: string;
  hint?: string;
  tags: string[];
  deckId?: string; // ✅ make sure this has a `?`
  bookmarked?: boolean; // ✅ keep this too
}
