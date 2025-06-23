import { Flashcard } from '../src/types';

const STORAGE_KEY = 'flashcardData';
const BOOKMARK_KEY = 'bookmarkedFlashcards';

// Generic utility to load data from localStorage
const fetchFromStorage = async <T>(key: string, fallback: T): Promise<T> => {
  try {
    const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(key) : null;
    return raw ? JSON.parse(raw) : fallback;
  } catch (err) {
    console.error(`Failed to retrieve ${key}:`, err);
    return fallback;
  }
};

// Generic utility to save data to localStorage
const saveToStorage = async <T>(key: string, value: T): Promise<void> => {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(value));
    } else {
      throw new Error("localStorage is not available in this environment");
    }
  } catch (err) {
    console.error(`Failed to store ${key}:`, err);
  }
};

// Flashcard-specific API
export const loadFlashcards = async (): Promise<Flashcard[]> => {
  return await fetchFromStorage<Flashcard[]>(STORAGE_KEY, []);
};

export const storeFlashcards = async (cards: Flashcard[]): Promise<void> => {
  await saveToStorage(STORAGE_KEY, cards);
};

export const modifyFlashcard = async (updated: Flashcard): Promise<void> => {
  const allCards = await loadFlashcards();
  const index = allCards.findIndex(card => card.id === updated.id);

  if (index !== -1) {
    allCards[index] = { ...updated };
    await storeFlashcards(allCards);
    console.log("Updated flashcard:", updated);
  } else {
    console.warn("Flashcard not found for update:", updated.id);
  }
};

// Bookmark-specific API
export const loadBookmarks = async (): Promise<Flashcard[]> => {
  return await fetchFromStorage<Flashcard[]>(BOOKMARK_KEY, []);
};

export const saveBookmarks = async (bookmarks: Flashcard[]): Promise<void> => {
  await saveToStorage(BOOKMARK_KEY, bookmarks);
};

export const toggleBookmark = async (card: Flashcard): Promise<void> => {
  const bookmarks = await loadBookmarks();
  const exists = bookmarks.find(b => b.id === card.id);

  if (exists) {
    const updated = bookmarks.filter(b => b.id !== card.id);
    await saveBookmarks(updated);
  } else {
    bookmarks.push({ ...card, bookmarked: true }); // ✅ this is now valid
    await saveBookmarks(bookmarks);
  }



};

 // 🔥 Streak tracking keys
const STREAK_KEY = 'practiceStreak';
const LAST_PRACTICE_DATE_KEY = 'lastPracticeDate';

// 🚀 Get the current streak value
export const getPracticeStreak = (): number => {
  const streak = localStorage.getItem(STREAK_KEY);
  return streak ? parseInt(streak, 10) : 0;
};


// 🔁 Update streak if today wasn't already counted
export const updatePracticeStreak = (): number => {
  const today = new Date().toDateString();
  const lastDate = localStorage.getItem('lastPracticeDate');
  const rawStreak = localStorage.getItem('practiceStreak');
  let streak = rawStreak ? parseInt(rawStreak) : 0;

  if (lastDate !== today) {
    streak += 1;
    localStorage.setItem('practiceStreak', streak.toString());
    localStorage.setItem('lastPracticeDate', today);
  }

  return streak;
};
