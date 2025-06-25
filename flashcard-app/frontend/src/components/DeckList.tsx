import React, { useEffect, useState } from 'react';
import { Deck } from '../types';
import { loadDecks, addDeck, deleteDeck } from '../../utils/storage';
import { Link } from 'react-router-dom';
import styles from './DeckList.module.css';


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
    <div className={styles.container}>
      <h2 className={styles.title}>📚 Your Decks</h2>

      <div className={styles.deckForm}>
        <input
          type="text"
          value={newDeckName}
          onChange={e => setNewDeckName(e.target.value)}
          placeholder="New deck name"
        />
        <button onClick={handleAddDeck}>➕ Add Deck</button>
      </div>

      <ul className={styles.deckList}>
        {decks.map(deck => (
          <li key={deck.id} className={styles.deckItem}>
            <Link to={`/decks/${deck.id}`}>{deck.name}</Link>
            <button
              className={styles.deleteButton}
              onClick={() => handleDeleteDeck(deck.id)}
            >
              ❌ Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DeckList;