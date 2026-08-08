# Architecture

## Dependency Graph

```
apps/web
  ├── @headless-media/react        # Data layer
  │     └── @headless-media/core   # Pure TS SDK (zero deps)
  └── @headless-media/ui-react     # Headless UI (zero SDK coupling)

apps/native (scaffold)
  ├── @headless-media/native
  │     └── @headless-media/core
  └── @headless-media/ui-native
```

## Hard Boundaries

The following import directions are **forbidden**. Violations are caught by:

1. ESLint `no-restricted-imports` rules in `eslint.config.mjs`
2. `boundary-check` job in `.github/workflows/ci.yml`

| From              | To            | Reason                                      |
| ----------------- | ------------- | ------------------------------------------- |
| `media-core`      | React         | Core must run in CLI, Node, any environment |
| `media-core`      | DOM           | Same — portable                             |
| `media-ui-react`  | `media-core`  | UI components know nothing about Pexels     |
| `media-ui-react`  | `media-react` | UI components know nothing about hooks      |
| `media-ui-native` | `media-core`  | Same contract as web                        |
| `media-react`     | (renders UI)  | Hooks-only layer                            |

## Package Responsibilities

### `@headless-media/core`

- **One job**: Provide a clean, typed API over the Pexels HTTP API
- No React, no DOM, no browser globals except `fetch`
- Key internal components:
  - `HttpClient` — single `fetch` abstraction with auth injection, timeout, error mapping
  - `MemoryCache<T>` — generic TTL cache, lazy expiry, no timers
  - `RequestDeduplicator` — collapses concurrent identical fetches
  - `EventEmitter<T>` — typed pub/sub, portable across all environments
  - `PexelsApiClient` — transforms raw Pexels snake_case responses to our camelCase models
  - `PhotoService` / `VideoService` — cache + dedupe layer over PexelsApiClient
  - `createMediaSDK()` — the only public factory, wires all internals

### `@headless-media/react`

- **One job**: Adapt `media-core` to React idioms
- No business logic — hooks are thin adapters
- `MediaProvider` creates the SDK once via `useMemo`
- Hook surface: `useSearch`, `useCurated`, `useMedia`, `useViewer`, `useDownload`, `useSDKEvent`

### `@headless-media/ui-react`

- **One job**: Provide accessible, unstyled UI behavior
- No SDK imports — receives all data via props
- Prop-getter pattern: `getContainerProps()`, `getItemProps()`, etc.
- `useGrid`: IntersectionObserver-based infinite scroll
- `useLightbox`: Focus trap, keyboard nav, body scroll lock, focus restore
- `useReelSwiper`: IntersectionObserver active-item detection, scroll snap

### `apps/web`

- The only layer that imports both `@headless-media/react` AND `@headless-media/ui-react`
- Wiring components (`PhotoGrid`, `PhotoLightbox`) compose data hooks with UI hooks
- Routes: `/` (curated), `/search`, `/reels`

## Data Flow

```
User action (click, scroll, search)
  ↓
App component handler
  ↓
media-react hook (useSearch, useViewer, etc.)
  ↓
media-core SDK (PhotoService → PexelsApiClient → HttpClient → fetch)
  ↓
Pexels API
  ↓
Response transforms (snake_case → camelCase)
  ↓
MemoryCache stores result
  ↓
React state update
  ↓
Re-render with new data
  ↓
media-ui-react prop-getters provide ARIA attributes
  ↓
Consumer markup + styles display the data
```

## Event Flow

```
useViewer.open(item)  →  sdk.events.emit('view', { mediaId, mediaType })
                                ↓
                    Default logger (console.info)
                    + Any subscribed listeners (useSDKEvent)
                    + App's own analytics, tracking, etc.
```

## Caching Strategy

- **List cache**: `MemoryCache<PaginatedResponse<T>>`, TTL 5 minutes
  - Key: `photo:search:${JSON.stringify(params)}` or `photo:curated:${JSON.stringify(params)}`
- **Single-item cache**: `MemoryCache<Photo | Video>`, TTL 5 minutes
  - Key: `photo:id:${id}`
- **Request deduplication**: `RequestDeduplicator` prevents concurrent identical fetches
  - Resolved when the first request settles; all concurrent callers get the same result

`sdk.clearCache()` clears all four caches simultaneously.
