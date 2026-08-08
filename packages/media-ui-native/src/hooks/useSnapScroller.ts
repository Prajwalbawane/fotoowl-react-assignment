import { useState, useCallback, useRef, type RefObject } from 'react';

export interface UseSnapScrollerItem {
  id: number | string;
}

export interface UseSnapScrollerProps<T extends UseSnapScrollerItem> {
  items: readonly T[];
  onActiveItemChange?: (item: T, index: number) => void;
}

export interface UseSnapScrollerReturn<T extends UseSnapScrollerItem> {
  activeIndex: number;
  activeItem: T | null;
  /** Pass to FlatList's `onViewableItemsChanged` */
  handleViewableItemsChanged: (info: {
    viewableItems: Array<{ index: number | null; item: T }>;
  }) => void;
  /** Pass to FlatList's `viewabilityConfig` */
  viewabilityConfig: { itemVisiblePercentThreshold: number };
  /** Call to programmatically scroll to index */
  scrollToIndex: (index: number) => void;
  /** Ref to pass to FlatList's `ref` prop */
  listRef: RefObject<{
    scrollToIndex: (params: { index: number; animated: boolean }) => void;
  } | null>;
}

/**
 * Native equivalent of useReelSwiper.
 * Designed to work with React Native's FlatList in pagingEnabled mode.
 *
 * Recommended FlatList props:
 * - pagingEnabled={true}
 * - showsVerticalScrollIndicator={false}
 * - decelerationRate="fast"
 */
export function useSnapScroller<T extends UseSnapScrollerItem>({
  items,
  onActiveItemChange,
}: UseSnapScrollerProps<T>): UseSnapScrollerReturn<T> {
  const [activeIndex, setActiveIndex] = useState(0);
  const onActiveItemChangeRef = useRef(onActiveItemChange);
  const listRef = useRef<{
    scrollToIndex: (params: { index: number; animated: boolean }) => void;
  } | null>(null);

  const handleViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: Array<{ index: number | null; item: T }> }) => {
      const first = viewableItems[0];
      if (first?.index !== null && first?.index !== undefined) {
        setActiveIndex(first.index);
        const item = items[first.index];
        if (item !== undefined) {
          onActiveItemChangeRef.current?.(item, first.index);
        }
      }
    },
    [items],
  );

  const scrollToIndex = useCallback((index: number) => {
    listRef.current?.scrollToIndex({ index, animated: true });
  }, []);

  return {
    activeIndex,
    activeItem: items[activeIndex] ?? null,
    handleViewableItemsChanged,
    viewabilityConfig: { itemVisiblePercentThreshold: 50 },
    scrollToIndex,
    listRef,
  };
}
