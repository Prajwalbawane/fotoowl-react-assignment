import type { EventEmitter } from './EventEmitter.js';

/**
 * The SDK's event payload map.
 *
 * Every event the SDK can emit is described here. Adding a new event type
 * requires a change here and the TypeScript compiler will enforce correct
 * usage everywhere.
 */
export interface SDKEvents {
  /** Fired when a user initiates a download. */
  download: {
    readonly mediaId: number;
    readonly mediaType: 'photo' | 'video';
    readonly url: string;
  };
  /** Fired when a media item enters the viewport / is opened in the viewer. */
  view: {
    readonly mediaId: number;
    readonly mediaType: 'photo' | 'video';
  };
  /** Fired when the SDK encounters a recoverable or non-recoverable error. */
  error: {
    readonly code: string;
    readonly message: string;
    readonly cause?: unknown;
  };
}

export type { EventEmitter, EventMap, EventListener, Unsubscribe } from './EventEmitter.js';
export { EventEmitter as TypedEventEmitter } from './EventEmitter.js';

/** Convenience alias for the SDK's concrete event emitter type. */
export type SDKEventEmitter = EventEmitter<SDKEvents>;
