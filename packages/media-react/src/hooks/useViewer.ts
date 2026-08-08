import { useState, useCallback } from 'react';
import type { Photo, Video } from '@headless-media/core';
import { useSDK } from '../context/MediaContext.js';

type ViewerItem = Photo | Video;

interface UseViewerState {
  isOpen: boolean;
  current: ViewerItem | null;
  currentIndex: number;
  items: readonly ViewerItem[];
}

interface UseViewerActions {
  open: (item: ViewerItem, items?: readonly ViewerItem[], index?: number) => void;
  close: () => void;
  goNext: () => void;
  goPrev: () => void;
}

type UseViewerReturn = UseViewerState & UseViewerActions;

/**
 * Manages lightbox / viewer state — which item is open, navigation between
 * items in a collection.
 *
 * WHY this lives in media-react and not media-ui-react:
 * The viewer state is tied to SDK events — opening an item should emit a
 * `view` event. media-ui-react cannot import media-core/media-react, so the
 * event emission happens here in the hook, and the UI component just receives
 * state + callbacks.
 *
 * @example
 * ```tsx
 * const { open, close, isOpen, current } = useViewer();
 * <button onClick={() => open(photo)}>Open</button>
 * <Lightbox isOpen={isOpen} onClose={close} ... />
 * ```
 */
export function useViewer(): UseViewerReturn {
  const sdk = useSDK();
  const [state, setState] = useState<UseViewerState>({
    isOpen: false,
    current: null,
    currentIndex: 0,
    items: [],
  });

  const open = useCallback(
    (item: ViewerItem, items: readonly ViewerItem[] = [item], index = 0) => {
      setState({ isOpen: true, current: item, currentIndex: index, items });
      // Emit view event when item is opened
      sdk.events.emit('view', {
        mediaId: item.id,
        mediaType: 'src' in item ? 'photo' : 'video',
      });
    },
    [sdk],
  );

  const close = useCallback(() => {
    setState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const goNext = useCallback(() => {
    setState((prev) => {
      const nextIndex = Math.min(prev.currentIndex + 1, prev.items.length - 1);
      const nextItem = prev.items[nextIndex] ?? prev.current;
      if (nextItem && nextIndex !== prev.currentIndex) {
        sdk.events.emit('view', {
          mediaId: nextItem.id,
          mediaType: 'src' in nextItem ? 'photo' : 'video',
        });
      }
      return { ...prev, currentIndex: nextIndex, current: nextItem ?? prev.current };
    });
  }, [sdk]);

  const goPrev = useCallback(() => {
    setState((prev) => {
      const prevIndex = Math.max(prev.currentIndex - 1, 0);
      const prevItem = prev.items[prevIndex] ?? prev.current;
      if (prevItem && prevIndex !== prev.currentIndex) {
        sdk.events.emit('view', {
          mediaId: prevItem.id,
          mediaType: 'src' in prevItem ? 'photo' : 'video',
        });
      }
      return { ...prev, currentIndex: prevIndex, current: prevItem ?? prev.current };
    });
  }, [sdk]);

  return { ...state, open, close, goNext, goPrev };
}
