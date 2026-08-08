/**
 * @headless-media/native
 *
 * React Native wrapper for @headless-media/core.
 *
 * STATUS: Scaffold — full hook API surface is defined (same contract as
 * @headless-media/react) but implemented as thin re-exports. A production
 * implementation would adapt lifecycle hooks to React Native idioms
 * (e.g. AppState for focus/blur, NetInfo for connectivity).
 *
 * The API is intentionally identical to @headless-media/react so that
 * shared logic (screens, business rules) can consume either package
 * without modification.
 */

// Provider
export { MediaProvider } from './provider/MediaProvider.js';

// Hooks — same surface as @headless-media/react
export { useSearch } from './hooks/useSearch.js';
export { useCurated } from './hooks/useCurated.js';
export { useMedia } from './hooks/useMedia.js';
export { useViewer } from './hooks/useViewer.js';
export { useDownload } from './hooks/useDownload.js';
export { useSDKEvent, useSDKEvents } from './hooks/useSDKEvents.js';
export { useSDK } from './context/MediaContext.js';
