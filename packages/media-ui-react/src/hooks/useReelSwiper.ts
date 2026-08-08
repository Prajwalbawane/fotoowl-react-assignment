import type React from 'react';
import { useRef, useState, useEffect, useCallback, type HTMLAttributes } from 'react';

export interface UseReelSwiperItem {
  id: number | string;
}

export interface UseReelSwiperProps<T extends UseReelSwiperItem> {
  items: readonly T[];
  /** Called when the active (center-most) item changes. */
  onActiveItemChange?: (item: T, index: number) => void;
  /** Whether snapping is enabled. @default true */
  snapEnabled?: boolean;
}

export interface UseReelSwiperReturn<T extends UseReelSwiperItem> {
  /** The index of the currently visible/active item. */
  activeIndex: number;
  /** The currently active item. */
  activeItem: T | null;
  /** Props for the scroll container. */
  getContainerProps: () => HTMLAttributes<HTMLElement> & {
    ref: (el: HTMLDivElement | null) => void;
  };
  /**
   * Props for each reel item. Must be called with the item and its index.
   * Spread onto each item's root element.
   */
  getItemProps: (
    item: T,
    index: number,
  ) => HTMLAttributes<HTMLElement> & {
    ref: (el: HTMLElement | null) => void;
    'data-reel-index': number;
    'data-active': boolean;
    'data-item-id': string | number;
  };
  /** Programmatically scroll to a specific index. */
  scrollToIndex: (index: number) => void;
}

/**
 * Headless hook for a vertical-snapping reel swiper.
 *
 * Uses IntersectionObserver to detect the active (most visible) item.
 * CSS scroll-snap is the consumer's responsibility — this hook provides
 * ARIA attributes and active-item tracking.
 *
 * Recommended consumer CSS:
 * ```css
 * .reel-container { overflow-y: scroll; scroll-snap-type: y mandatory; height: 100vh; }
 * .reel-item { scroll-snap-align: start; height: 100vh; }
 * ```
 *
 * @example
 * ```tsx
 * const { getContainerProps, getItemProps, activeIndex } = useReelSwiper({
 *   items: videos,
 *   onActiveItemChange: (video) => sdk.events.emit('view', { mediaId: video.id, mediaType: 'video' }),
 * });
 * ```
 */
export function useReelSwiper<T extends UseReelSwiperItem>({
  items,
  onActiveItemChange,
  snapEnabled = true,
}: UseReelSwiperProps<T>): UseReelSwiperReturn<T> {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<Map<number, HTMLElement>>(new Map());
  const [activeIndex, setActiveIndex] = useState(0);
  const onActiveItemChangeRef = useRef(onActiveItemChange);

  useEffect(() => {
    onActiveItemChangeRef.current = onActiveItemChange;
  }, [onActiveItemChange]);

  useEffect(() => {
    const container = containerRef.current;
    if (container === null || items.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the entry with the highest intersection ratio
        let maxRatio = 0;
        let bestIndex = 0;

        for (const entry of entries) {
          if (entry.intersectionRatio > maxRatio) {
            maxRatio = entry.intersectionRatio;
            const indexAttr = (entry.target as HTMLElement).dataset['reelIndex'];
            bestIndex = indexAttr !== undefined ? Number(indexAttr) : 0;
          }
        }

        if (maxRatio > 0.5) {
          setActiveIndex(bestIndex);
          const item = items[bestIndex];
          if (item !== undefined) {
            onActiveItemChangeRef.current?.(item, bestIndex);
          }
        }
      },
      {
        root: container,
        threshold: [0, 0.5, 1.0],
      },
    );

    for (const [, el] of itemRefs.current) {
      observer.observe(el);
    }

    return () => observer.disconnect();
  }, [items]);

  const scrollToIndex = useCallback((index: number) => {
    const el = itemRefs.current.get(index);
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const getContainerProps = useCallback(
    (): HTMLAttributes<HTMLElement> & { ref: (el: HTMLDivElement | null) => void } => ({
      ref: (el: HTMLDivElement | null) => {
        containerRef.current = el;
      },
      role: 'feed',
      'aria-label': 'Video reels',
      style: snapEnabled ? ({ scrollSnapType: 'y mandatory' } as React.CSSProperties) : undefined,
    }),
    [snapEnabled],
  );

  const getItemProps = useCallback(
    (
      item: T,
      index: number,
    ): HTMLAttributes<HTMLElement> & {
      ref: (el: HTMLElement | null) => void;
      'data-reel-index': number;
      'data-active': boolean;
      'data-item-id': string | number;
    } => ({
      ref: (el: HTMLElement | null) => {
        if (el !== null) {
          itemRefs.current.set(index, el);
          el.dataset['reelIndex'] = String(index);
        } else {
          itemRefs.current.delete(index);
        }
      },
      role: 'article',
      'aria-label': `Reel item ${index + 1} of ${items.length}`,
      'aria-current': index === activeIndex,
      'data-reel-index': index,
      'data-active': index === activeIndex,
      'data-item-id': item.id,
      style: snapEnabled ? ({ scrollSnapAlign: 'start' } as React.CSSProperties) : undefined,
    }),
    [activeIndex, items.length, snapEnabled],
  );

  return {
    activeIndex,
    activeItem: items[activeIndex] ?? null,
    getContainerProps,
    getItemProps,
    scrollToIndex,
  };
}
