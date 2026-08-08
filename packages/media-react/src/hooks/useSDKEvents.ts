import { useEffect, useCallback } from 'react';
import type { SDKEvents, Unsubscribe, EventListener } from '@headless-media/core';
import { useSDK } from '../context/MediaContext.js';

/**
 * Subscribe to SDK events from within a React component.
 *
 * Automatically unsubscribes when the component unmounts or when the
 * event/listener changes.
 *
 * @example
 * ```tsx
 * useSDKEvent('download', ({ mediaId, url }) => {
 *   analytics.track('download', { mediaId, url });
 * });
 * ```
 */
export function useSDKEvent<K extends keyof SDKEvents>(
  event: K,
  listener: EventListener<SDKEvents, K>,
): void {
  const sdk = useSDK();

  useEffect(() => {
    const unsub: Unsubscribe = sdk.events.on(event, listener);
    return unsub;
  }, [sdk, event, listener]);
}

/**
 * Returns stable subscribe/unsubscribe helpers for manual event subscription.
 * Useful when you need to subscribe conditionally or programmatically.
 */
export function useSDKEvents() {
  const sdk = useSDK();

  const subscribe = useCallback(
    <K extends keyof SDKEvents>(event: K, listener: EventListener<SDKEvents, K>): Unsubscribe =>
      sdk.events.on(event, listener),
    [sdk],
  );

  const emit = useCallback(
    <K extends keyof SDKEvents>(event: K, payload: SDKEvents[K]): void =>
      sdk.events.emit(event, payload),
    [sdk],
  );

  return { subscribe, emit };
}
