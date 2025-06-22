import React, { useEffect, useState } from 'react';

function getQueryParam(param: string) {
  const params = new URLSearchParams(window.location.search);
  return params.get(param);
}

export default function Popup() {
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');

  useEffect(() => {
    const selectedText = getQueryParam('front');
    if (selectedText) setFront(selectedText);
  }, []);

  const handleSubmit = async () => {
    // Call your backend API to save the card
    try {
      const response = await fetch('https://your-api/cards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + (await getAuthToken()), // your auth logic
        },
        body: JSON.stringify({ front, back }),
      });
      if (response.ok) {
        alert('Card saved!');
        setBack('');
      } else {
        alert('Failed to save card.');
      }
    } catch (error) {
      alert('Error saving card.');
    }
  };

  return (
    <div style={{ padding: 20, width: 350 }}>
      <h2>Create Flashcard</h2>
      <label>
        Front:
        <textarea value={front} readOnly rows={4} style={{ width: '100%' }} />
      </label>
      <label>
        Back:
        <textarea
          value={back}
          onChange={(e) => setBack(e.target.value)}
          rows={6}
          style={{ width: '100%' }}
        />
      </label>
      <button onClick={handleSubmit} disabled={!back.trim()}>
        Save Card
      </button>
    </div>
  );
}
function getAuthToken() {
    throw new Error('Function not implemented.');
}

