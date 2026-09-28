import { useMemo, useState } from 'react';

function shuffle(list) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Multiple-choice quiz. Options are shuffled here rather than trusting the
 * order the model returned, so the right answer isn't always in one slot.
 * Wrong answers collect into a "retest" round.
 */
export default function QuizView({ cards }) {
  const [round, setRound] = useState(cards);
  const [runKey, setRunKey] = useState(0);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [wrong, setWrong] = useState([]);
  const [finished, setFinished] = useState(false);

  const questions = useMemo(
    () => round.map((card) => ({ ...card, options: shuffle(card.options) })),
    [round, runKey]
  );

  const total = questions.length;
  const current = questions[index];
  const answered = selected !== null;

  function choose(option) {
    if (answered) return;
    setSelected(option);
    if (option !== current.answer) setWrong((w) => [...w, cards.find((c) => c.id === current.id)]);
  }

  function next() {
    setSelected(null);
    if (index + 1 < total) setIndex((i) => i + 1);
    else setFinished(true);
  }

  function startRound(nextRound) {
    setRound(nextRound);
    setRunKey((k) => k + 1);
    setWrong([]);
    setIndex(0);
    setSelected(null);
    setFinished(false);
  }

  if (finished) {
    const correct = total - wrong.length;
    return (
      <div className="quiz-summary">
        <h3>
          You got {correct} of {total} right
        </h3>
        {wrong.length > 0 ? (
          <button type="button" onClick={() => startRound(wrong)}>
            Retest {wrong.length} missed question{wrong.length > 1 ? 's' : ''}
          </button>
        ) : (
          <p className="quiz-note">Perfect round. Nothing left to retest.</p>
        )}
        <button type="button" className="secondary" onClick={() => startRound(cards)}>
          Restart full quiz
        </button>
      </div>
    );
  }

  return (
    <div className="quiz">
      <p className="deck-progress">
        Question {index + 1} of {total}
      </p>
      <div className="quiz-question">{current.question}</div>

      <ul className="options">
        {current.options.map((option, i) => {
          const isCorrect = option === current.answer;
          const isChosen = option === selected;
          let state = '';
          if (answered) state = isCorrect ? 'correct' : isChosen ? 'wrong' : 'dim';
          return (
            <li key={option}>
              <button
                type="button"
                className={`option ${state}`}
                onClick={() => choose(option)}
                disabled={answered}
              >
                <span className="option-key">{String.fromCharCode(65 + i)}</span>
                <span className="option-text">{option}</span>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="quiz-feedback" aria-live="polite">
        {answered && (
          <>
            <p className={selected === current.answer ? 'is-correct' : 'is-wrong'}>
              {selected === current.answer ? 'Correct.' : 'Not quite. The right answer is highlighted.'}
            </p>
            <button type="button" onClick={next}>
              {index + 1 < total ? 'Next question' : 'See results'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}