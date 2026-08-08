/**
 * Smoke tests for @headless-media/react public API surface.
 *
 * These tests verify that all public exports exist and have the correct type
 * (function/object). Business logic is tested in @headless-media/core.
 * Hook behavior would be tested with @testing-library/react in a full suite.
 */
import { describe, it, expect } from 'vitest';

describe('@headless-media/react exports', () => {
  it('exports MediaProvider', async () => {
    const { MediaProvider } = await import('./provider/MediaProvider.js');
    expect(typeof MediaProvider).toBe('function');
  });

  it('exports useSearch', async () => {
    const { useSearch } = await import('./hooks/useSearch.js');
    expect(typeof useSearch).toBe('function');
  });

  it('exports useCurated', async () => {
    const { useCurated } = await import('./hooks/useCurated.js');
    expect(typeof useCurated).toBe('function');
  });

  it('exports useViewer', async () => {
    const { useViewer } = await import('./hooks/useViewer.js');
    expect(typeof useViewer).toBe('function');
  });

  it('exports useDownload', async () => {
    const { useDownload } = await import('./hooks/useDownload.js');
    expect(typeof useDownload).toBe('function');
  });

  it('exports useSDKEvent and useSDKEvents', async () => {
    const { useSDKEvent, useSDKEvents } = await import('./hooks/useSDKEvents.js');
    expect(typeof useSDKEvent).toBe('function');
    expect(typeof useSDKEvents).toBe('function');
  });

  it('exports MediaContext and useSDK', async () => {
    const { MediaContext, useSDK } = await import('./context/MediaContext.js');
    // MediaContext is a React context object; useSDK is a function
    expect(MediaContext).toBeDefined();
    expect(typeof useSDK).toBe('function');
  });
});
