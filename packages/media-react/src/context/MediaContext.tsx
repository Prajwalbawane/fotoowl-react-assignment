import { createContext, useContext } from 'react';
import type { MediaSDK } from '@headless-media/core';

/**
 * The React context that holds the SDK instance.
 *
 * WHY undefined default: We want to detect when a hook is used outside of
 * MediaProvider. An undefined default + guard in useSDK() gives a clear error
 * message instead of a cryptic "cannot read property of undefined".
 */
export const MediaContext = createContext<MediaSDK | undefined>(undefined);

/**
 * Internal hook to access the SDK instance from context.
 * Throws a descriptive error if called outside a MediaProvider.
 */
export function useSDK(): MediaSDK {
  const sdk = useContext(MediaContext);
  if (sdk === undefined) {
    throw new Error(
      '[media-react] useSDK() was called outside of <MediaProvider>. ' +
        'Wrap your component tree with <MediaProvider apiKey="..." />.',
    );
  }
  return sdk;
}
