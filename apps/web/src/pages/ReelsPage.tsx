import { useEffect, useRef } from 'react';
import { useCurated, useSDKEvent } from '@headless-media/react';
import { getBestVideoFile } from '@headless-media/core';
import { useReelSwiper } from '@headless-media/ui-react';
import type { Video } from '@headless-media/core';
import { LoadingState, ErrorState, EmptyState } from '../components/StateComponents.js';

/**
 * ReelsPage — vertical video reels using the scroll-snap pattern.
 *
 * Demonstrates:
 * - useCurated('videos') for data
 * - useReelSwiper (media-ui-react) for active-item detection + scroll snap
 * - useSDKEvent for reacting to view events in the UI
 *
 * The onActiveItemChange callback passed to useReelSwiper triggers a view event
 * via useViewer in a real app. Here we use useSDKEvent to show it working.
 */
export function ReelsPage() {
  const { results, isLoading, error, fetchMore, hasMore, refresh } = useCurated('videos', {
    perPage: 10,
  });

  const { getContainerProps, getItemProps, activeIndex } = useReelSwiper<Video>({
    items: results,
    onActiveItemChange: (_video, _index) => {
      // The view event is emitted by useViewer in useReelSwiper's onActiveItemChange
      // In this demo we log it to demonstrate SDK event flow without circular deps
    },
  });

  const activeIndicatorRef = useRef<HTMLDivElement>(null);

  // Demonstrate SDK event subscription
  useSDKEvent('view', ({ mediaId, mediaType }) => {
    console.log(`[App] Received view event: ${mediaType} #${mediaId}`);
  });

  useEffect(() => {
    void refresh();
  }, [refresh]);

  if (isLoading && results.length === 0) {
    return <LoadingState message="Loading video reels..." />;
  }

  if (error !== null && results.length === 0) {
    return <ErrorState message={error.message} onRetry={() => void refresh()} />;
  }

  if (results.length === 0) {
    return <EmptyState message="No video reels available." />;
  }

  return (
    <div
      {...getContainerProps()}
      className="reels-container"
      onScroll={() => {
        if (activeIndex >= results.length - 3 && hasMore && !isLoading) {
          void fetchMore();
        }
      }}
    >
      {results.map((video, index) => {
        const bestFile = getBestVideoFile(video, 'hd');
        return (
          <div key={video.id} {...getItemProps(video, index)} className="reel-item">
            {bestFile !== undefined && (
              <video
                src={bestFile.link}
                poster={video.image}
                autoPlay={index === activeIndex}
                loop
                muted
                playsInline
                aria-label={`Video by ${video.user.name}`}
              />
            )}
            <div className="reel-item-info">
              <p className="reel-item-author">By {video.user.name}</p>
              <p style={{ fontSize: '0.75rem', opacity: 0.6 }}>
                {index + 1} / {results.length}
              </p>
            </div>
          </div>
        );
      })}
      <div ref={activeIndicatorRef} aria-hidden="true" />
    </div>
  );
}
