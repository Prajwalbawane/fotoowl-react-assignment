/**
 * @headless-media/ui-react
 *
 * Headless React UI components for media display.
 *
 * KEY CONTRACT: This package imports NOTHING from @headless-media/core or
 * @headless-media/react. Components receive all data via props and callbacks.
 * They know nothing about Pexels, the SDK, or any data fetching layer.
 *
 * Headless pattern: Every component exports a hook (useGrid, useLightbox,
 * useReelSwiper) that returns prop-getters. Consumers spread these onto their
 * own markup and supply all styling.
 */

// Hooks (primary API)
export { useGrid } from './hooks/useGrid.js';
export { useLightbox } from './hooks/useLightbox.js';
export { useReelSwiper } from './hooks/useReelSwiper.js';

// Types
export type { UseGridProps, UseGridReturn, UseGridItem } from './hooks/useGrid.js';
export type { UseLightboxProps, UseLightboxReturn } from './hooks/useLightbox.js';
export type {
  UseReelSwiperProps,
  UseReelSwiperReturn,
  UseReelSwiperItem,
} from './hooks/useReelSwiper.js';
