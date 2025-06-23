import React from 'react';
import { Flashcard } from '../types';
import styles from './FlashcardDisplay.module.css';
import { isCardBookmarked, toggleCardBookmark } from '../../utils/bookmarkedCards';

interface Props {
  card: Flashcard;
  showBack: boolean;
}

const FlashcardDisplay: React.FC<Props> = ({ card, showBack }) => {
  const [favorited, setFavorited] = React.useState(isCardBookmarked(card.id));
  const [bookmarked, setBookmarked] = React.useState(isCardBookmarked(card.id));

  const handleFavoriteClick = () => {
    toggleCardBookmark(card.id);
    setFavorited(!favorited);
  };

  const handleBookmarkClick = () => {
    toggleCardBookmark(card.id);
    setBookmarked(!bookmarked);
  };

  return (
    <div className={styles.card}>
      <div className={styles.iconRow}>
        <span onClick={handleFavoriteClick} className={styles.icon}>
          {favorited ? '⭐' : '☆'}
        </span>
        <span onClick={handleBookmarkClick} className={styles.icon}>
          {bookmarked ? '📑' : '🔖'}
        </span>
      </div>

      <div className={styles.cardContent}>
        {showBack ? card.back : card.front}
      </div>

      {!showBack && card.hint && (
        <div className={styles.cardHint}>
          Hint: {card.hint}
        </div>
      )}
    </div>
  );
};

export default FlashcardDisplay;
