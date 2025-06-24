import React from 'react';
import styles from './DailySummaryModal.module.css';

interface DailySummaryProps {
  total: number;
  easy: number;
  hard: number;
  wrong: number;
  streak: number;
  goalReached: boolean;
  onClose: () => void;
}

const DailySummaryModal: React.FC<DailySummaryProps> = ({
  total,
  easy,
  hard,
  wrong,
  streak,
  goalReached,
  onClose
}) => {
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>📊 Daily Summary</h2>
        <p><strong>Total Cards Reviewed:</strong> {total}</p>
        <p><strong>Easy:</strong> {easy}</p>
        <p><strong>Hard:</strong> {hard}</p>
        <p><strong>Wrong:</strong> {wrong}</p>
        <p><strong>🔥 Streak:</strong> {streak} days</p>
        <p>
          <strong>🎯 Goal:</strong>{' '}
          {goalReached ? '✅ Goal Reached!' : '❌ Goal Not Met'}
        </p>
        <button onClick={onClose} className={styles.closeButton}>Close</button>
      </div>
    </div>
  );
};

export default DailySummaryModal;
