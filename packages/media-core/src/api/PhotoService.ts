import type { PexelsApiClient } from './PexelsApiClient.js';
import type { MemoryCache } from '../cache/MemoryCache.js';
import type { RequestDeduplicator } from '../cache/RequestDeduplicator.js';
import type { Photo, PaginatedResponse, SearchParams, PaginationParams } from '../models/index.js';

/**
 * Service interface for photo operations.
 *
 * WHY an interface: Consumers and tests code to the interface, not the
 * implementation. This also documents the public contract clearly.
 */
export interface PhotoServiceInterface {
  search(params: SearchParams): Promise<PaginatedResponse<Photo>>;
  getCurated(params?: PaginationParams): Promise<PaginatedResponse<Photo>>;
  getById(id: number): Promise<Photo>;
}

export class PhotoService implements PhotoServiceInterface {
  constructor(
    private readonly client: PexelsApiClient,
    private readonly cache: MemoryCache<PaginatedResponse<Photo>>,
    private readonly deduplicator: RequestDeduplicator,
    private readonly singleCache: MemoryCache<Photo>,
  ) {}

  search(params: SearchParams): Promise<PaginatedResponse<Photo>> {
    const key = `photo:search:${JSON.stringify(params)}`;
    const cached = this.cache.get(key);
    if (cached !== undefined) return Promise.resolve(cached);

    return this.deduplicator.dedupe(key, async () => {
      const result = await this.client.searchPhotos(params);
      this.cache.set(key, result);
      return result;
    });
  }

  getCurated(params?: PaginationParams): Promise<PaginatedResponse<Photo>> {
    const key = `photo:curated:${JSON.stringify(params ?? {})}`;
    const cached = this.cache.get(key);
    if (cached !== undefined) return Promise.resolve(cached);

    return this.deduplicator.dedupe(key, async () => {
      const result = await this.client.getCuratedPhotos(params);
      this.cache.set(key, result);
      return result;
    });
  }

  getById(id: number): Promise<Photo> {
    const key = `photo:id:${id}`;
    const cached = this.singleCache.get(key);
    if (cached !== undefined) return Promise.resolve(cached);

    return this.deduplicator.dedupe(key, async () => {
      const result = await this.client.getPhotoById(id);
      this.singleCache.set(key, result);
      return result;
    });
  }
}
