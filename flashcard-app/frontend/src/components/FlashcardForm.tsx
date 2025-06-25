import React, { useState, useEffect } from 'react';
import { Flashcard, Deck } from '../types';
import { loadDecks, loadFlashcards, storeFlashcards } from '../../utils/storage';
import styles from './FlashcardForm.module.css';


const FlashcardForm: React.FC = () => {
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [hint, setHint] = useState('');
  const [deckId, setDeckId] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [decks, setDecks] = useState<Deck[]>([]);
  const [status, setStatus] = useState('');

  useEffect(() => {
    loadDecks().then(setDecks);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!front.trim() || !back.trim() || !deckId) {
      setStatus('❌ Front, Back, and Deck are required');
      return;
    }

    const newCard: Flashcard = {
      id: crypto.randomUUID(),
      front: front.trim(),
      back: back.trim(),
      hint: hint.trim(),
      tags: tagsInput.split(',').map(t => t.trim()).filter(Boolean),
      deckId,
      bookmarked: false
    };

    const all = await loadFlashcards();
    all.push(newCard);
    await storeFlashcards(all);

    setFront('');
    setBack('');
    setHint('');
    setTagsInput('');
    setDeckId('');
    setStatus('✅ Flashcard created successfully!');
  };

  return (
    <div className={styles.container}>
  <form onSubmit={handleSubmit}>
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '1rem' }}>
      <h2>Create a New Flashcard</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Front:</label>
          <textarea value={front} onChange={e => setFront(e.target.value)} required />
        </div>
        <div>
          <label>Back:</label>
          <textarea value={back} onChange={e => setBack(e.target.value)} required />
        </div>
        <div>
          <label>Hint (optional):</label>
          <input type="text" value={hint} onChange={e => setHint(e.target.value)} />
        </div>
        <div>
          <label>Deck:</label>
          <select value={deckId} onChange={e => setDeckId(e.target.value)} required>
            <option value="">Select a deck</option>
            {decks.map(deck => (
              <option key={deck.id} value={deck.id}>{deck.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Tags (comma separated):</label>
          <input type="text" value={tagsInput} onChange={e => setTagsInput(e.target.value)} />
        </div>
        <button type="submit" >Create Flashcard</button>
      </form>
      {status && <p>{status}</p>}
    </div>
      </form>
  {status && <p>{status}</p>}
</div>

  );
};

export default FlashcardForm;
