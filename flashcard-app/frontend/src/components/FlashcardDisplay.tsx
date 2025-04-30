import React, { useState } from 'react';
import { fetchHint } from '../services/api';

// Define the Flashcard type if it's not imported from '../types'
interface Flashcard {
    id: string;
    front: string;
    back: string;
    hint?: string;
    tags: string[];
    deckId: string;
  }
  
  export enum AnswerDifficulty {
    Easy = "EASY",
    Hard = "HARD",
    Wrong = "WRONG"
  }

interface FlashcardDisplayProps {
  card: Flashcard;
  showBack: boolean;
}

const FlashcardDisplay: React.FC<FlashcardDisplayProps> = ({ card, showBack }) => {
  const [hint, setHint] = useState<string | null>(null);
  const [loadingHint, setLoadingHint] = useState(false);
  const [hintError, setHintError] = useState<string | null>(null);

  const handleGetHint = async () => {
    try {
      setLoadingHint(true);
      setHintError(null);
      const hintText = await fetchHint(card);
      setHint(hintText);
    } catch (error) {
      console.error('Error fetching hint:', error);
      setHintError('Failed to load hint. Please try again.');
    } finally {
      setLoadingHint(false);
    }
  };

  return (
    <div className="flashcard">
      <div className="flashcard-content">
        <div className="flashcard-front">
          <h3>Question:</h3>
          <p>{card.front}</p>
        </div>
        
        <div className="flashcard-back">
          <h3>Answer:</h3>
          <p>{showBack ? card.back : '???'}</p>
        </div>
        
        {!showBack && (
          <div className="flashcard-hint">
            {!hint && !loadingHint && !hintError && (
              <button 
                onClick={handleGetHint} 
                disabled={loadingHint}
                className="hint-button"
              >
                Get Hint
              </button>
            )}
            
            {loadingHint && <p>Loading hint...</p>}
            
            {hintError && (
              <div className="hint-error">
                <p>{hintError}</p>
                <button onClick={handleGetHint} className="retry-button">
                  Try Again
                </button>
              </div>
            )}
            
            {hint && (
              <div className="hint-display">
                <h4>Hint:</h4>
                <p>{hint}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FlashcardDisplay;