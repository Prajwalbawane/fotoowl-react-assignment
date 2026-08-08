import { useState, useCallback } from 'react';

export interface UseListItem {
  id: number | string;
}

export interface UseListProps<T extends UseListItem> {
  items: readonly T[];
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
}

export interface UseListReturn<T extends UseListItem> {
  /** Pass to FlatList's `onEndReached` prop. */
  handleEndReached: () => void;
  /** Pass to FlatList's `onEndReachedThreshold` prop. */
  endReachedThreshold: number;
  /** Pass to FlatList's `keyExtractor` prop. */
  keyExtractor: (item: T) => string;
  /** Active item index (for use with viewable items tracking). */
  activeIndex: number;
  /** Call from FlatList's `onViewableItemsChanged`. */
  handleViewableItemsChanged: (info: { viewableItems: Array<{ index: number | null }> }) => void;
}

/**
 * Native equivalent of useGrid.
 * Designed to work with React Native's FlatList.
 *
 * SCAFFOLD: Prop-getters are callbacks/values to pass directly to FlatList.
 */
export function useList<T extends UseListItem>({
  hasMore,
  isLoading,
  onLoadMore,
}: UseListProps<T>): UseListReturn<T> {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleEndReached = useCallback(() => {
    if (!isLoading && hasMore) {
      onLoadMore();
    }
  }, [isLoading, hasMore, onLoadMore]);

  const keyExtractor = useCallback((item: T) => String(item.id), []);

  const handleViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: Array<{ index: number | null }> }) => {
      const first = viewableItems[0];
      if (first?.index !== null && first?.index !== undefined) {
        setActiveIndex(first.index);
      }
    },
    [],
  );

  return {
    handleEndReached,
    endReachedThreshold: 0.5,
    keyExtractor,
    activeIndex,
    handleViewableItemsChanged,
  };
}
