/**
 * Deduplicates concurrent in-flight requests for the same key.
 *
 * WHY: If the user triggers two identical searches before the first resolves
 * (e.g. rapid typing), this prevents two identical network requests. Unlike
 * the cache, this only deduplicates *ongoing* requests — once a request
 * settles, it is removed and the result is owned by the cache layer.
 *
 * This is separate from MemoryCache intentionally:
 * - Cache: stores *results* across time
 * - Deduplicator: prevents duplicate *in-flight* requests
 */
export class RequestDeduplicator {
  private readonly inflight = new Map<string, Promise<unknown>>();

  /**
   * Returns the existing in-flight promise if one exists for `key`,
   * otherwise executes `factory` and tracks its promise.
   */
  dedupe<T>(key: string, factory: () => Promise<T>): Promise<T> {
    const existing = this.inflight.get(key);
    if (existing !== undefined) {
      return existing as Promise<T>;
    }

    const promise = factory().finally(() => {
      this.inflight.delete(key);
    });

    this.inflight.set(key, promise);
    return promise;
  }

  /** Returns true if a request for the given key is currently in flight. */
  isPending(key: string): boolean {
    return this.inflight.has(key);
  }

  get pendingCount(): number {
    return this.inflight.size;
  }
}
