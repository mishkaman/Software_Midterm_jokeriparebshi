import React, { useEffect, useState } from 'react';
import styles from './Dashboard.module.css';

type ReviewRecord = {
  cardId: string;
  date: string;
  difficulty: 0 | 1 | 2; // 0 = Easy, 1 = Hard, 2 = Wrong
};

const Dashboard: React.FC = () => {
  const [reviewStats, setReviewStats] = useState<Record<string, number>>({});
  const [difficultyStats, setDifficultyStats] = useState<Record<string, number>>({});
  const [totalReviews, setTotalReviews] = useState<number>(0);
  const [recentStreak, setRecentStreak] = useState<number>(0);

  useEffect(() => {
    try {
      const reviews: ReviewRecord[] = JSON.parse(localStorage.getItem("reviews") || "[]");
      
      if (reviews.length === 0) {
        console.log("No reviews found in localStorage");
        return;
      }

      console.log("Found reviews:", reviews.length);

      // Daily review counts
      const daily = reviews.reduce((acc, { date }) => {
        const day = new Date(date).toLocaleDateString();
        acc[day] = (acc[day] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Difficulty breakdown
      const difficulty = reviews.reduce((acc, { difficulty }) => {
        const difficultyText = getDifficultyText(difficulty);
        acc[difficultyText] = (acc[difficultyText] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Calculate streak (consecutive days with reviews)
      const sortedDays = Object.keys(daily).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
      let streak = 0;
      const today = new Date().toLocaleDateString();
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toLocaleDateString();
      
      if (sortedDays.includes(today) || sortedDays.includes(yesterday)) {
        for (const day of sortedDays) {
          const dayDate = new Date(day);
          const expectedDate = new Date(Date.now() - streak * 24 * 60 * 60 * 1000);
          
          if (Math.abs(dayDate.getTime() - expectedDate.getTime()) < 24 * 60 * 60 * 1000) {
            streak++;
          } else {
            break;
          }
        }
      }

      setReviewStats(daily);
      setDifficultyStats(difficulty);
      setTotalReviews(reviews.length);
      setRecentStreak(streak);

    } catch (error) {
      console.error("Error loading review data:", error);
    }
  }, []);

  const getDifficultyText = (difficulty: 0 | 1 | 2): string => {
    switch (difficulty) {
      case 0: return 'Easy';
      case 1: return 'Hard';
      case 2: return 'Wrong';
      default: return 'Unknown';
    }
  };

  const getRecentDays = () => {
    const sortedEntries = Object.entries(reviewStats)
      .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
      .slice(0, 7); // Last 7 days
    return sortedEntries;
  };

  return (
    <div className={styles.dashboardContainer}>
      <h2 style={{ padding: '2rem', color: '#000000' }}>📈 Review Progress</h2>
      
      <div style={{ padding: '0 2rem', color: '#000000' }}>
        {/* Summary Stats */}
        <div style={{ marginBottom: '2rem' }}>
          <h3>📊 Summary</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' }}>
              <strong>Total Reviews:</strong> {totalReviews}
            </div>
            <div style={{ padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' }}>
              <strong>Current Streak:</strong> {recentStreak} days
            </div>
            <div style={{ padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' }}>
              <strong>Days Active:</strong> {Object.keys(reviewStats).length}
            </div>
          </div>
        </div>

        {/* Difficulty Breakdown */}
        {Object.keys(difficultyStats).length > 0 && (
          <div style={{ marginBottom: '2rem' }}>
            <h3>🎯 Difficulty Breakdown</h3>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              {Object.entries(difficultyStats).map(([difficulty, count]) => (
                <div key={difficulty} style={{ padding: '0.5rem 1rem', border: '1px solid #ddd', borderRadius: '6px' }}>
                  <strong>{difficulty}:</strong> {count} ({Math.round((count / totalReviews) * 100)}%)
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Activity */}
        {Object.keys(reviewStats).length > 0 ? (
          <div>
            <h3>📅 Recent Activity (Last 7 Days)</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {getRecentDays().map(([day, count]) => (
                <li key={day} style={{ padding: '0.5rem 0', borderBottom: '1px solid #eee' }}>
                  <strong>{day}:</strong> {count} cards reviewed
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
            <p>No review data found. Start reviewing some flashcards to see your progress!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;