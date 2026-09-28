import { useRef, useState } from 'react';
import HeroArt from './components/HeroArt.jsx';
import PromptInput from './components/PromptInput.jsx';
import LoadingState from './components/LoadingState.jsx';
import ErrorState from './components/ErrorState.jsx';
import EmptyState from './components/EmptyState.jsx';
import FlashcardDeck from './components/FlashcardDeck.jsx';
import QuizView from './components/QuizView.jsx';
import { generateFlashcards } from './lib/api.js';
import { validateResult } from './lib/validateResult.js';

export default function App() {
  const [status, setStatus] = useState('idle'); // idle | loading | error | success
  const [errorMessage, setErrorMessage] = useState('');
  const [result, setResult] = useState(null); // { topic, cards }
  const [view, setView] = useState('deck'); // deck | quiz
  const [lastInput, setLastInput] = useState('');

  // Guards against a slow earlier request overwriting a faster later one.
  const requestId = useRef(0);
  const abortRef = useRef(null);

  async function runGeneration(input) {
    const id = ++requestId.current;
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLastInput(input);
    setStatus('loading');
    setErrorMessage('');

    try {
      const raw = await generateFlashcards(input, { signal: controller.signal });
      if (id !== requestId.current) return; // superseded by a newer request

      const parsed = validateResult(raw);
      setResult(parsed);
      setView('deck');
      setStatus('success');
    } catch (err) {
      if (id !== requestId.current) return;
      if (err.name === 'AbortError') return; // superseded, not a real failure
      setErrorMessage(err.message || 'Something went wrong.');
      setStatus('error');
    }
  }

  return (
    <div className="app">
      <nav className="topbar">
        <svg className="brand-mark" viewBox="0 0 32 32" aria-hidden="true">
          <rect x="9" y="3" width="18" height="22" rx="5" fill="none" stroke="#4ade80" strokeOpacity="0.45" />
          <rect x="5" y="7" width="18" height="22" rx="5" fill="#0d2114" stroke="#4ade80" />
        </svg>
        <span>Study Assistant</span>
      </nav>

      <section className="hero">
        <div className="hero-copy">
          <header className="app-header">
            <h1>
              <span>Notes in.</span>
              <span className="h1-accent">Flashcards out.</span>
            </h1>
            <p>Paste notes or type a topic. Flip through the cards, then quiz yourself and retest what you missed.</p>
          </header>

          <PromptInput onSubmit={runGeneration} disabled={status === 'loading'} />

          <ol className="steps">
            <li><b>1</b> Add a topic or notes</li>
            <li><b>2</b> Flip through the cards</li>
            <li><b>3</b> Quiz and retest</li>
          </ol>
        </div>
        <HeroArt />
      </section>

      <main className="app-main">
        {status === 'idle' && <EmptyState />}
        {status === 'loading' && <LoadingState />}
        {status === 'error' && (
          <ErrorState message={errorMessage} onRetry={() => runGeneration(lastInput)} />
        )}
        {status === 'success' && result && (
          <>
            {result.topic && <h2 className="result-topic">{result.topic}</h2>}
            <div className="view-toggle">
              <button
                type="button"
                className={view === 'deck' ? 'active' : ''}
                onClick={() => setView('deck')}
              >
                Flashcards
              </button>
              <button
                type="button"
                className={view === 'quiz' ? 'active' : ''}
                onClick={() => setView('quiz')}
              >
                Quiz me
              </button>
            </div>

            {view === 'deck' ? (
              <FlashcardDeck cards={result.cards} />
            ) : (
              <QuizView key={result.topic + result.cards.length} cards={result.cards} />
            )}
          </>
        )}
      </main>
    </div>
  );
}