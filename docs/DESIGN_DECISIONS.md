# Design Decisions

This document explains key design choices and the tradeoffs considered.

---

## 1. Prop-getters over render-props and compound components

**Decision:** `useGrid`, `useLightbox`, and `useReelSwiper` return prop-getter functions.

**Alternatives considered:**

- Render-props: `<Grid renderItem={(item) => ...}` — forces a specific DOM shape, breaks server rendering, poor TypeScript inference
- Compound components: `<Grid><Grid.Item /></Grid>` — requires React context wiring inside the component library, which means importing React context; conflicts with the "zero-SDK-coupling" rule
- Fully controlled components with `className`: Still ships opinionated DOM structure

**Why prop-getters win:** They are the most composable pattern. The consumer owns 100% of the DOM tree — they call `getItemProps(item)` and spread the result. They can add their own props, override individual attributes, and use any CSS approach. This is the same pattern used by Downshift, Radix Primitives, and Headless UI.

---

## 2. Typed EventEmitter over third-party libraries

**Decision:** Custom `EventEmitter<TEvents>` implementation (~80 lines).

**Alternatives considered:**

- Node.js `EventEmitter`: Node-only, breaks the portability requirement
- `mitt`: Excellent small library, but adds a runtime dependency. The custom implementation is instructive and zero-dep.
- Browser `EventTarget`: Browser-only, not portable

**Tradeoff:** Slightly more code to maintain, but the TypeScript generic `EventMap` gives us compile-time event typing that many 3rd-party solutions lack.

---

## 3. RequestDeduplicator is separate from MemoryCache

**Decision:** Two separate classes for caching and deduplication.

**Reasoning:**

- Cache answers: "Do I have this result already?"
- Deduplicator answers: "Is this request in flight right now?"

Conflating them creates an edge case: if request A is in flight and request B arrives with the same key, should B wait for A's result or fire independently? A deduplicator answers this correctly (B waits for A). A cache alone would miss this scenario since A hasn't completed yet.

---

## 4. useMemo (not useRef) for SDK initialization

**Decision:** `MediaProvider` initializes the SDK with `useMemo([apiKey, baseUrl, ...])`

**Why not useRef:**

- `useRef` never re-runs — it would silently ignore config changes (e.g. API key rotation)
- `useMemo` with a dependency array documents exactly which changes trigger SDK recreation

**Tradeoff:** In practice, the SDK config almost never changes at runtime. `useMemo` adds a tiny overhead on every render to compare dependencies. This is negligible.

---

## 5. Results accumulate in useSearch / useCurated

**Decision:** `fetchMore()` appends to `results` rather than replacing.

**Why:** Infinite scroll UIs need all pages visible simultaneously. Replacing would cause the user's scroll position to reset.

**Consequence:** Consumers should never use `results.length` as a "total" — use `totalResults` from the response instead.

---

## 6. Default logger is opt-out, not opt-in

**Decision:** `enableDefaultLogger: true` by default in `createMediaSDK()`.

**Why:** The assignment requires "a default listener logs each event to the console". Opt-out means the behavior works immediately without configuration, matching developer expectations when first evaluating the SDK. Consumers can silence it with `enableDefaultLogger: false`.

---

## 7. View event is emitted by useViewer, not by the UI component

**Decision:** `useViewer.open()` emits `sdk.events.emit('view', ...)`.

**Why:** `media-ui-react` cannot import `media-core` (boundary violation). The event emission must happen in the layer that has SDK access. `useViewer` is in `media-react`, which does have SDK access.

**Consequence:** If a consumer uses `useLightbox` (from `media-ui-react`) directly without `useViewer`, they won't get automatic view events. They'd need to emit manually using `useSDKEvents().emit('view', ...)`. This is intentional — the UI layer has no opinion about whether an "open" constitutes a "view".

---

## 8. IntersectionObserver over scroll event listeners

**Decision:** Both `useGrid` and `useReelSwiper` use IntersectionObserver.

**Why:** Scroll events fire at 60fps and require debouncing. IntersectionObserver is browser-optimized, fires only when elements cross threshold boundaries, and requires no cleanup beyond `observer.disconnect()`. It also works correctly with virtual scroll lists.

---

## Deliberate Scope Cuts (YAGNI)

Items explicitly not included and why:

| Item                     | Reason                                                                                            |
| ------------------------ | ------------------------------------------------------------------------------------------------- |
| Virtualization           | Pexels results are images with lazy loading — browser handles this adequately for the demo scale  |
| React Query / SWR        | Would obscure the architecture. The hooks demonstrate first-principles state management           |
| CSS-in-JS                | Violates headless contract — component library ships zero styles                                  |
| Storybook for `apps/web` | Storybook is for component libraries. App pages are wiring code, not library components           |
| Full Expo app            | Out of scope for the assignment time budget; scaffold with correct API surface serves the purpose |
| Websocket / real-time    | Not part of the Pexels API                                                                        |
