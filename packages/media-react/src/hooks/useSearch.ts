import { useState, useCallback, useRef } from 'react';
import type { Photo, Video, PaginatedResponse, SearchParams } from '@headless-media/core';
import { useSDK } from '../context/MediaContext.js';

type MediaType = 'photos' | 'videos';
type MediaItem = Photo | Video;

interface UseSearchState<T extends MediaItem> {
  /** The current search query string. */
  query: string;
  /** All accumulated items across all loaded pages. */
  results: readonly T[];
  /** True while the initial or next-page request is in flight. */
  isLoading: boolean;
  /** Error from the last failed request, or null. */
  error: Error | null;
  /** True if there are more pages to load. */
  hasMore: boolean;
  /** Total number of results reported by the API. */
  totalResults: number;
}

interface UseSearchActions {
  /** Update the query — triggers a fresh search (page 1). */
  setQuery: (query: string) => void;
  /** Fetch the next page and append to results. */
  fetchMore: () => Promise<void>;
  /** Clear results and reset state. */
  reset: () => void;
}

type UseSearchReturn<T extends MediaItem> = UseSearchState<T> & UseSearchActions;

const INITIAL_STATE = {
  results: [] as const,
  isLoading: false,
  error: null,
  hasMore: false,
  totalResults: 0,
};

/**
 * Hook for searching photos or videos with built-in pagination.
 *
 * Design decisions:
 * - Results are *accumulated* across pages (infinite scroll pattern).
 * - `setQuery` always resets to page 1 (new query = fresh results).
 * - The page cursor is tracked in a ref to avoid stale closures in `fetchMore`.
 *
 * @example
 * ```tsx
 * const { query, setQuery, results, isLoading, hasMore, fetchMore } = useSearch('photos');
 * ```
 */
export function useSearch<T extends MediaType>(
  type: T,
  defaultParams?: Omit<SearchParams, 'query'>,
): UseSearchReturn<T extends 'photos' ? Photo : Video> {
  type Result = T extends 'photos' ? Photo : Video;

  const sdk = useSDK();
  const [state, setState] = useState<UseSearchState<Result>>({ ...INITIAL_STATE, query: '' });
  const pageRef = useRef(1);
  const queryRef = useRef('');

  const defaultParamsRef = useRef(defaultParams);
  defaultParamsRef.current = defaultParams;

  const runSearch = useCallback(
    async (query: string, page: number, append: boolean): Promise<void> => {
      if (!query.trim()) return;

      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        let response: PaginatedResponse<Result>;
        const params: SearchParams = { ...defaultParamsRef.current, query, page };

        if (type === 'photos') {
          response = (await sdk.photos.search(params)) as PaginatedResponse<Result>;
        } else {
          response = (await sdk.videos.search(params)) as PaginatedResponse<Result>;
        }

        setState((prev) => ({
          ...prev,
          results: append ? [...prev.results, ...response.items] : [...response.items],
          isLoading: false,
          hasMore: response.nextPage !== null,
          totalResults: response.totalResults,
        }));
      } catch (error) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: error instanceof Error ? error : new Error('Unknown error'),
        }));
      }
    },
    [sdk, type],
  );

  const setQuery = useCallback(
    (query: string) => {
      pageRef.current = 1;
      queryRef.current = query;
      setState((prev) => ({ ...prev, query, results: [], totalResults: 0, hasMore: false }));
      void runSearch(query, 1, false);
    },
    [runSearch],
  );

  const fetchMore = useCallback(async () => {
    if (state.isLoading || !state.hasMore) return;
    pageRef.current += 1;
    await runSearch(queryRef.current, pageRef.current, true);
  }, [state.isLoading, state.hasMore, runSearch]);

  const reset = useCallback(() => {
    pageRef.current = 1;
    queryRef.current = '';
    setState({ ...INITIAL_STATE, query: '' });
  }, []);

  return { ...state, setQuery, fetchMore, reset } as UseSearchReturn<
    T extends 'photos' ? Photo : Video
  >;
}
