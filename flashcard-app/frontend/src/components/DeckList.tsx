import React, { useEffect, useState } from 'react';
import { Deck } from '../types';
import { loadDecks, addDeck, deleteDeck } from '../../utils/storage';
import { Link } from 'react-router-dom';

const DeckList: React.FC = () => {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [newDeckName, setNewDeckName] = useState('');

  useEffect(() => {
    loadDecks().then(setDecks);
  }, []);

  const handleAddDeck = async () => {
    if (!newDeckName.trim()) return;
    const newDeck = await addDeck(newDeckName.trim());
    setDecks(prev => [...prev, newDeck]);
    setNewDeckName('');
  };

  const handleDeleteDeck = async (id: string) => {
    await deleteDeck(id);
    setDecks(prev => prev.filter(d => d.id !== id));
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>📚 Your Decks</h2>

      <div>
        <input
          type="text"
          value={newDeckName}
          onChange={e => setNewDeckName(e.target.value)}
          placeholder="New deck name"
        />
        <button onClick={handleAddDeck}>➕ Add Deck</button>
      </div>

      <ul>
        {decks.map(deck => (
          <li key={deck.id}>
            <Link to={`/decks/${deck.id}`}>{deck.name}</Link>
            <button onClick={() => handleDeleteDeck(deck.id)} style={{ marginLeft: '1rem' }}>
              ❌ Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DeckList;
