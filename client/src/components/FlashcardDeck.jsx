import { useState } from 'react';

export default function FlashcardDeck({ cards }) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const card = cards[index];

  function go(delta) {
    setFlipped(false);
    setIndex((i) => Math.min(Math.max(i + delta, 0), cards.length - 1));
  }

  return (
    <div className="deck">
      <p className="deck-progress">
        Card {index + 1} of {cards.length}
      </p>

      <button
        type="button"
        className={`flashcard ${flipped ? 'is-flipped' : ''}`}
        onClick={() => setFlipped((f) => !f)}
        aria-label="Flip card"
      >
        <span className="flashcard-label">{flipped ? 'Answer' : 'Question'}</span>
        <span className="flashcard-text">{flipped ? card.answer : card.question}</span>
        <span className="flashcard-hint">Tap to flip</span>
      </button>

      <div className="deck-nav">
        <button type="button" onClick={() => go(-1)} disabled={index === 0}>
          ← Prev
        </button>
        <button type="button" onClick={() => go(1)} disabled={index === cards.length - 1}>
          Next →
        </button>
      </div>
    </div>
  );
}
