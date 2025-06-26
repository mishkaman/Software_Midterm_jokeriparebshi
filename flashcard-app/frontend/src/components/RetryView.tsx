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

      console.log('All cards:', allCards);
      console.log('Reviews:', reviews);

      // Get cards that were marked as wrong
      const wrongIds = reviews
        .filter((r: any) => r.difficulty === 'Wrong')
        .map((r: any) => r.cardId);

      console.log('Wrong card IDs:', wrongIds);

      // Try multiple matching strategies since we're not sure how IDs are stored
      const wrongCards = allCards.filter(card => {
        // Try matching by front text, id property, or index
        return wrongIds.includes(card.front) || 
               wrongIds.includes(card.id) || 
               wrongIds.includes(allCards.indexOf(card).toString());
      });

      console.log('Found wrong cards:', wrongCards);
      setWrongCards(wrongCards);
    };

    loadWrongCards();
  }, []);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % wrongCards.length);
    setShowBack(false);
  };

  const handleMarkAsLearned = () => {
    // Remove this card from wrong cards and update localStorage
    const currentCard = wrongCards[currentIndex];
    const reviews = JSON.parse(localStorage.getItem('reviews') || '[]');
    
    // Remove the wrong review for this card
    const updatedReviews = reviews.filter((r: any) => 
      !(r.cardId === currentCard.front || r.cardId === currentCard.id) || 
      r.difficulty !== 'Wrong'
    );
    
    localStorage.setItem('reviews', JSON.stringify(updatedReviews));
    
    // Remove from current wrong cards list
    const updatedWrongCards = wrongCards.filter((_, index) => index !== currentIndex);
    setWrongCards(updatedWrongCards);
    
    // Adjust current index if needed
    if (currentIndex >= updatedWrongCards.length && updatedWrongCards.length > 0) {
      setCurrentIndex(updatedWrongCards.length - 1);
    } else if (updatedWrongCards.length === 0) {
      setCurrentIndex(0);
    }
    setShowBack(false);
  };

  if (wrongCards.length === 0) {
    return (
      <div className={styles.retryContainer}>
        <h2 className={styles.title}>Retry Failed Cards</h2>
        <p style={{ padding: '2rem', textAlign: 'center' }}>
          🎉 No failed cards to retry! Great job!
        </p>
      </div>
    );
  }

  const currentCard = wrongCards[currentIndex];

  return (
    <div className={styles.retryContainer}>
      <h2 className={styles.title}>Retry Failed Cards</h2>
      <div style={{color: '#000000'}}>
      <FlashcardDisplay card={currentCard} showBack={showBack} />
      </div>

      <div className={styles.buttonGroup}>
        {!showBack ? (
          <button className={styles.button} onClick={() => setShowBack(true)}>
            Show Answer
          </button>
        ) : (
          <div className={styles.buttonRow}>
            <button className={styles.button} onClick={handleNext}>
              Next Card
            </button>
            <button 
              className={`${styles.button} ${styles.successButton}`} 
              onClick={handleMarkAsLearned}
            >
              Mark as Learned
            </button>
          </div>
        )}
      </div>

      <p className={styles.cardCounter}>
        Card {currentIndex + 1} of {wrongCards.length}
      </p>
    </div>
  );
};

export default RetryView;