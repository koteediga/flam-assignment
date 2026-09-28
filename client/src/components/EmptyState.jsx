export default function EmptyState() {
  return (
    <div className="state-card empty-state">
      <svg className="state-icon" viewBox="0 0 64 64" aria-hidden="true">
        <rect x="14" y="8" width="38" height="46" rx="8" fill="none" stroke="currentColor" strokeOpacity="0.25" />
        <rect x="10" y="12" width="38" height="46" rx="8" fill="none" stroke="currentColor" strokeOpacity="0.5" />
        <rect x="6" y="16" width="38" height="46" rx="8" fill="#0d2114" stroke="#4ade80" />
        <path d="M16 32h18M16 40h12" stroke="#4ade80" strokeLinecap="round" />
      </svg>
      <p>Your cards will show up here. Add a topic or some notes to start.</p>
    </div>
  );
}