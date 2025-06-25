import React, { useEffect, useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { Flashcard } from '../types';
import { loadFlashcards } from '../../utils/storage';

Chart.register(...registerables);

type ReviewRecord = {
  cardId: string;
  date: string;
  difficulty: 'Easy' | 'Hard' | 'Wrong';
};

const AnalyticsDashboard: React.FC = () => {
  const [reviews, setReviews] = useState<ReviewRecord[]>([]);
  const [cards, setCards] = useState<Flashcard[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('reviews') || '[]';
    setReviews(JSON.parse(stored));
    loadFlashcards().then(setCards);
  }, []);

  const past7Days = [...Array(7)].map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toISOString().split('T')[0];
  }).reverse();

  const reviewsByDate = past7Days.map(date => (
    reviews.filter(r => r.date.startsWith(date)).length
  ));

  const difficultyCounts = {
    Easy: reviews.filter(r => r.difficulty === 'Easy').length,
    Hard: reviews.filter(r => r.difficulty === 'Hard').length,
    Wrong: reviews.filter(r => r.difficulty === 'Wrong').length,
  };

  const tagCounts: Record<string, number> = {};
  for (const review of reviews) {
    const card = cards.find(c => c.id === review.cardId);
    if (card) {
      for (const tag of card.tags || []) {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      }
    }
  }

  const topTags = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);

  return (
    <div style={{ padding: '1rem' }}>
      <h2>📊 Flashcard Analytics</h2>
      <div style={{ maxWidth: 600, marginBottom: 32, margin: 'auto'}}>
        <h3 style={{color: '#000000'}}>Daily Reviews (Last 7 Days)</h3>
        <Bar
          data={{
            labels: past7Days,
            datasets: [{
              label: 'Cards Reviewed',
              data: reviewsByDate,
              backgroundColor: '#4caf50',
            }],
          }}
        />
      </div>

      <div style={{ maxWidth: 400, marginBottom: 32, margin: 'auto' }}>
        <h3 style={{color: '#000000'}}>Difficulty Breakdown</h3>
        <Pie
          data={{
            labels: ['Easy', 'Hard', 'Wrong'],
            datasets: [{
              data: [difficultyCounts.Easy, difficultyCounts.Hard, difficultyCounts.Wrong],
              backgroundColor: ['#4caf50', '#ff9800', '#f44336'],
            }],
          }}
        />
      </div>

      <div style={{ maxWidth: 600, marginBottom: 32, margin: 'auto' }}>
        <h3 style={{color: '#000000'}}>Top Tags Reviewed</h3>
        <Bar
          data={{
            labels: topTags.map(([tag]) => tag),
            datasets: [{
              label: 'Times Reviewed',
              data: topTags.map(([, count]) => count),
              backgroundColor: '#2196f3',
            }],
          }}
        />
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
