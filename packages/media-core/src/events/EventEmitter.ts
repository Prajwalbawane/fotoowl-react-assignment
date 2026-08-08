/**
 * A typed, generic event emitter.
 *
 * WHY typed events: Using a generic `EventMap` ensures callers cannot emit or
 * subscribe to events with the wrong payload shape. This catches misuse at
 * compile time rather than runtime.
 *
 * WHY not Node.js EventEmitter: This must run anywhere (browser, Node, RN,
 * edge). Node's EventEmitter would make media-core Node-only.
 *
 * WHY not a simple object of arrays: The class encapsulates the full
 * subscribe/unsubscribe lifecycle and provides a clean `Unsubscribe` primitive
 * that prevents listener leaks.
 */
export type EventMap = Record<string, any>;

/** A function that unsubscribes a previously registered listener. */
export type Unsubscribe = () => void;

/** A listener function for event `K` in the given `TEvents` map. */
export type EventListener<TEvents extends EventMap, K extends keyof TEvents> = (
  payload: TEvents[K],
) => void;

export class EventEmitter<TEvents extends EventMap> {
  private readonly listeners = new Map<keyof TEvents, Set<EventListener<TEvents, keyof TEvents>>>();

  /**
   * Subscribes to an event. Returns an `Unsubscribe` function.
   *
   * @example
   * const unsub = emitter.on('download', (payload) => console.log(payload));
   * // Later:
   * unsub();
   */
  on<K extends keyof TEvents>(event: K, listener: EventListener<TEvents, K>): Unsubscribe {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }

    const set = this.listeners.get(event)!;
    // Cast: TypeScript cannot narrow the Set<> type through Map<> generics here
    set.add(listener as EventListener<TEvents, keyof TEvents>);

    return () => {
      set.delete(listener as EventListener<TEvents, keyof TEvents>);
      if (set.size === 0) {
        this.listeners.delete(event);
      }
    };
  }

  /**
   * Subscribes to an event for a single emission, then auto-unsubscribes.
   */
  once<K extends keyof TEvents>(event: K, listener: EventListener<TEvents, K>): Unsubscribe {
    const unsub = this.on(event, (payload) => {
      unsub();
      listener(payload as TEvents[K]);
    });
    return unsub;
  }

  /**
   * Emits an event with the given payload. All registered listeners are called
   * synchronously in the order they were registered.
   */
  emit<K extends keyof TEvents>(event: K, payload: TEvents[K]): void {
    const set = this.listeners.get(event);
    if (set === undefined) return;

    // Snapshot before iteration in case a listener unsubscribes during emit
    for (const listener of [...set]) {
      (listener as EventListener<TEvents, K>)(payload);
    }
  }

  /**
   * Removes all listeners for a specific event, or all events if omitted.
   */
  removeAllListeners(event?: keyof TEvents): void {
    if (event !== undefined) {
      this.listeners.delete(event);
    } else {
      this.listeners.clear();
    }
  }

  /** Returns the number of listeners for a given event. */
  listenerCount(event: keyof TEvents): number {
    return this.listeners.get(event)?.size ?? 0;
  }
}
