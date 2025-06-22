import React, { useState, useEffect, useCallback } from "react";
import "./FlashcardDisplay.css";
import { flashcards as cardsData } from "../data/Cards";
import GestureDetector, { Gesture } from "./GestureDetection/Gesture";

type DifficultyRating = "easy" | "hard" | "wrong";

interface CardRating {
  cardId: number | string;
  rating: DifficultyRating;
  timestamp: number;
}

const FlashcardLearner: React.FC = () => {
  const [currentDay, setCurrentDay] = useState(0);
  const [phase, setPhase] = useState<"start" | "showQuestion" | "showAnswer">(
    "start"
  );
  const [currentCardIdx, setCurrentCardIdx] = useState(0);
  const [hintVisible, setHintVisible] = useState(false);
  const [gestureEnabled, setGestureEnabled] = useState(false);
  const [ratings, setRatings] = useState<CardRating[]>([]);
  const [lastDifficulty, setLastDifficulty] = useState<DifficultyRating | null>(
    null
  );
  const [debugInfo, setDebugInfo] = useState("");

  // Enable gesture detection only when answer is shown
  useEffect(() => {
    if (phase === "showAnswer") {
      setGestureEnabled(true);
      setLastDifficulty(null);
      setDebugInfo("Gesture detection activated");
      console.log("Gesture detection activated for answer phase");
    } else {
      setGestureEnabled(false);
      setDebugInfo("");
    }
  }, [phase, currentCardIdx]);

  const goToNextDay = () => {
    setCurrentDay((day) => day + 1);
    setCurrentCardIdx(0);
    setPhase("showQuestion");
    setHintVisible(false);
    setLastDifficulty(null);
  };

  const revealAnswer = () => {
    setPhase("showAnswer");
    setHintVisible(false);
  };

  const nextCard = useCallback(() => {
    setDebugInfo("Advancing to next card...");
    console.log(
      `Advancing card index from ${currentCardIdx} (total: ${cardsData.length})`
    );

    if (currentCardIdx < cardsData.length - 1) {
      setCurrentCardIdx((idx) => idx + 1);
      setPhase("showQuestion");
    } else {
      setPhase("start");
    }
    setHintVisible(false);
    setLastDifficulty(null);
  }, [currentCardIdx]);

  const onGestureDetected = useCallback(
    (gesture: Gesture) => {
      console.log("Gesture event received:", gesture);

      if (phase !== "showAnswer") {
        console.log("Ignoring gesture: not in answer phase");
        return;
      }
      if (!gestureEnabled) {
        console.log("Ignoring gesture: detection disabled or rating done");
        return;
      }

      let difficulty: DifficultyRating | null = null;

      switch (gesture) {
        case "thumbsUp":
          difficulty = "easy";
          break;
        case "thumbsDown":
          difficulty = "wrong";
          break;
        case "flatHand":
          difficulty = "hard";
          break;
      }

      if (difficulty) {
        console.log(`Card rated as ${difficulty} by gesture`);
        setDebugInfo(`Rating: ${difficulty}. Moving to next card soon...`);
        setGestureEnabled(false);

        const ratingRecord: CardRating = {
          cardId: cardsData[currentCardIdx].id || currentCardIdx,
          rating: difficulty,
          timestamp: Date.now(),
        };

        setRatings((prev) => [...prev, ratingRecord]);
        setLastDifficulty(difficulty);

        setTimeout(() => {
          nextCard();
        }, 1500);
      }
    },
    [phase, currentCardIdx, gestureEnabled, nextCard]
  );

  const showHintBox = () => {
    setHintVisible(true);
  };

  const currentCard = cardsData[currentCardIdx];

  return (
    <div className="flashcard-learner-container">
      <div className="flashcard-wrapper">
        <h1 className="app-title">Flashcard Learner</h1>
        <button className="day-indicator">Day {currentDay}</button>

        {phase === "start" && (
          <div className="session-complete">
            <p>You've completed all cards for today!</p>
            <button className="btn-next-day" onClick={goToNextDay}>
              Start Next Day
            </button>
          </div>
        )}

        {(phase === "showQuestion" || phase === "showAnswer") && (
          <>
            <p className="card-progress">
              Card {currentCardIdx + 1} / {cardsData.length}
            </p>

            <div className={`card-display ${phase === "showAnswer" ? "answer-view" : ""}`}>
              {phase === "showQuestion" ? currentCard.front : currentCard.back}
            </div>

            {hintVisible && (
              <div className="hint-container">
                💡 {currentCard.hint ? currentCard.hint : "No hint available"}
              </div>
            )}

            {phase === "showQuestion" && (
              <div className="actions-row">
                <button className="btn-hint" onClick={showHintBox}>
                  Show Hint
                </button>
                <button className="btn-show-answer" onClick={revealAnswer}>
                  Reveal Answer
                </button>
              </div>
            )}

            {phase === "showAnswer" && (
              <section className="rating-section">
                <p>Rate this card’s difficulty</p>
                <p className="gesture-instructions">
                  Use hand gestures to rate:<br />
                  👍 Thumbs up = Easy (hold for 3 seconds)<br />
                  👎 Thumbs down = Wrong (hold for 3 seconds)<br />
                  ✋ Flat hand = Hard (hold for 3 seconds)
                </p>

                {lastDifficulty ? (
                  <div className="rating-feedback">
                    You rated this card: <strong>{lastDifficulty.toUpperCase()}</strong>
                    <p>Advancing to the next card...</p>
                  </div>
                ) : (
                  <div className="gesture-status">
                    {gestureEnabled
                      ? "Hold a gesture for 3 seconds to submit rating"
                      : "Processing rating..."}
                  </div>
                )}

                {debugInfo && <div className="debug-info">{debugInfo}</div>}

                <GestureDetector
                  active={gestureEnabled}
                  onGestureDetected={onGestureDetected}
                />

                {gestureEnabled && (
                  <div className="manual-rating-buttons">
                    <button onClick={() => onGestureDetected("thumbsUp")}>👍</button>
                    <button onClick={() => onGestureDetected("flatHand")}>✋</button>
                    <button onClick={() => onGestureDetected("thumbsDown")}>👎</button>
                  </div>
                )}
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default FlashcardLearner;
