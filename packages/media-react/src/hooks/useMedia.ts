import { useState, useCallback, useEffect } from 'react';
import type { Photo, Video } from '@headless-media/core';
import { useSDK } from '../context/MediaContext.js';

type MediaType = 'photo' | 'video';
type MediaItem<T extends MediaType> = T extends 'photo' ? Photo : Video;

interface UseMediaState<T extends MediaType> {
  media: MediaItem<T> | null;
  isLoading: boolean;
  error: Error | null;
}

/**
 * Fetches a single media item by ID.
 *
 * WHY auto-fetch on mount: Single-item lookup is deterministic — given the
 * same `type` and `id`, the result is the same. We auto-fetch to match the
 * "fetch-on-render" pattern consumers expect.
 *
 * @example
 * ```tsx
 * const { media, isLoading } = useMedia('photo', 12345);
 * ```
 */
export function useMedia<T extends MediaType>(
  type: T,
  id: number,
): UseMediaState<T> & { refetch: () => void } {
  const sdk = useSDK();
  const [media, setMedia] = useState<MediaItem<T> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchMedia = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = type === 'photo' ? await sdk.photos.getById(id) : await sdk.videos.getById(id);
      setMedia(result as MediaItem<T>);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  }, [sdk, type, id]);

  useEffect(() => {
    void fetchMedia();
  }, [fetchMedia]);

  return { media, isLoading, error, refetch: () => void fetchMedia() };
}
