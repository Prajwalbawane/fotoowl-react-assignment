import { useState, useRef, useCallback, useEffect, type HTMLAttributes } from 'react';

export interface UseGridItem {
  id: number | string;
}

export interface UseGridProps<T extends UseGridItem> {
  items: readonly T[];
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
  /**
   * Margin around the sentinel element before triggering `onLoadMore`.
   * A negative value (e.g. "200px") triggers before the element is visible.
   * @default "200px"
   */
  loadMoreThreshold?: string;
}

export interface UseGridReturn<T extends UseGridItem> {
  /** Props to spread onto the grid container element. */
  getContainerProps: () => HTMLAttributes<HTMLElement>;
  /**
   * Props to spread onto each grid item element.
   * The `key` prop must still be provided by the consumer.
   */
  getItemProps: (item: T) => HTMLAttributes<HTMLElement> & { 'data-item-id': string | number };
  /** Props to spread onto the load-more sentinel element. */
  getSentinelProps: () => HTMLAttributes<HTMLElement> & {
    ref: (el: HTMLDivElement | null) => void;
  };
  /** Whether an IntersectionObserver is active. */
  isObserving: boolean;
}

/**
 * Headless hook for a media grid with infinite scroll.
 *
 * Uses IntersectionObserver to trigger `onLoadMore` when the sentinel element
 * becomes visible. The consumer supplies all markup and styling.
 *
 * Prop-getter pattern: `getContainerProps()`, `getItemProps(item)`, and
 * `getSentinelProps()` return HTML attribute objects that the consumer spreads
 * onto their own elements. This allows full control over the DOM structure
 * while the hook provides accessibility attributes and event handlers.
 *
 * @example
 * ```tsx
 * const { getContainerProps, getItemProps, getSentinelProps } = useGrid({ items, hasMore, isLoading, onLoadMore });
 *
 * return (
 *   <div {...getContainerProps()}>
 *     {items.map((item) => (
 *       <div key={item.id} {...getItemProps(item)}>
 *         <img src={item.src.medium} alt={item.alt} />
 *       </div>
 *     ))}
 *     <div {...getSentinelProps()} />
 *   </div>
 * );
 * ```
 */
export function useGrid<T extends UseGridItem>({
  items: _items,
  hasMore,
  isLoading,
  onLoadMore,
  loadMoreThreshold = '200px',
}: UseGridProps<T>): UseGridReturn<T> {
  const [sentinel, setSentinel] = useState<HTMLDivElement | null>(null);
  const isObservingRef = useRef(false);
  const onLoadMoreRef = useRef(onLoadMore);

  // Keep callback ref fresh without invalidating the observer
  useEffect(() => {
    onLoadMoreRef.current = onLoadMore;
  }, [onLoadMore]);

  useEffect(() => {
    if (sentinel === null) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting && hasMore && !isLoading) {
          onLoadMoreRef.current();
        }
      },
      { rootMargin: loadMoreThreshold },
    );

    observer.observe(sentinel);
    isObservingRef.current = true;

    return () => {
      observer.disconnect();
      isObservingRef.current = false;
    };
  }, [sentinel, hasMore, isLoading, loadMoreThreshold]);

  const getContainerProps = useCallback(
    (): HTMLAttributes<HTMLElement> => ({
      role: 'list',
      'aria-busy': isLoading,
    }),
    [isLoading],
  );

  const getItemProps = useCallback(
    (item: T): HTMLAttributes<HTMLElement> & { 'data-item-id': string | number } => ({
      role: 'listitem',
      'data-item-id': item.id,
    }),
    [],
  );

  const getSentinelProps = useCallback(
    (): HTMLAttributes<HTMLElement> & { ref: (el: HTMLDivElement | null) => void } => ({
      ref: setSentinel,
      'aria-hidden': true,
      role: 'presentation',
    }),
    [],
  );

  return {
    getContainerProps,
    getItemProps,
    getSentinelProps,
    isObserving: isObservingRef.current,
  };
}
