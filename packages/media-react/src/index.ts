/**
 * @headless-media/react
 *
 * React wrapper for @headless-media/core.
 * Provides a Provider, Context, and ergonomic hooks.
 * Contains NO business logic — only adapts media-core to React idioms.
 *
 * @example
 * ```tsx
 * import { MediaProvider, useSearch, useViewer } from '@headless-media/react';
 *
 * function App() {
 *   return (
 *     <MediaProvider apiKey={import.meta.env.VITE_PEXELS_API_KEY}>
 *       <Gallery />
 *     </MediaProvider>
 *   );
 * }
 * ```
 */

// Provider
export { MediaProvider } from './provider/MediaProvider.js';

// Hooks
export { useSearch } from './hooks/useSearch.js';
export { useCurated } from './hooks/useCurated.js';
export { useMedia } from './hooks/useMedia.js';
export { useViewer } from './hooks/useViewer.js';
export { useDownload } from './hooks/useDownload.js';
export { useSDKEvent, useSDKEvents } from './hooks/useSDKEvents.js';

// Internal / Advanced
export { MediaContext, useSDK } from './context/MediaContext.js';
