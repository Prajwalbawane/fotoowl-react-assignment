import { useState, useEffect, useRef } from 'react';
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
interface ReelItemViewProps {
  video: Video;
  isActive: boolean;
  isMuted: boolean;
  onToggleMute: () => void;
}

function ReelItemView({ video, isActive, isMuted, onToggleMute }: ReelItemViewProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [hasError, setHasError] = useState(false);
  const bestFile = getBestVideoFile(video, 'hd');

  useEffect(() => {
    const videoEl = videoRef.current;
    if (videoEl === null || bestFile === undefined || !bestFile.link) return;

    videoEl.muted = isMuted;

    if (isActive) {
      const playPromise = videoEl.play();
      if (playPromise !== undefined) {
        playPromise.catch((err: Error) => {
          if (err.name !== 'AbortError') {
            console.warn('[ReelItemView] Autoplay interrupted:', err);
          }
        });
      }
    } else {
      videoEl.pause();
    }
  }, [isActive, isMuted, bestFile]);

  if (bestFile === undefined || !bestFile.link || hasError) {
    return (
      <div className="reel-error-placeholder" role="alert">
        <p style={{ fontWeight: 600 }}>Video Unavailable</p>
        <p style={{ fontSize: '0.8rem', opacity: 0.7 }}>
          {video.user.name ? `By ${video.user.name}` : 'Unable to stream this reel format.'}
        </p>
      </div>
    );
  }

  return (
    <>
      <video
        ref={videoRef}
        src={bestFile.link}
        poster={video.image}
        loop
        muted={isMuted}
        playsInline
        aria-label={`Video reel by ${video.user.name}`}
        onError={() => setHasError(true)}
      />

      {isActive && (
        <button
          type="button"
          className="reel-sound-btn"
          onClick={onToggleMute}
          aria-label={isMuted ? 'Unmute video audio' : 'Mute video audio'}
        >
          {isMuted ? '🔇 Muted' : '🔊 Sound On'}
        </button>
      )}

      <div className="reel-item-info">
        <p className="reel-item-author">By {video.user.name}</p>
        <p style={{ fontSize: '0.75rem', opacity: 0.6 }}>Duration: {video.duration}s</p>
      </div>
    </>
  );
}

export function ReelsPage() {
  const { results, isLoading, error, fetchMore, hasMore, refresh } = useCurated('videos', {
    perPage: 10,
  });

  const [isMuted, setIsMuted] = useState(true);

  const { getContainerProps, getItemProps, activeIndex } = useReelSwiper<Video>({
    items: results,
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
      {results.map((video, index) => (
        <div key={video.id} {...getItemProps(video, index)} className="reel-item">
          <ReelItemView
            video={video}
            isActive={index === activeIndex}
            isMuted={isMuted}
            onToggleMute={() => setIsMuted((prev) => !prev)}
          />
        </div>
      ))}
      <div ref={activeIndicatorRef} aria-hidden="true" />
    </div>
  );
}
