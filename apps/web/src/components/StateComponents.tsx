interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = 'Loading...' }: LoadingStateProps) {
  return (
    <div className="state-container" role="status" aria-label={message}>
      <div className="spinner" aria-hidden="true" />
      <p className="state-message">{message}</p>
    </div>
  );
}

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="state-container" role="alert">
      <span className="state-icon" aria-hidden="true">
        ⚠️
      </span>
      <p className="state-title">Something went wrong</p>
      <p className="state-message">{message}</p>
      {onRetry !== undefined && (
        <button className="retry-btn" onClick={onRetry} type="button">
          Try again
        </button>
      )}
    </div>
  );
}

export function EmptyState({ message = 'No results found.' }: { message?: string }) {
  return (
    <div className="state-container">
      <span className="state-icon" aria-hidden="true">
        🔍
      </span>
      <p className="state-title">Nothing here yet</p>
      <p className="state-message">{message}</p>
    </div>
  );
}
