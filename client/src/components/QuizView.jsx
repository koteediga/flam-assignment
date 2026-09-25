import { useMemo, useState } from 'react';

/**
 * A self-graded quiz: the user reveals the answer and judges themselves
 * (open-ended Q&A doesn't lend itself to auto-grading without asking the
 * model to also invent multiple-choice distractors, which we skipped to
 * keep the core solid). Wrong answers roll into a "retest" round.
 */
export default function QuizView({ cards }) {
  const [round, setRound] = useState(cards);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [wrong, setWrong] = useState([]);
  const [finished, setFinished] = useState(false);

  const current = round[index];
  const total = round.length;

  function mark(isCorrect) {
    if (!isCorrect) setWrong((w) => [...w, current]);
    setRevealed(false);

    if (index + 1 < total) {
      setIndex((i) => i + 1);
    } else {
      setFinished(true);
    }
  }

  function retestWrong() {
    setRound(wrong);
    setWrong([]);
    setIndex(0);
    setRevealed(false);
    setFinished(false);
  }

  function restartAll() {
    setRound(cards);
    setWrong([]);
    setIndex(0);
    setRevealed(false);
    setFinished(false);
  }

  const correctCount = useMemo(() => total - wrong.length, [total, wrong]);

  if (finished) {
    return (
      <div className="quiz-summary">
        <h3>
          Round complete: {correctCount}/{total} correct
        </h3>
        {wrong.length > 0 ? (
          <button type="button" onClick={retestWrong}>
            Retest {wrong.length} wrong answer{wrong.length > 1 ? 's' : ''}
          </button>
        ) : (
          <p>All correct — nice work.</p>
        )}
        <button type="button" className="secondary" onClick={restartAll}>
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

      {revealed ? (
        <>
          <div className="quiz-answer">{current.answer}</div>
          <div className="quiz-judge">
            <button type="button" onClick={() => mark(true)}>
              I got it right
            </button>
            <button type="button" className="secondary" onClick={() => mark(false)}>
              I got it wrong
            </button>
          </div>
        </>
      ) : (
        <button type="button" onClick={() => setRevealed(true)}>
          Reveal answer
        </button>
      )}
    </div>
  );
}
