/**
 * @headless-media/core
 *
 * Framework-agnostic media SDK for the Pexels API.
 * No React, no DOM, no browser-specific globals — runs anywhere.
 *
 * @example
 * ```ts
 * import { createMediaSDK } from '@headless-media/core';
 *
 * const sdk = createMediaSDK({ apiKey: process.env.PEXELS_API_KEY });
 *
 * // Subscribe to events
 * sdk.events.on('view', ({ mediaId, mediaType }) => {
 *   analytics.track('media_view', { mediaId, mediaType });
 * });
 *
 * // Fetch data
 * const photos = await sdk.photos.search({ query: 'mountains', perPage: 20 });
 * ```
 */

// SDK factory + config types
export type { SDKConfig, MediaSDK } from './sdk.js';
export { createMediaSDK } from './sdk.js';

// Domain models
export type {
  Photo,
  PhotoSrc,
  Video,
  VideoFile,
  VideoPicture,
  VideoUser,
  PaginationParams,
  SearchParams,
  PaginatedResponse,
} from './models/index.js';
export { getPhotoAspectRatio, getBestVideoFile, hasNextPage, totalPages } from './models/index.js';

// Service interfaces (for typing in wrappers and tests)
export type { PhotoServiceInterface } from './api/PhotoService.js';
export type { VideoServiceInterface } from './api/VideoService.js';

// Events
export type { SDKEvents, SDKEventEmitter, Unsubscribe, EventListener } from './events/index.js';
export { EventEmitter } from './events/EventEmitter.js';

// Errors (consumers may need instanceof checks)
export {
  MediaSDKError,
  ApiError,
  NetworkError,
  AuthError,
  RateLimitError,
  TimeoutError,
  ParseError,
} from './errors/index.js';

// HTTP (exposed for advanced use cases like custom fetch interceptors)
export type { HttpClientConfig, HttpResponse } from './http/index.js';
