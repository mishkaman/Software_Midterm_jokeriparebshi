import React, { useEffect, useState } from 'react';
import { Flashcard } from '../types';
import { loadFlashcards } from '../../utils/storage';
import FlashcardDisplay from './FlashcardDisplay';
import styles from './RetryView.module.css';

const RetryView: React.FC = () => {
  const [wrongCards, setWrongCards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showBack, setShowBack] = useState(false);

  useEffect(() => {
    const loadWrongCards = async () => {
      const allCards = await loadFlashcards();
      const reviews = JSON.parse(localStorage.getItem('reviews') || '[]');

      const wrongIds = reviews
        .filter((r: any) => r.difficulty === 'Wrong')
        .map((r: any) => r.cardId);

      const wrongCards = allCards.filter(card => wrongIds.includes(card.front));
      setWrongCards(wrongCards);
    };

    loadWrongCards();
  }, []);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % wrongCards.length);
    setShowBack(false);
  };

  if (wrongCards.length === 0) {
    return <p style={{ padding: '2rem' }}>🎉 No failed cards to retry!</p>;
  }

  const currentCard = wrongCards[currentIndex];

  return (
    <div className={styles.retryContainer}>
      <h2 className={styles.title}>Retry Failed Cards</h2>

      <FlashcardDisplay card={currentCard} showBack={showBack} />

      <div className={styles.buttonGroup}>
        {!showBack ? (
          <button className={styles.button} onClick={() => setShowBack(true)}>Show Answer</button>
        ) : (
          <button className={styles.button} onClick={handleNext}>Next</button>
        )}
      </div>

      <p className={styles.cardCounter}>
        Card {currentIndex + 1} of {wrongCards.length}
      </p>
    </div>
  );
};

export default RetryView;
