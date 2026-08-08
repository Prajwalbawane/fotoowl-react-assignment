import { useEffect } from 'react';
import { useCurated, useViewer } from '@headless-media/react';
import { PhotoGrid } from '../components/PhotoGrid.js';
import { PhotoLightbox } from '../components/PhotoLightbox.js';
import { LoadingState, ErrorState } from '../components/StateComponents.js';

/**
 * Home page — displays the curated Pexels photo feed.
 *
 * Wiring pattern:
 * 1. useCurated (media-react) → fetches data from SDK
 * 2. useViewer (media-react) → manages lightbox state + emits view events
 * 3. PhotoGrid (app component) → wires data + useGrid (media-ui-react)
 * 4. PhotoLightbox (app component) → wires viewer state + useLightbox (media-ui-react)
 */
export function HomePage() {
  const { results, isLoading, error, hasMore, fetchMore, refresh } = useCurated('photos', {
    perPage: 20,
  });
  const { isOpen, current, currentIndex, open, close, goNext, goPrev } = useViewer();

  useEffect(() => {
    void refresh();
  }, [refresh]);

  if (isLoading && results.length === 0) {
    return <LoadingState message="Loading curated photos..." />;
  }

  if (error !== null && results.length === 0) {
    return <ErrorState message={error.message} onRetry={() => void refresh()} />;
  }

  return (
    <>
      <h1 className="page-title">Curated Photos</h1>
      <p className="page-subtitle">{results.length > 0 ? `${results.length} photos loaded` : ''}</p>

      <PhotoGrid
        photos={results}
        isLoading={isLoading}
        hasMore={hasMore}
        onLoadMore={() => void fetchMore()}
        onPhotoClick={(photo, index) => open(photo, results, index)}
      />

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
