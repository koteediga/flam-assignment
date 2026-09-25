import { useState } from 'react';

export default function PromptInput({ onSubmit, disabled }) {
  const [value, setValue] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSubmit(trimmed);
  }

  return (
    <form className="prompt-form" onSubmit={handleSubmit}>
      <textarea
        className="prompt-input"
        placeholder="Paste your notes, or just type a topic (e.g. 'the French Revolution', or 'JavaScript closures')..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        rows={4}
        maxLength={4000}
        disabled={disabled}
      />
      <div className="prompt-footer">
        <span className="char-count">{value.length}/4000</span>
        <button type="submit" disabled={disabled || !value.trim()}>
          {disabled ? 'Generating…' : 'Generate flashcards'}
        </button>
      </div>
    </form>
  );
}
