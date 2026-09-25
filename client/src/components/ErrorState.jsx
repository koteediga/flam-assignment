export default function ErrorState({ message, onRetry }) {
  return (
    <div className="state-card error-state" role="alert">
      <p>{message || 'Something went wrong.'}</p>
      {onRetry && (
        <button type="button" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}
