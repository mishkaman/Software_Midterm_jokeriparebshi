import React, { useEffect, useState } from 'react';
import styles from './Dashboard.module.css';

type ReviewRecord = {
  cardId: string;
  date: string;
  difficulty: 'easy' | 'hard' | 'wrong';
};

const Dashboard: React.FC = () => {
  const [reviewStats, setReviewStats] = useState<Record<string, number>>({});

  useEffect(() => {
    const reviews: ReviewRecord[] = JSON.parse(localStorage.getItem("reviews") || "[]");

    const daily = reviews.reduce((acc, { date }) => {
      const day = new Date(date).toLocaleDateString();
      acc[day] = (acc[day] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    setReviewStats(daily);
  }, []);

  return (
    <div className={styles.dashboardContainer}>
      <h2>📈 Review Progress</h2>
      <ul>
        {Object.entries(reviewStats).map(([day, count]) => (
          <li key={day}>{day}: {count} cards reviewed</li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;