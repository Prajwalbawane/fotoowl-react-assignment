import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useGrid } from '../hooks/useGrid.js';

// IntersectionObserver is not available in jsdom — mock it
const mockObserve = vi.fn();
const mockDisconnect = vi.fn();
const mockUnobserve = vi.fn();

vi.stubGlobal(
  'IntersectionObserver',
  vi.fn().mockImplementation((callback: IntersectionObserverCallback) => ({
    observe: (el: Element) => {
      mockObserve(el);
      // Simulate immediate intersection for testing
      callback(
        [{ isIntersecting: true, intersectionRatio: 1, target: el } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      );
    },
    disconnect: mockDisconnect,
    unobserve: mockUnobserve,
  })),
);

describe('useGrid', () => {
  const makeItems = (count: number) =>
    Array.from({ length: count }, (_, i) => ({ id: i, label: `Item ${i}` }));

  beforeEach(() => {
    mockObserve.mockClear();
    mockDisconnect.mockClear();
  });

  it('returns prop-getter functions', () => {
    const { result } = renderHook(() =>
      useGrid({ items: makeItems(5), hasMore: true, isLoading: false, onLoadMore: vi.fn() }),
    );
    expect(typeof result.current.getContainerProps).toBe('function');
    expect(typeof result.current.getItemProps).toBe('function');
    expect(typeof result.current.getSentinelProps).toBe('function');
  });

  it('getContainerProps returns correct ARIA attributes', () => {
    const { result } = renderHook(() =>
      useGrid({ items: makeItems(3), hasMore: false, isLoading: false, onLoadMore: vi.fn() }),
    );
    const props = result.current.getContainerProps();
    expect(props.role).toBe('list');
    expect(props['aria-busy']).toBe(false);
  });

  it('getContainerProps sets aria-busy when loading', () => {
    const { result } = renderHook(() =>
      useGrid({ items: makeItems(3), hasMore: false, isLoading: true, onLoadMore: vi.fn() }),
    );
    expect(result.current.getContainerProps()['aria-busy']).toBe(true);
  });

  it('getItemProps includes data-item-id', () => {
    const { result } = renderHook(() =>
      useGrid({ items: makeItems(3), hasMore: false, isLoading: false, onLoadMore: vi.fn() }),
    );
    const item = { id: 42, label: 'Test' };
    const props = result.current.getItemProps(item);
    expect(props['data-item-id']).toBe(42);
    expect(props.role).toBe('listitem');
  });

  it('calls onLoadMore when sentinel intersects and hasMore=true', () => {
    const onLoadMore = vi.fn();
    const { result } = renderHook(() =>
      useGrid({ items: makeItems(5), hasMore: true, isLoading: false, onLoadMore }),
    );
    const dummyEl = document.createElement('div');
    act(() => {
      result.current.getSentinelProps().ref(dummyEl);
    });
    expect(onLoadMore).toHaveBeenCalled();
  });

  it('does NOT call onLoadMore when hasMore=false', () => {
    const onLoadMore = vi.fn();
    const { result } = renderHook(() =>
      useGrid({ items: makeItems(5), hasMore: false, isLoading: false, onLoadMore }),
    );
    const dummyEl = document.createElement('div');
    act(() => {
      result.current.getSentinelProps().ref(dummyEl);
    });
    expect(onLoadMore).not.toHaveBeenCalled();
  });
});
