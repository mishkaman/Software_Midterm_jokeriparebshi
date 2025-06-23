import React, { useEffect, useState } from 'react';
import { Flashcard } from '../types';
import { loadFlashcards } from '../../utils/storage';

interface ReviewEntry {
  cardId: string;
  date: string;
  difficulty: string;
}

const ReviewHistory: React.FC = () => {
  const [history, setHistory] = useState<ReviewEntry[]>([]);
  const [cards, setCards] = useState<Flashcard[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const reviews: ReviewEntry[] = JSON.parse(localStorage.getItem('reviews') || '[]');
      const allCards = await loadFlashcards();
      setHistory(reviews.reverse().slice(0, 10)); // Show 10 most recent
      setCards(allCards);
    };

    fetchData();
  }, []);

  const getCardContent = (id: string) => {
    const found = cards.find(c => c.id === id);
    return found ? found.front : 'Unknown Card';
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>🕒 Recently Practiced Cards</h2>
      {history.length === 0 ? (
        <p>No practice history found.</p>
      ) : (
        <ul>
          {history.map((entry, idx) => (
            <li key={idx} style={{ marginBottom: '1rem', borderBottom: '1px solid #ccc', paddingBottom: '0.5rem' }}>
              <strong>Card:</strong> {getCardContent(entry.cardId)} <br />
              <strong>Difficulty:</strong> {entry.difficulty} <br />
              <strong>Reviewed on:</strong> {new Date(entry.date).toLocaleString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ReviewHistory;
