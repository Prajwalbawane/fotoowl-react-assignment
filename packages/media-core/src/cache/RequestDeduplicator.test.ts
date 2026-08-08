import { describe, it, expect, vi } from 'vitest';
import { RequestDeduplicator } from '../cache/RequestDeduplicator.js';

describe('RequestDeduplicator', () => {
  it('calls factory only once for concurrent identical keys', async () => {
    const deduplicator = new RequestDeduplicator();
    const factory = vi.fn(async () => 'result');

    const [r1, r2, r3] = await Promise.all([
      deduplicator.dedupe('key', factory),
      deduplicator.dedupe('key', factory),
      deduplicator.dedupe('key', factory),
    ]);

    expect(factory).toHaveBeenCalledTimes(1);
    expect(r1).toBe('result');
    expect(r2).toBe('result');
    expect(r3).toBe('result');
  });

  it('calls factory again after the first resolves', async () => {
    const deduplicator = new RequestDeduplicator();
    const factory = vi.fn(async () => 'result');

    await deduplicator.dedupe('key', factory);
    await deduplicator.dedupe('key', factory);

    expect(factory).toHaveBeenCalledTimes(2);
  });

  it('isPending returns true while in flight', () => {
    const deduplicator = new RequestDeduplicator();
    let resolve!: () => void;
    const factory = () =>
      new Promise<string>((res) => {
        resolve = () => res('done');
      });

    deduplicator.dedupe('key', factory);
    expect(deduplicator.isPending('key')).toBe(true);
    resolve();
  });

  it('isPending returns false after resolution', async () => {
    const deduplicator = new RequestDeduplicator();
    const factory = async () => 'done';

    await deduplicator.dedupe('key', factory);
    expect(deduplicator.isPending('key')).toBe(false);
  });

  it('handles different keys independently', async () => {
    const deduplicator = new RequestDeduplicator();
    const factoryA = vi.fn(async () => 'a');
    const factoryB = vi.fn(async () => 'b');

    const [a, b] = await Promise.all([
      deduplicator.dedupe('keyA', factoryA),
      deduplicator.dedupe('keyB', factoryB),
    ]);

    expect(a).toBe('a');
    expect(b).toBe('b');
    expect(factoryA).toHaveBeenCalledTimes(1);
    expect(factoryB).toHaveBeenCalledTimes(1);
  });

  it('propagates rejection to all concurrent callers', async () => {
    const deduplicator = new RequestDeduplicator();
    const factory = vi.fn(async (): Promise<string> => {
      throw new Error('fetch failed');
    });

    const [p1, p2] = [deduplicator.dedupe('key', factory), deduplicator.dedupe('key', factory)];

    await expect(p1).rejects.toThrow('fetch failed');
    await expect(p2).rejects.toThrow('fetch failed');
    expect(factory).toHaveBeenCalledTimes(1);
  });
});
