import React from 'react';
import { Flashcard } from '../types';

interface FlashcardDisplayProps {
  card: Flashcard;
  showBack: boolean;
}

const FlashcardDisplay: React.FC<FlashcardDisplayProps> = ({ card, showBack }) => {
  return (
    <div>
      <div className="flashcard-content">
        {showBack ? card.back : card.front}
      </div>
      {card.hint && !showBack && (
        <div className="flashcard-hint">
          Hint: {card.hint}
        </div>
      )}
    </div>
  );
};

export default FlashcardDisplay;
