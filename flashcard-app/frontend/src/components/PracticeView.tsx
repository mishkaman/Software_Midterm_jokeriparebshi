import React, { useState, useEffect } from 'react';
import { Flashcard } from '../types'; // Frontend type definition
import { fetchPracticeCards, submitAnswer, advanceDay } from '../services/api';
import FlashcardDisplay from './FlashcardDisplay';
import { AnswerDifficulty } from '../../../BackEnd/src/logic/flashcards';

const PracticeView: React.FC = () => {
  const [practiceCards, setPracticeCards] = useState<Flashcard[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showBack, setShowBack] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [day, setDay] = useState(0);
  const [sessionFinished, setSessionFinished] = useState(false);

  const loadPracticeCards = async () => {
    setIsLoading(true);
    setError(null);
    setSessionFinished(false);

    try {
      const { cards, day: newDay } = await fetchPracticeCards();
      // Transform backend Flashcard type to frontend Flashcard type
      const transformedCards: Flashcard[] = cards.map(card => ({
        id: card.front, // Using front as a temporary ID or generate UUID if needed
        front: card.front,
        back: card.back,
        hint: card.hint,
        tags: [...card.tags],
        deckId: card.deckId
      }));
      
      setPracticeCards(transformedCards);
      setDay(newDay);
      
      if (transformedCards.length === 0) {
        setSessionFinished(true);
      }
    } catch (err) {
      setError('Failed to load practice cards. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPracticeCards();
  }, []);

  const handleShowBack = () => {
    setShowBack(true);
  };

  const handleAnswer = async (difficulty: AnswerDifficulty) => {
    if (currentCardIndex >= practiceCards.length) return;
    
    const currentCard = practiceCards[currentCardIndex];

    try {
      await submitAnswer(currentCard.front, currentCard.back, difficulty);
      const nextIndex = currentCardIndex + 1;

      if (nextIndex < practiceCards.length) {
        setCurrentCardIndex(nextIndex);
        setShowBack(false);
      } else {
        setSessionFinished(true);
      }
    } catch (err) {
      setError('Failed to submit your answer. Please try again.');
    }
  };

  const handleNextDay = async () => {
    try {
      await advanceDay();
      await loadPracticeCards();
      setCurrentCardIndex(0);
    } catch (err) {
      setError('Failed to advance to next day. Please try again.');
    }
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (sessionFinished) {
    return (
      <div>
        <h2>Session Complete</h2>
        <button onClick={handleNextDay}>Go to Next Day</button>
      </div>
    );
  }

  if (practiceCards.length === 0) {
    return <p>No cards to practice today.</p>;
  }

  const currentCard = practiceCards[currentCardIndex];

  return (
    <div>
      <h3>Day {day} - Card {currentCardIndex + 1} of {practiceCards.length}</h3>
      <FlashcardDisplay card={currentCard} showBack={showBack} />
      {!showBack ? (
        <button onClick={handleShowBack}>Show Answer</button>
      ) : (
        <>
          <button onClick={() => handleAnswer(AnswerDifficulty.Easy)}>Easy</button>
          <button onClick={() => handleAnswer(AnswerDifficulty.Hard)}>Hard</button>
          <button onClick={() => handleAnswer(AnswerDifficulty.Wrong)}>Wrong</button>
        </>
      )}
    </div>
  );
};

export default PracticeView;