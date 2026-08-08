import { HttpClient } from './http/HttpClient.js';
import { MemoryCache } from './cache/MemoryCache.js';
import { RequestDeduplicator } from './cache/RequestDeduplicator.js';
import { EventEmitter } from './events/EventEmitter.js';
import { PexelsApiClient } from './api/PexelsApiClient.js';
import { PhotoService } from './api/PhotoService.js';
import { VideoService } from './api/VideoService.js';
import type { PhotoServiceInterface } from './api/PhotoService.js';
import type { VideoServiceInterface } from './api/VideoService.js';
import type { SDKEvents } from './events/index.js';
import type { Photo, Video, PaginatedResponse } from './models/index.js';

export interface SDKConfig {
  /** Your Pexels API key. Get one free at https://www.pexels.com/api/ */
  readonly apiKey: string;
  /**
   * Override the Pexels base URL. Useful for testing or proxying.
   * @default "https://api.pexels.com"
   */
  readonly baseUrl?: string;
  /**
   * Cache TTL in milliseconds for list responses.
   * @default 300_000 (5 minutes)
   */
  readonly cacheTtlMs?: number;
  /**
   * Request timeout in milliseconds.
   * @default 10_000 (10 seconds)
   */
  readonly timeoutMs?: number;
  /**
   * Whether to enable the default console logger for SDK events.
   * @default true
   */
  readonly enableDefaultLogger?: boolean;
}

export interface MediaSDK {
  /** Photo search, curated feed, and single-item fetch. */
  readonly photos: PhotoServiceInterface;
  /** Video search, popular feed, and single-item fetch. */
  readonly videos: VideoServiceInterface;
  /**
   * Typed event emitter. Subscribe to `download` and `view` events to track
   * user activity. Emit `download` and `view` from your UI layer.
   */
  readonly events: EventEmitter<SDKEvents>;
  /**
   * Clears the internal caches. Call when the user logs out or you want
   * to force a refresh.
   */
  clearCache(): void;
}

/**
 * Attaches the default console logger to the event emitter.
 *
 * WHY default logger: The assignment requires "a default listener logs each
 * event to the console". Having it enabled by default provides value out of
 * the box while remaining overrideable.
 */
function attachDefaultLogger(events: EventEmitter<SDKEvents>): void {
  events.on('view', (payload) => {
    console.info(`[MediaSDK] view`, payload);
  });
  events.on('download', (payload) => {
    console.info(`[MediaSDK] download`, payload);
  });
  events.on('error', (payload) => {
    console.error(`[MediaSDK] error`, payload);
  });
}

/**
 * Creates and returns a fully configured MediaSDK instance.
 *
 * This is the only public factory. All internal wiring (HTTP client, caches,
 * deduplicator, services) is hidden from consumers.
 *
 * @example
 * ```ts
 * const sdk = createMediaSDK({ apiKey: 'your-key' });
 * const photos = await sdk.photos.getCurated({ perPage: 20 });
 * ```
 */
export function createMediaSDK(config: SDKConfig): MediaSDK {
  const {
    apiKey,
    baseUrl = 'https://api.pexels.com',
    cacheTtlMs = 300_000,
    timeoutMs = 10_000,
    enableDefaultLogger = true,
  } = config;

  const http = new HttpClient({ baseUrl, apiKey, timeoutMs });
  const pexelsClient = new PexelsApiClient(http);
  const deduplicator = new RequestDeduplicator();
  const events = new EventEmitter<SDKEvents>();

  const photoListCache = new MemoryCache<PaginatedResponse<Photo>>(cacheTtlMs);
  const photoSingleCache = new MemoryCache<Photo>(cacheTtlMs);
  const videoListCache = new MemoryCache<PaginatedResponse<Video>>(cacheTtlMs);
  const videoSingleCache = new MemoryCache<Video>(cacheTtlMs);

  const photos = new PhotoService(pexelsClient, photoListCache, deduplicator, photoSingleCache);
  const videos = new VideoService(pexelsClient, videoListCache, deduplicator, videoSingleCache);

  if (enableDefaultLogger) {
    attachDefaultLogger(events);
  }

  return {
    photos,
    videos,
    events,
    clearCache() {
      photoListCache.clear();
      photoSingleCache.clear();
      videoListCache.clear();
      videoSingleCache.clear();
    },
  };
}
