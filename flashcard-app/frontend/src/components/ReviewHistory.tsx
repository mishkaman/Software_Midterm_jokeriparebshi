import React, { useEffect, useState } from 'react';
import { Flashcard } from '../types';
import { loadFlashcards } from '../../utils/storage';
import styles from './ReviewHistory.module.css';

interface ReviewEntry {
  cardId: string;
  date: string;
  difficulty: 0 | 1 | 2; // 0 = Easy, 1 = Hard, 2 = Wrong
}

const ReviewHistory: React.FC = () => {
  const [history, setHistory] = useState<ReviewEntry[]>([]);
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [filter, setFilter] = useState<string>('All');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Load review history
        const reviewsRaw = localStorage.getItem('reviews');
        const reviews: ReviewEntry[] = reviewsRaw ? JSON.parse(reviewsRaw) : [];
        
        if (!isCancelled) {
          const sorted = reviews.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
          setHistory(sorted.slice(0, 50)); // Limit to 50 recent
        }

        // Load flashcards
        const flashcards = await loadFlashcards();
        
        if (!isCancelled) {
          setCards(flashcards);
          setLoading(false);
        }
      } catch (err) {
        if (!isCancelled) {
          setError('Failed to load review history');
          setLoading(false);
          console.error('Error loading review history:', err);
        }
      }
    };

    fetchData();

    // Cleanup function to prevent state updates after unmount
    return () => {
      isCancelled = true;
    };
  }, []);

  const getDifficultyText = (difficulty: 0 | 1 | 2): string => {
    switch (difficulty) {
      case 0: return 'Easy';
      case 1: return 'Hard';
      case 2: return 'Wrong';
      default: return 'Unknown';
    }
  };

  const getDifficultyValue = (filterText: string): number | null => {
    switch (filterText) {
      case 'Easy': return 0;
      case 'Hard': return 1;
      case 'Wrong': return 2;
      default: return null;
    }
  };

  const handleClearHistory = () => {
    try {
      localStorage.removeItem('reviews');
      setHistory([]);
    } catch (err) {
      console.error('Error clearing history:', err);
      setError('Failed to clear history');
    }
  };

  const getCardContent = (id: string): string => {
    const found = cards.find(c => c.id === id);
    return found ? found.front : '[Unknown Card]';
  };

  const filteredHistory = filter === 'All'
    ? history
    : history.filter(entry => {
        const filterValue = getDifficultyValue(filter);
        return filterValue !== null && entry.difficulty === filterValue;
      });

  // Show loading state
  if (loading) {
    return (
      <div className={styles.historyWrapper}>
        <h2 style={{ padding: '2rem', color: '#000000' }}>📘 Review History</h2>
        <p>Loading...</p>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className={styles.historyWrapper}>
        <h2 style={{ padding: '2rem', color: '#000000' }}>📘 Review History</h2>
        <p style={{ color: 'red' }}>{error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <div className={styles.historyWrapper}>
      <h2 style={{ padding: '2rem', color: '#000000' }}>📘 Review History</h2>

      <div className={styles.controls}>
        <label>
          Filter by difficulty:
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="All">All</option>
            <option value="Easy">Easy</option>
            <option value="Hard">Hard</option>
            <option value="Wrong">Wrong</option>
          </select>
        </label>
        <button className={styles.clearButton} onClick={handleClearHistory}>
          Clear History
        </button>
      </div>

      {filteredHistory.length === 0 ? (
        <p className={styles.empty}>No review history found.</p>
      ) : (
        <table className={styles.table}>
          <thead style={{color: '#000000'}}>
            <tr>
              <th>Card</th>
              <th>Difficulty</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody style={{color: '#000000'}}>
            {filteredHistory.map((entry, idx) => (
              <tr key={idx}>
                <td>{getCardContent(entry.cardId)}</td>
                <td>{getDifficultyText(entry.difficulty)}</td>
                <td>{new Date(entry.date).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ReviewHistory;