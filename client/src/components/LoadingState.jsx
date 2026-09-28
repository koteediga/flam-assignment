export default function LoadingState() {
  return (
    <div className="state-card loading-state" role="status" aria-live="polite">
      <div className="skeleton-card" aria-hidden="true">
        <span className="sk-line" style={{ width: '30%' }} />
        <span className="sk-line" style={{ width: '90%' }} />
        <span className="sk-line" style={{ width: '65%' }} />
      </div>
      <p>Writing your flashcards…</p>
    </div>
  );
}