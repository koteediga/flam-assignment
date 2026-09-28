export default function ErrorState({ message, onRetry }) {
  return (
    <div className="state-card error-state" role="alert">
      <svg className="state-icon" viewBox="0 0 64 64" aria-hidden="true">
        <circle cx="32" cy="32" r="24" fill="none" stroke="currentColor" />
        <path d="M32 20v14" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        <circle cx="32" cy="43" r="2.5" fill="currentColor" />
      </svg>
      <p>{message || 'Something went wrong.'}</p>
      {onRetry && (
        <button type="button" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}