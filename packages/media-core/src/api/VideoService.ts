import type { PexelsApiClient } from './PexelsApiClient.js';
import type { MemoryCache } from '../cache/MemoryCache.js';
import type { RequestDeduplicator } from '../cache/RequestDeduplicator.js';
import type { Video, PaginatedResponse, SearchParams, PaginationParams } from '../models/index.js';

export interface VideoServiceInterface {
  search(params: SearchParams): Promise<PaginatedResponse<Video>>;
  getPopular(params?: PaginationParams): Promise<PaginatedResponse<Video>>;
  getById(id: number): Promise<Video>;
}

export class VideoService implements VideoServiceInterface {
  constructor(
    private readonly client: PexelsApiClient,
    private readonly cache: MemoryCache<PaginatedResponse<Video>>,
    private readonly deduplicator: RequestDeduplicator,
    private readonly singleCache: MemoryCache<Video>,
  ) {}

  search(params: SearchParams): Promise<PaginatedResponse<Video>> {
    const key = `video:search:${JSON.stringify(params)}`;
    const cached = this.cache.get(key);
    if (cached !== undefined) return Promise.resolve(cached);

    return this.deduplicator.dedupe(key, async () => {
      const result = await this.client.searchVideos(params);
      this.cache.set(key, result);
      return result;
    });
  }

  getPopular(params?: PaginationParams): Promise<PaginatedResponse<Video>> {
    const key = `video:popular:${JSON.stringify(params ?? {})}`;
    const cached = this.cache.get(key);
    if (cached !== undefined) return Promise.resolve(cached);

    return this.deduplicator.dedupe(key, async () => {
      const result = await this.client.getPopularVideos(params);
      this.cache.set(key, result);
      return result;
    });
  }

  getById(id: number): Promise<Video> {
    const key = `video:id:${id}`;
    const cached = this.singleCache.get(key);
    if (cached !== undefined) return Promise.resolve(cached);

    return this.deduplicator.dedupe(key, async () => {
      const result = await this.client.getVideoById(id);
      this.singleCache.set(key, result);
      return result;
    });
  }
}
