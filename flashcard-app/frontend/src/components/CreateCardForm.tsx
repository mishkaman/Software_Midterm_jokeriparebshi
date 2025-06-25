// src/components/CreateCardForm.tsx
import React, { useState } from 'react';
import { Flashcard } from '../types';
import { loadFlashcards, storeFlashcards } from '../../utils/storage';
import styles from './CreateCardForm.module.css';

const CreateCardForm: React.FC = () => {
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [hint, setHint] = useState('');
  const [tags, setTags] = useState('');
  const [deckId, setDeckId] = useState('defaultDeck');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newCard: Flashcard = {
      id: crypto.randomUUID(),
      front,
      back,
      hint: hint || undefined,
      tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
      deckId,
    };

    const existingCards = await loadFlashcards();
    await storeFlashcards([...existingCards, newCard]);

    // Clear the form
    setFront('');
    setBack('');
    setHint('');
    setTags('');
    setDeckId('defaultDeck');

    alert('✅ Card added successfully!');
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h2>Add New Flashcard</h2>

      <input
        type="text"
        value={front}
        onChange={(e) => setFront(e.target.value)}
        placeholder="Front (question)"
        required
      />

      <input
        type="text"
        value={back}
        onChange={(e) => setBack(e.target.value)}
        placeholder="Back (answer)"
        required
      />

      <input
        type="text"
        value={hint}
        onChange={(e) => setHint(e.target.value)}
        placeholder="Hint (optional)"
      />

      <input
        type="text"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        placeholder="Tags (comma-separated)"
      />

      <input
        type="text"
        value={deckId}
        onChange={(e) => setDeckId(e.target.value)}
        placeholder="Deck ID"
      />

      <button type="submit">Add Flashcard</button>
    </form>
  );
};

export default CreateCardForm;
