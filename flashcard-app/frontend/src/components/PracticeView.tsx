import React, { useState, useEffect, useCallback } from 'react';
import { Flashcard } from '../types';
import { fetchPracticeCards, submitAnswer, advanceDay } from '../services/api';
import FlashcardDisplay from './FlashcardDisplay';
import { AnswerDifficulty } from '../../../BackEnd/src/logic/flashcards';
import styles from './PracticeView.module.css';
import { loadFlashcards } from '../../utils/storage';
import { filterFlashcardsByTags } from '../../utils/tagFilter';
import TagFilter from './tagFilter';
import GestureDetector, { Gesture } from './GestureDetection/Gesture';
import { updatePracticeStreak, getPracticeStreak } from '../../utils/storage';
import { toast } from 'react-toastify';
import {
  incrementDailyReviewCount,
  getTodayReviewCount,
  clearTodayReviewCount
} from '../../utils/storage';

const [dailyCount, setDailyCount] = useState<number>(0);
const DAILY_GOAL = 10; // you can make this dynamic later
useEffect(() => {
  setDailyCount(getTodayReviewCount());
}, []);

const [streak, setStreak] = useState<number>(0);

useEffect(() => {
  setStreak(getPracticeStreak());
}, []);

const PracticeView: React.FC = () => {
  const [practiceCards, setPracticeCards] = useState<Flashcard[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showBack, setShowBack] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [day, setDay] = useState(0);
  const [sessionFinished, setSessionFinished] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [gestureEnabled, setGestureEnabled] = useState(false);
  const [lastDifficulty, setLastDifficulty] = useState<AnswerDifficulty | null>(null);
  const [showBookmarkedOnly, setShowBookmarkedOnly] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const loadPracticeCards = async () => {
    setIsLoading(true);
    setError(null);
    setSessionFinished(false);

    try {
      const allCards = await loadFlashcards();
      const uniqueTags = Array.from(new Set(allCards.flatMap(card => card.tags || [])));
      setAvailableTags(uniqueTags);

      const filtered = filterFlashcardsByTags(allCards, selectedTags)
        .filter(card => {
          const inSearch =
            card.front.toLowerCase().includes(searchTerm.toLowerCase()) ||
            card.back.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (card.tags || []).some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
          const inBookmarks = !showBookmarkedOnly || localStorage.getItem('bookmarkedFlashcards')?.includes(card.id);
          return inSearch && inBookmarks;
        });

      const transformedCards: Flashcard[] = filtered.map(card => ({
        id: card.front,
        front: card.front,
        back: card.back,
        hint: card.hint,
        tags: [...(card.tags || [])],
        deckId: card.deckId || ""
      }));

      setPracticeCards(transformedCards);

      if (transformedCards.length === 0) {
        setSessionFinished(true);
      }
      const newStreak = updatePracticeStreak();
setStreak(newStreak);

if (newStreak === 1) {
  toast('✅  First streak started! Keep going!');
} else if (newStreak === 5) {
  toast('🎉 5-day streak! You’re on fire!');
} else if (newStreak === 10) {
  toast('🏆 10-day streak! Champion mode!');
} else {
  toast(`🔥Streak: ${newStreak} days`);
}
    } catch (err) {
      setError('Failed to load practice cards. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPracticeCards();
  }, [selectedTags, searchTerm, showBookmarkedOnly]);

  useEffect(() => {
    if (showBack) {
      setGestureEnabled(true);
      setLastDifficulty(null);
    } else {
      setGestureEnabled(false);
    }
  }, [showBack]);

  const handleTagChange = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleShowBack = () => {
    setShowBack(true);
  };

 const handleAnswer = async (difficulty: AnswerDifficulty) => {
  if (currentCardIndex >= practiceCards.length) return;

  const currentCard = practiceCards[currentCardIndex];

  try {
    await submitAnswer(currentCard.front, currentCard.back, difficulty);
    const nextIndex = currentCardIndex + 1;

    const reviewRecord = {
      cardId: currentCard.front,
      date: new Date().toISOString(),
      difficulty,
    };

    const existing = JSON.parse(localStorage.getItem('reviews') || '[]');
    existing.push(reviewRecord);
    localStorage.setItem('reviews', JSON.stringify(existing));

    if (nextIndex < practiceCards.length) {
  setCurrentCardIndex(nextIndex);
  setShowBack(false);
} else {
  setSessionFinished(true);
const newStreak = updatePracticeStreak();
setStreak(newStreak);

}
await submitAnswer(currentCard.front, currentCard.back, difficulty);

// Track daily count
incrementDailyReviewCount();
setDailyCount(getTodayReviewCount());

  } catch (err) {
    setError('Failed to submit your answer. Please try again.');
  }
};


const handleNextDay = async () => {
  try {
    if (dailyCount >= DAILY_GOAL) {
      toast.success('🎉 You reached your daily goal!');
    }

    await advanceDay();
    await loadPracticeCards();
    setCurrentCardIndex(0);
    clearTodayReviewCount();
    setDailyCount(0);
  } catch (err) {
    setError('Failed to advance to next day. Please try again.');
  }
};


  const onGestureDetected = useCallback((gesture: Gesture) => {
    if (!gestureEnabled || lastDifficulty !== null) return;

    let difficulty: AnswerDifficulty | null = null;
    switch (gesture) {
      case 'thumbsUp':
        difficulty = AnswerDifficulty.Easy;
        break;
      case 'flatHand':
        difficulty = AnswerDifficulty.Hard;
        break;
      case 'thumbsDown':
        difficulty = AnswerDifficulty.Wrong;
        break;
    }

    if (difficulty) {
      setLastDifficulty(difficulty);
      setGestureEnabled(false);
      setTimeout(() => handleAnswer(difficulty!), 1000);
    }
  }, [gestureEnabled, lastDifficulty, handleAnswer]);
  <div className={styles.goalProgressBar}>
  <p className={styles.goalText}>
    🎯 Daily Goal: {dailyCount}/{DAILY_GOAL} cards reviewed
  </p>
  <div className={styles.goalBarWrapper}>
    <div
      className={styles.goalBar}
      style={{ width: `${(dailyCount / DAILY_GOAL) * 100}%` }}
    />
  </div>
</div>

  const renderProgressBar = () => {
    const percent = (currentCardIndex / practiceCards.length) * 100;
    return (
      <div className={styles.progressBarWrapper}>
        <div className={styles.progressBar} style={{ width: `${percent}%` }}></div>
      </div>
    );
  };

  if (isLoading) {
    return <div className={styles.loadingContainer}><p className={styles.loadingText}>Loading your cards...</p></div>;
  }

  if (error) {
    return <div className={styles.errorContainer}><p className={styles.errorText}>{error}</p></div>;
  }

  if (sessionFinished) {
    return (
      <div className={styles.sessionComplete}>
        <h2 className={styles.sessionCompleteTitle}>Session Complete!</h2>
        <p className={styles.sessionCompleteMessage}>Great job! You've completed all your cards for today.</p>
        <button className={`${styles.button} ${styles.nextDayButton}`} onClick={handleNextDay}>Go to Next Day</button>
      </div>
    );
  }

  if (practiceCards.length === 0) {
    return <div className={styles.noCardsContainer}><p className={styles.noCardsText}>No cards to practice today.</p></div>;
  }

  const currentCard = practiceCards[currentCardIndex];

  return (
    <div className={styles.practiceContainer}>
      <div className={styles.header}>
        <div className={styles.appTitle}>Flashcard Learner</div>
        <div className={styles.progressInfo}>
          <span className={styles.dayCounter}>Day {day}</span>
          <span className={styles.progressIndicator}>Card {currentCardIndex + 1} of {practiceCards.length}</span>
        </div>
      </div>
    <div className={styles.streakDisplay}>
        🔥 Current Streak: <strong>{streak}</strong> day{streak === 1 ? '' : 's'}
    </div>

      <TagFilter
        availableTags={availableTags}
        selectedTags={selectedTags}
        onTagChange={handleTagChange}
      />

      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search cards..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      {renderProgressBar()}

      <div className={styles.flashcardContainer}>
        <FlashcardDisplay card={currentCard} showBack={showBack} />
      </div>

      {showBack && (
        <>
          <p className={styles.gestureText}>Rate using gestures (👍 Easy, ✋ Hard, 👎 Wrong)</p>
          <GestureDetector active={gestureEnabled} onGestureDetected={onGestureDetected} />
        </>
      )}

      <div className={styles.buttonsContainer}>
        {!showBack ? (
          <button
            className={`${styles.button} ${styles.showAnswerButton}`}
            onClick={handleShowBack}
          >
            Show Answer
          </button>
        ) : (
          <>
            <button
              className={`${styles.button} ${styles.easyButton}`}
              onClick={() => handleAnswer(AnswerDifficulty.Easy)}
            >
              Easy
            </button>
            <button
              className={`${styles.button} ${styles.hardButton}`}
              onClick={() => handleAnswer(AnswerDifficulty.Hard)}
            >
              Hard
            </button>
            <button
              className={`${styles.button} ${styles.wrongButton}`}
              onClick={() => handleAnswer(AnswerDifficulty.Wrong)}
            >
              Wrong
            </button>
          </>
        )}

        <div className={styles.toggleContainer}>
          <label>
            <input
              type="checkbox"
              checked={showBookmarkedOnly}
              onChange={() => setShowBookmarkedOnly(prev => !prev)}
            />
            Practice Only Bookmarked Cards
          </label>
        </div>
      </div>
    </div>
  );
};

export default PracticeView;
