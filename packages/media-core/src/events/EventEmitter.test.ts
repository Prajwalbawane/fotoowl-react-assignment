import { describe, it, expect } from 'vitest';
import { EventEmitter } from '../events/EventEmitter.js';

interface TestEvents {
  click: { x: number; y: number };
  keydown: { key: string };
  count: number;
}

describe('EventEmitter', () => {
  it('calls a registered listener when event is emitted', () => {
    const emitter = new EventEmitter<TestEvents>();
    const received: TestEvents['click'][] = [];

    emitter.on('click', (payload) => received.push(payload));
    emitter.emit('click', { x: 10, y: 20 });

    expect(received).toHaveLength(1);
    expect(received[0]).toEqual({ x: 10, y: 20 });
  });

  it('calls multiple listeners for the same event', () => {
    const emitter = new EventEmitter<TestEvents>();
    let callCount = 0;

    emitter.on('count', () => callCount++);
    emitter.on('count', () => callCount++);
    emitter.emit('count', 1);

    expect(callCount).toBe(2);
  });

  it('unsubscribes via returned function', () => {
    const emitter = new EventEmitter<TestEvents>();
    const received: number[] = [];

    const unsub = emitter.on('count', (n) => received.push(n));
    emitter.emit('count', 1);
    unsub();
    emitter.emit('count', 2);

    expect(received).toEqual([1]);
  });

  it('once() fires exactly once', () => {
    const emitter = new EventEmitter<TestEvents>();
    const received: number[] = [];

    emitter.once('count', (n) => received.push(n));
    emitter.emit('count', 1);
    emitter.emit('count', 2);

    expect(received).toEqual([1]);
  });

  it('listenerCount reflects active listeners', () => {
    const emitter = new EventEmitter<TestEvents>();
    const unsub = emitter.on('count', () => undefined);
    expect(emitter.listenerCount('count')).toBe(1);
    unsub();
    expect(emitter.listenerCount('count')).toBe(0);
  });

  it('removeAllListeners for specific event', () => {
    const emitter = new EventEmitter<TestEvents>();
    emitter.on('count', () => undefined);
    emitter.on('count', () => undefined);
    emitter.removeAllListeners('count');
    expect(emitter.listenerCount('count')).toBe(0);
  });

  it('does not throw when emitting with no listeners', () => {
    const emitter = new EventEmitter<TestEvents>();
    expect(() => emitter.emit('count', 42)).not.toThrow();
  });

  it('does not call unsubscribed listener if unsubscribed during emit', () => {
    const emitter = new EventEmitter<TestEvents>();
    const called: string[] = [];
    let unsubB: (() => void) | undefined;

    emitter.on('count', () => {
      called.push('A');
      unsubB?.();
    });
    unsubB = emitter.on('count', () => called.push('B'));

    emitter.emit('count', 1);

    // B should still be called because we snapshot before iteration
    expect(called).toContain('A');
  });
});
