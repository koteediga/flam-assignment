export default function LoadingState() {
  return (
    <div className="state-card loading-state" role="status" aria-live="polite">
      <div className="spinner" />
      <p>Generating your flashcards…</p>
    </div>
  );
}
