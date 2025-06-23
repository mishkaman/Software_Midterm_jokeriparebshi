import React, { useEffect, useState } from 'react';
import { Flashcard } from '../types';
import { loadFlashcards } from '../../utils/storage';
import styles from './ReviewHistory.module.css';

interface ReviewEntry {
  cardId: string;
  date: string;
  difficulty: 'Easy' | 'Hard' | 'Wrong';
}

const ReviewHistory: React.FC = () => {
  const [history, setHistory] = useState<ReviewEntry[]>([]);
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [filter, setFilter] = useState<string>('All');

  useEffect(() => {
    const fetchData = async () => {
      const raw: ReviewEntry[] = JSON.parse(localStorage.getItem('reviews') || '[]');
      const sorted = raw.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setHistory(sorted.slice(0, 50)); // Limit to 50 recent
      setCards(await loadFlashcards());
    };

    fetchData();
  }, []);

  const getCardContent = (id: string): string => {
    const found = cards.find(c => c.id === id);
    return found ? found.front : '[Unknown Card]';
  };

  const handleClearHistory = () => {
    localStorage.removeItem('reviews');
    setHistory([]);
  };

  const filteredHistory = filter === 'All'
    ? history
    : history.filter(entry => entry.difficulty === filter);

  return (
    <div className={styles.historyWrapper}>
      <h2 className={styles.title}>📘 Review History</h2>

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
          <thead>
            <tr>
              <th>Card</th>
              <th>Difficulty</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredHistory.map((entry, idx) => (
              <tr key={idx}>
                <td>{getCardContent(entry.cardId)}</td>
                <td className={styles[entry.difficulty.toLowerCase()]}>{entry.difficulty}</td>
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
