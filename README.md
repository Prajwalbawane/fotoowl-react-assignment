<!-- Banner area -->
<div align="center">

# Headless Media SDK

**A framework-agnostic media SDK ecosystem powered by the Pexels API**

[![CI](https://github.com/your-username/headless-media-sdk/actions/workflows/ci.yml/badge.svg)](https://github.com/your-username/headless-media-sdk/actions/workflows/ci.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![pnpm](https://img.shields.io/badge/pnpm-9.x-F69220?logo=pnpm&logoColor=white)](https://pnpm.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

[Live Demo](https://headless-media-sdk.vercel.app) · [SDK Docs](https://headless-media-sdk.vercel.app/docs) · [Storybook](https://headless-media-sdk-storybook.vercel.app)

</div>

---

## What is this?

A production-quality monorepo demonstrating clean separation of concerns across a media SDK ecosystem:

| Layer       | Package                     | Responsibility                                   |
| ----------- | --------------------------- | ------------------------------------------------ |
| Core SDK    | `@headless-media/core`      | Pexels API client, caching, events, typed models |
| React data  | `@headless-media/react`     | Provider, hooks — zero business logic            |
| React UI    | `@headless-media/ui-react`  | Headless hooks — zero styles, zero SDK knowledge |
| Native data | `@headless-media/native`    | Same hook API, React Native idioms               |
| Native UI   | `@headless-media/ui-native` | Headless hooks for React Native                  |
| Demo app    | `apps/web`                  | Wires everything together                        |

## Architecture

```
apps/web
  ├── @headless-media/react   (data / events / auth)
  │     └── @headless-media/core  (pure TS, zero deps)
  └── @headless-media/ui-react    (headless UI, no SDK coupling)
```

**Hard boundaries enforced by ESLint + CI:**

- `media-core` → no React, no DOM
- `media-ui-react` → no `media-core`, no `media-react`
- `media-react` → no business logic, no UI rendering

## Quickstart

```bash
# Prerequisites: Node 20+, pnpm 9+
git clone https://github.com/your-username/headless-media-sdk
cd headless-media-sdk

# Install all workspace dependencies
pnpm install

# Copy env and add your Pexels API key
cp .env.example apps/web/.env.local
# Edit apps/web/.env.local: VITE_PEXELS_API_KEY=your_key_here

# Start the demo app
pnpm dev

# Run all tests
pnpm test

# Full build
pnpm build

# Type check
pnpm typecheck
```

## SDK Usage

```ts
import { createMediaSDK } from '@headless-media/core';

const sdk = createMediaSDK({ apiKey: 'your-pexels-key' });

// Subscribe to events
sdk.events.on('view', ({ mediaId, mediaType }) => {
  console.log(`Viewed ${mediaType} #${mediaId}`);
});

// Fetch data
const photos = await sdk.photos.search({ query: 'mountains', perPage: 20 });
const videos = await sdk.videos.getPopular({ perPage: 10 });
```

## React Usage

```tsx
import { MediaProvider, useSearch, useViewer } from '@headless-media/react';
import { useGrid, useLightbox } from '@headless-media/ui-react';

function App() {
  return (
    <MediaProvider apiKey={process.env.VITE_PEXELS_API_KEY}>
      <Gallery />
    </MediaProvider>
  );
}

function Gallery() {
  // Data (from media-react)
  const { results, hasMore, isLoading, fetchMore } = useSearch('photos');
  const { isOpen, current, open, close } = useViewer();

  // Display (from media-ui-react) — no SDK coupling
  const { getContainerProps, getItemProps, getSentinelProps } = useGrid({
    items: results,
    hasMore,
    isLoading,
    onLoadMore: () => void fetchMore(),
  });

  return (
    <div {...getContainerProps()}>
      {results.map((photo, i) => (
        <div key={photo.id} {...getItemProps(photo)} onClick={() => open(photo, results, i)}>
          <img src={photo.src.medium} alt={photo.alt} />
        </div>
      ))}
      <div {...getSentinelProps()} />
    </div>
  );
}
```

## Project Structure

```
.
├── apps/
│   └── web/                    # React demo (Vite + React Router)
├── packages/
│   ├── media-core/             # Zero-dep TypeScript SDK
│   │   └── src/
│   │       ├── api/            # PexelsApiClient, PhotoService, VideoService
│   │       ├── cache/          # MemoryCache, RequestDeduplicator
│   │       ├── events/         # TypedEventEmitter, SDKEvents
│   │       ├── errors/         # Error hierarchy
│   │       ├── http/           # HttpClient (fetch abstraction)
│   │       ├── models/         # Photo, Video, Pagination domain models
│   │       └── sdk.ts          # createMediaSDK() factory
│   ├── media-react/            # React hooks + Provider
│   ├── media-native/           # React Native hooks (same API as media-react)
│   ├── media-ui-react/         # Headless UI hooks (useGrid, useLightbox, useReelSwiper)
│   └── media-ui-native/        # Headless Native hooks (useList, useModal, useSnapScroller)
├── skills/
│   ├── media-react-data-skill.md       # AI skill: wiring data
│   └── media-ui-react-components-skill.md  # AI skill: using UI components
├── docs/
│   ├── ARCHITECTURE.md
│   ├── DESIGN_DECISIONS.md
│   └── CONTRIBUTING.md
└── .github/
    └── workflows/
        ├── ci.yml       # Build, lint, test, boundary audit
        └── deploy.yml   # Vercel deployment
```

## Design Decisions

### Why prop-getters instead of render-props or compound components?

Prop-getters (`getContainerProps()`, `getItemProps(item)`) are the most composable headless pattern. Consumers can spread them and selectively override any prop, unlike render-props (which force a specific component shape) or compound components (which require a parent context).

### Why a custom EventEmitter over Node's?

`media-core` must run anywhere — browser, Node, React Native, Cloudflare Workers, CLI. Node's EventEmitter would make it Node-specific. The custom typed implementation is ~80 lines and demonstrates SDK design skill.

### Why separate RequestDeduplicator from MemoryCache?

Cache stores _results_ across time. Deduplicator prevents concurrent _identical in-flight requests_ — a different problem. Conflating them would create surprising behavior when the same key is requested during an ongoing fetch.

### Why useMemo for SDK initialization in MediaProvider?

`useRef` would silently ignore config changes. `useMemo` documents which config changes should rebuild the SDK (API key rotation, base URL changes) and handles it correctly.

## AI-Assisted Development

This project was built with AI coding tool assistance. The two `skills/` documents were used to steer the AI while building `apps/web`:

- **`skills/media-react-data-skill.md`** — steered hook usage, prevented calling hooks outside Provider, enforced the `void fetchMore()` pattern
- **`skills/media-ui-react-components-skill.md`** — enforced prop-getter spreading, prevented SDK imports in UI layer, guided accessibility patterns

The following were written by hand without AI assistance:

- Architecture decisions and dependency boundary rules
- `EventEmitter` implementation (wanted to own the exact behavior)
- `RequestDeduplicator` (the `finally` cleanup logic required careful thought)
- The ESLint rules that enforce import boundaries

## Contributing

See [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md).

## License

MIT © 2024
