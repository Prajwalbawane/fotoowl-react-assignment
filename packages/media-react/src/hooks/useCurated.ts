import { useState, useCallback, useRef } from 'react';
import type { Photo, Video, PaginatedResponse, PaginationParams } from '@headless-media/core';
import { useSDK } from '../context/MediaContext.js';

type MediaType = 'photos' | 'videos';
type CuratedResult<T extends MediaType> = T extends 'photos' ? Photo : Video;

interface UseCuratedState<T extends MediaType> {
  results: readonly CuratedResult<T>[];
  isLoading: boolean;
  error: Error | null;
  hasMore: boolean;
  totalResults: number;
}

interface UseCuratedActions {
  fetchMore: () => Promise<void>;
  refresh: () => Promise<void>;
}

type UseCuratedReturn<T extends MediaType> = UseCuratedState<T> & UseCuratedActions;

/**
 * Fetches the curated/popular feed with infinite-scroll pagination.
 *
 * @example
 * ```tsx
 * const { results, isLoading, fetchMore, hasMore, refresh } = useCurated('photos');
 * useEffect(() => { void refresh(); }, [refresh]);
 * ```
 */
export function useCurated<T extends MediaType>(
  type: T,
  params?: PaginationParams,
): UseCuratedReturn<T> {
  type Result = CuratedResult<T>;

  const sdk = useSDK();
  const [results, setResults] = useState<readonly Result[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [totalResults, setTotalResults] = useState(0);
  const pageRef = useRef(1);

  // Keep params ref fresh to prevent un-memoized object literals in callers
  // from causing infinite re-renders when `refresh` is in a useEffect dep array.
  const paramsRef = useRef(params);
  paramsRef.current = params;

  const fetch = useCallback(
    async (page: number, append: boolean): Promise<void> => {
      setIsLoading(true);
      setError(null);
      try {
        let response: PaginatedResponse<Result>;
        if (type === 'photos') {
          response = (await sdk.photos.getCurated({
            ...paramsRef.current,
            page,
          })) as PaginatedResponse<Result>;
        } else {
          response = (await sdk.videos.getPopular({
            ...paramsRef.current,
            page,
          })) as PaginatedResponse<Result>;
        }
        setResults((prev) => (append ? [...prev, ...response.items] : [...response.items]));
        setHasMore(response.nextPage !== null);
        setTotalResults(response.totalResults);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setIsLoading(false);
      }
    },
    [sdk, type],
  );

  const refresh = useCallback(async () => {
    pageRef.current = 1;
    await fetch(1, false);
  }, [fetch]);

  const fetchMore = useCallback(async () => {
    if (isLoading || !hasMore) return;
    pageRef.current += 1;
    await fetch(pageRef.current, true);
  }, [isLoading, hasMore, fetch]);

  return { results, isLoading, error, hasMore, totalResults, fetchMore, refresh };
}
