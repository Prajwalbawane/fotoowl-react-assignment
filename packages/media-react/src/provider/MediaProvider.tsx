import { useMemo, type ReactNode } from 'react';
import { createMediaSDK, type SDKConfig } from '@headless-media/core';
import { MediaContext } from '../context/MediaContext.js';

interface MediaProviderProps extends SDKConfig {
  children: ReactNode;
}

/**
 * Provides the MediaSDK instance to the component tree.
 *
 * The SDK is created once per mount via `useMemo`. Since `SDKConfig` contains
 * only primitives, the memo dependency array is stable across re-renders unless
 * the config genuinely changes.
 *
 * WHY useMemo over useRef: useMemo's dependency array documents *which* config
 * changes should rebuild the SDK (e.g. if the API key rotates). useRef would
 * silently ignore config changes.
 *
 * @example
 * ```tsx
 * <MediaProvider apiKey={import.meta.env.VITE_PEXELS_API_KEY}>
 *   <App />
 * </MediaProvider>
 * ```
 */
export function MediaProvider({ children, ...config }: MediaProviderProps) {
  const sdk = useMemo(
    () => createMediaSDK(config),
    [config.apiKey, config.baseUrl, config.cacheTtlMs, config.timeoutMs],
  );

  return <MediaContext.Provider value={sdk}>{children}</MediaContext.Provider>;
}
