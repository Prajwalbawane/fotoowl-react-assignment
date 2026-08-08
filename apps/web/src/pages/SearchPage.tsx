import { useRef, type FormEvent } from 'react';
import { useSearch, useViewer } from '@headless-media/react';
import { PhotoGrid } from '../components/PhotoGrid.js';
import { PhotoLightbox } from '../components/PhotoLightbox.js';
import { EmptyState, ErrorState } from '../components/StateComponents.js';

/**
 * Search page — query-driven photo search with infinite scroll.
 *
 * Demonstrates useSearch's setQuery → reset → re-fetch flow.
 */
export function SearchPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const { query, results, isLoading, error, hasMore, fetchMore, setQuery, reset } =
    useSearch('photos');
  const { isOpen, current, currentIndex, open, close, goNext, goPrev } = useViewer();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const value = inputRef.current?.value.trim() ?? '';
    if (value) {
      setQuery(value);
    }
  };

  const handleClear = () => {
    if (inputRef.current) inputRef.current.value = '';
    reset();
  };

  return (
    <>
      <h1 className="page-title">Search Photos</h1>

      <form className="search-bar" onSubmit={handleSubmit} role="search">
        <input
          ref={inputRef}
          className="search-input"
          type="search"
          placeholder="Search for photos (e.g. mountains, city, ocean)"
          aria-label="Search photos"
          defaultValue={query}
        />
        <button className="search-btn" type="submit" disabled={isLoading}>
          Search
        </button>
        {query && (
          <button className="retry-btn" type="button" onClick={handleClear}>
            Clear
          </button>
        )}
      </form>

      {error !== null && (
        <ErrorState
          message={error.message}
          onRetry={() => inputRef.current?.value && setQuery(inputRef.current.value)}
        />
      )}

      {!error && query === '' && (
        <EmptyState message="Enter a search term above to discover photos." />
      )}

      {query !== '' && error === null && (
        <>
          {results.length > 0 && (
            <p className="page-subtitle">
              Showing {results.length} results for &ldquo;{query}&rdquo;
            </p>
          )}
          <PhotoGrid
            photos={results}
            isLoading={isLoading}
            hasMore={hasMore}
            onLoadMore={() => void fetchMore()}
            onPhotoClick={(photo, index) => open(photo, results, index)}
          />
        </>
      )}

      <PhotoLightbox
        isOpen={isOpen}
        photo={current && 'src' in current ? current : null}
        onClose={close}
        onNext={goNext}
        onPrev={goPrev}
        hasNext={currentIndex < results.length - 1}
        hasPrev={currentIndex > 0}
      />
    </>
  );
}
