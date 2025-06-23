const BOOKMARK_KEY = "bookmarkedCards";

export const getBookmarkedCardIds = (): string[] => {
  const data = localStorage.getItem(BOOKMARK_KEY);
  return data ? JSON.parse(data) : [];
};

export const isCardBookmarked = (id: string): boolean => {
  return getBookmarkedCardIds().includes(id);
};

export const toggleCardBookmark = (id: string): void => {
  const current = getBookmarkedCardIds();
  const updated = current.includes(id)
    ? current.filter(bookmarkId => bookmarkId !== id)
    : [...current, id];
  localStorage.setItem(BOOKMARK_KEY, JSON.stringify(updated));
};
