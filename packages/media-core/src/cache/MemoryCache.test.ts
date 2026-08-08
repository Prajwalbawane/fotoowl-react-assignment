import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MemoryCache } from '../cache/MemoryCache.js';

describe('MemoryCache', () => {
  let cache: MemoryCache<string>;

  beforeEach(() => {
    cache = new MemoryCache<string>(1000); // 1s TTL
  });

  it('stores and retrieves a value', () => {
    cache.set('key', 'value');
    expect(cache.get('key')).toBe('value');
  });

  it('returns undefined for a missing key', () => {
    expect(cache.get('nonexistent')).toBeUndefined();
  });

  it('returns undefined after TTL expires', () => {
    vi.useFakeTimers();
    cache.set('key', 'value');
    vi.advanceTimersByTime(1001);
    expect(cache.get('key')).toBeUndefined();
    vi.useRealTimers();
  });

  it('reports size correctly', () => {
    cache.set('a', 'x');
    cache.set('b', 'y');
    expect(cache.size).toBe(2);
  });

  it('has() returns false for expired entries', () => {
    vi.useFakeTimers();
    cache.set('key', 'value');
    vi.advanceTimersByTime(2000);
    expect(cache.has('key')).toBe(false);
    vi.useRealTimers();
  });

  it('deletes a specific key', () => {
    cache.set('key', 'value');
    cache.delete('key');
    expect(cache.get('key')).toBeUndefined();
  });

  it('clears all entries', () => {
    cache.set('a', '1');
    cache.set('b', '2');
    cache.clear();
    expect(cache.size).toBe(0);
  });

  it('evicts expired entries', () => {
    vi.useFakeTimers();
    cache.set('a', '1');
    vi.advanceTimersByTime(500);
    cache.set('b', '2');
    vi.advanceTimersByTime(600); // 'a' is now expired, 'b' is not
    cache.evictExpired();
    expect(cache.size).toBe(1);
    expect(cache.get('b')).toBe('2');
    vi.useRealTimers();
  });

  it('respects per-entry TTL override', () => {
    vi.useFakeTimers();
    cache.set('short', 'x', 100);
    cache.set('long', 'y', 2000);
    vi.advanceTimersByTime(500);
    expect(cache.get('short')).toBeUndefined();
    expect(cache.get('long')).toBe('y');
    vi.useRealTimers();
  });
});
