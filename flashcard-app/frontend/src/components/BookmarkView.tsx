import React, { useEffect, useState } from 'react';
import { Flashcard } from '../types';
import { loadBookmarks } from '../../utils/storage';

const BookmarkView: React.FC = () => {
  const [bookmarks, setBookmarks] = useState<Flashcard[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const cards = await loadBookmarks();
      const normalized: Flashcard[] = cards.map(card => ({
        ...card,
        id: String(card.id),
        tags: card.tags ?? [], // fix: always make tags a string[]
      }));
      setBookmarks(normalized);
    };
    fetch();
  }, []);

  if (bookmarks.length === 0) {
    return <div style={{ padding: '2rem' }}>No bookmarks found.</div>;
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h2>🔖 Bookmarked Flashcards</h2>
      {bookmarks.map(card => (
        <div
          key={card.id}
          style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem' }}
        >
          <p><strong>Front:</strong> {card.front}</p>
          <p><strong>Back:</strong> {card.back}</p>
          {card.hint && <p><strong>Hint:</strong> {card.hint}</p>}
          {card.tags.length > 0 && <p><strong>Tags:</strong> {card.tags.join(', ')}</p>}
        </div>
      ))}
    </div>
  );
};

export default BookmarkView;
