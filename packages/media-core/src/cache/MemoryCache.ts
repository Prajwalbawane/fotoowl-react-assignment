/**
 * A typed, generic in-memory cache with TTL-based expiry.
 *
 * WHY: A dedicated cache class keeps caching concerns isolated from the HTTP
 * layer. TTL is checked lazily on read (no timers), keeping the implementation
 * simple and free of side effects.
 */
export interface CacheEntry<T> {
  readonly value: T;
  readonly expiresAt: number;
}

export class MemoryCache<T> {
  private readonly store = new Map<string, CacheEntry<T>>();

  constructor(private readonly defaultTtlMs: number) {}

  set(key: string, value: T, ttlMs?: number): void {
    const ttl = ttlMs ?? this.defaultTtlMs;
    this.store.set(key, {
      value,
      expiresAt: Date.now() + ttl,
    });
  }

  get(key: string): T | undefined {
    const entry = this.store.get(key);
    if (entry === undefined) return undefined;

    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return undefined;
    }

    return entry.value;
  }

  has(key: string): boolean {
    return this.get(key) !== undefined;
  }

  delete(key: string): void {
    this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }

  /** Removes all expired entries. Useful for periodic housekeeping. */
  evictExpired(): void {
    const now = Date.now();
    for (const [key, entry] of this.store) {
      if (now > entry.expiresAt) {
        this.store.delete(key);
      }
    }
  }

  get size(): number {
    return this.store.size;
  }
}
