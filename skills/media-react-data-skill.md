---
name: media-react-data-skill
description: >
  Teaches AI coding agents how to wire @headless-media/react for data fetching,
  authentication, event subscription, and state management in a React application.
  Use this skill when building any UI that consumes the Headless Media SDK.
---

# Skill: Wiring Data with @headless-media/react

## When to use this skill

Use when you need to:

- Set up the SDK with authentication
- Fetch photos or videos (search, curated/popular feeds, single items)
- Implement infinite scroll
- Subscribe to SDK events (view, download)
- Manage lightbox/viewer state with event emission

## Package contract

```
@headless-media/react ONLY imports from:
- @headless-media/core (for SDK types and factory)
- react (peer dependency)

It NEVER contains:
- UI rendering
- CSS or styles
- Business logic
- Direct API calls (those are in media-core)
```

---

## Step 1: Installation and Provider Setup

```tsx
// apps/web/src/main.tsx
import { MediaProvider } from '@headless-media/react';

// ALWAYS wrap the entire app — Provider creates one SDK instance
createRoot(root).render(
  <MediaProvider apiKey={import.meta.env.VITE_PEXELS_API_KEY}>
    <App />
  </MediaProvider>,
);
```

**Rules:**

- One `<MediaProvider>` per app, at the root level
- `apiKey` is required — throws at runtime if missing
- Optional props: `baseUrl`, `cacheTtlMs` (default 5min), `timeoutMs` (default 10s)
- The SDK instance is memoized — config changes rebuild the SDK

---

## Step 2: Searching for Photos

```tsx
import { useSearch } from '@headless-media/react';

function SearchResults() {
  const { query, setQuery, results, isLoading, error, hasMore, fetchMore } = useSearch('photos');

  // setQuery triggers a fresh search (resets page to 1)
  // fetchMore appends the next page
  // results is a flat array of ALL loaded pages

  return (
    <>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search photos..."
      />
      {/* Render results, call fetchMore when user scrolls to bottom */}
    </>
  );
}
```

**Type signature:**

```ts
useSearch<T extends 'photos' | 'videos'>(
  type: T,
  defaultParams?: Omit<SearchParams, 'query'>
): {
  query: string;
  results: readonly (T extends 'photos' ? Photo : Video)[];
  isLoading: boolean;
  error: Error | null;
  hasMore: boolean;
  totalResults: number;
  setQuery: (query: string) => void;
  fetchMore: () => Promise<void>;
  reset: () => void;
}
```

**Important behaviors:**

- `setQuery('')` does nothing — empty query is a no-op
- `reset()` clears results and resets the page counter
- Results **accumulate** across pages — do NOT replace them
- `fetchMore()` is idempotent when `!hasMore` or `isLoading`

---

## Step 3: Curated/Popular Feed

```tsx
import { useEffect } from 'react';
import { useCurated } from '@headless-media/react';

function CuratedGallery() {
  const { results, isLoading, error, hasMore, fetchMore, refresh } = useCurated('photos', {
    perPage: 20,
  });

  // MUST call refresh() manually on mount — useCurated does NOT auto-fetch
  useEffect(() => {
    void refresh();
  }, [refresh]);

  return <>{/* render results */}</>;
}
```

**Rules:**

- `useCurated('photos')` → Pexels curated endpoint
- `useCurated('videos')` → Pexels popular videos endpoint
- Always wrap `refresh()` and `fetchMore()` calls in `void` or `.catch()`
- `refresh` reference is stable — safe to use as useEffect dependency

---

## Step 4: Viewer State (Lightbox)

```tsx
import { useViewer } from '@headless-media/react';

function Gallery({ photos }: { photos: Photo[] }) {
  const { isOpen, current, currentIndex, open, close, goNext, goPrev } = useViewer();

  return (
    <>
      {photos.map((photo, index) => (
        <button key={photo.id} onClick={() => open(photo, photos, index)}>
          <img src={photo.src.medium} alt={photo.alt} />
        </button>
      ))}

      {/* Pass state to any UI component — it needs no SDK knowledge */}
      <MyLightboxUI
        isOpen={isOpen}
        photo={current}
        onClose={close}
        onNext={goNext}
        onPrev={goPrev}
        hasNext={currentIndex < photos.length - 1}
        hasPrev={currentIndex > 0}
      />
    </>
  );
}
```

**IMPORTANT:** `open(item, items, index)` automatically emits a `view` SDK event.
You do NOT need to emit it manually.

---

## Step 5: Download with Event Emission

```tsx
import { useDownload } from '@headless-media/react';

function DownloadButton({ photo }: { photo: Photo }) {
  const { download, isDownloading } = useDownload();

  return (
    <button
      onClick={() => void download(photo.src.original, photo.id, 'photo')}
      disabled={isDownloading}
    >
      {isDownloading ? 'Downloading...' : 'Download'}
    </button>
  );
}
```

**IMPORTANT:** `download()` automatically emits a `download` SDK event.

---

## Step 6: Subscribing to SDK Events

```tsx
import { useSDKEvent, useSDKEvents } from '@headless-media/react';

// Option A: useSDKEvent — declarative, auto-cleans up on unmount
function ActivityLogger() {
  useSDKEvent('view', ({ mediaId, mediaType }) => {
    console.log(`Viewed ${mediaType} #${mediaId}`);
  });

  useSDKEvent('download', ({ mediaId, url }) => {
    analytics.track('download', { mediaId, url });
  });

  return null;
}

// Option B: useSDKEvents — imperative, useful for conditional subscriptions
function ConditionalLogger() {
  const { subscribe } = useSDKEvents();

  useEffect(() => {
    if (!isAnalyticsEnabled) return;
    const unsub = subscribe('view', (payload) => analytics.track('view', payload));
    return unsub; // Unsubscribes on unmount or when isAnalyticsEnabled changes
  }, [subscribe, isAnalyticsEnabled]);
}
```

---

## Error Handling Pattern

All hooks expose `error: Error | null`. The error is always an instance of a
class from `@headless-media/core`:

```ts
import { AuthError, RateLimitError, NetworkError, ApiError } from '@headless-media/core';

if (error instanceof AuthError) {
  // Show "Invalid API key" UI
} else if (error instanceof RateLimitError) {
  // Show "Too many requests, retry in Xs" UI
  console.log(error.retryAfterSeconds);
} else if (error instanceof NetworkError) {
  // Show offline/connectivity UI
} else if (error instanceof ApiError) {
  // Show generic API error with error.statusCode
}
```

---

## Common Mistakes to Avoid

```tsx
// ❌ WRONG: Using hooks outside MediaProvider
function App() {
  const { results } = useSearch('photos'); // throws: "called outside MediaProvider"
  return <MediaProvider ...><Gallery /></MediaProvider>;
}

// ✅ CORRECT: Hooks inside the tree
function App() {
  return <MediaProvider ...><Gallery /></MediaProvider>;
}
function Gallery() {
  const { results } = useSearch('photos'); // works
}

// ❌ WRONG: Not calling refresh() for useCurated
function Feed() {
  const { results } = useCurated('photos'); // results will be empty forever
}

// ✅ CORRECT
function Feed() {
  const { results, refresh } = useCurated('photos');
  useEffect(() => { void refresh(); }, [refresh]);
}

// ❌ WRONG: Calling fetchMore when not needed
function Grid() {
  const { fetchMore, isLoading, hasMore } = useSearch('photos');
  // This will fire duplicate requests
  fetchMore(); // missing guard
}

// ✅ CORRECT: Check both guards
const handleLoadMore = () => {
  if (!isLoading && hasMore) void fetchMore();
};
```
