import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Flashcard } from '../types';
import { loadFlashcards } from '../../utils/storage';

const DeckDetails: React.FC = () => {
  const { deckId } = useParams();
  const navigate = useNavigate();
  const [cards, setCards] = useState<Flashcard[]>([]);

  useEffect(() => {
    loadFlashcards().then(all => {
      setCards(all.filter(c => c.deckId === deckId));
    });
  }, [deckId]);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>📁 Deck Details</h2>
      <p>Total cards: {cards.length}</p>
      <ul>
        {cards.map(card => (
          <li key={card.id}>
            <strong>{card.front}</strong> - {card.back}
          </li>
        ))}
      </ul>
      <button onClick={() => navigate(`/practice?deckId=${deckId}`)}>
        ▶️ Practice This Deck
      </button>
    </div>
  );
};

export default DeckDetails;
