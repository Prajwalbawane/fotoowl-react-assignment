---
name: media-ui-react-components-skill
description: >
  Teaches AI coding agents how to consume @headless-media/ui-react — the headless
  component hooks (useGrid, useLightbox, useReelSwiper). Use when building media
  gallery UIs, lightbox dialogs, or vertical video reel views.
---

# Skill: Using Headless Components with @headless-media/ui-react

## Package contract — READ THIS FIRST

```
@headless-media/ui-react has NO dependencies on:
- @headless-media/core (NO Pexels types)
- @headless-media/react (NO SDK hooks)

It ONLY depends on:
- react (peer dependency)

Components receive ALL data via props.
They know NOTHING about Pexels, SDK events, or fetching.
```

The headless pattern means:

1. You call a hook (e.g. `useGrid`)
2. The hook returns "prop-getters" — functions that return attribute objects
3. You spread those attributes onto YOUR elements
4. YOU write all the markup and CSS

---

## useGrid — Infinite Scroll Grid

### API

```ts
import { useGrid } from '@headless-media/ui-react';

const { getContainerProps, getItemProps, getSentinelProps } = useGrid({
  items, // readonly array, each item must have an `id` field
  hasMore, // boolean — are there more pages?
  isLoading, // boolean — is a fetch in progress?
  onLoadMore, // () => void — called when sentinel enters viewport
  loadMoreThreshold, // optional, default "200px" — IntersectionObserver rootMargin
});
```

### Complete example

```tsx
import { useGrid } from '@headless-media/ui-react';
import type { Photo } from '@headless-media/core';

interface PhotoGalleryProps {
  photos: readonly Photo[];
  isLoading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  onPhotoClick: (photo: Photo) => void;
}

function PhotoGallery({ photos, isLoading, hasMore, onLoadMore, onPhotoClick }: PhotoGalleryProps) {
  const { getContainerProps, getItemProps, getSentinelProps } = useGrid({
    items: photos,
    hasMore,
    isLoading,
    onLoadMore,
  });

  return (
    <>
      {/* Spread getContainerProps() onto the grid wrapper */}
      <div className="my-grid" {...getContainerProps()}>
        {photos.map((photo) => (
          <div
            key={photo.id}
            className="my-grid-item"
            {...getItemProps(photo)} // Spread per-item props
            onClick={() => onPhotoClick(photo)}
            // You can ADD your own onClick — it won't conflict
          >
            <img src={photo.src.medium} alt={photo.alt} loading="lazy" />
          </div>
        ))}
      </div>

      {/* Sentinel triggers onLoadMore when it enters viewport */}
      <div {...getSentinelProps()} />

      {/* Loading indicator is YOUR responsibility */}
      {isLoading && <div className="spinner" />}
    </>
  );
}
```

### What getContainerProps() returns

```ts
{ role: 'list', 'aria-busy': boolean }
```

### What getItemProps(item) returns

```ts
{ role: 'listitem', 'data-item-id': string | number }
```

### What getSentinelProps() returns

```ts
{ ref: RefObject<HTMLDivElement>, 'aria-hidden': true, role: 'presentation' }
```

**IMPORTANT:** The sentinel `ref` is internal. You MUST spread `getSentinelProps()` for
the IntersectionObserver to work. Do NOT move the sentinel above grid items.

---

## useLightbox — Accessible Dialog/Lightbox

### API

```ts
import { useLightbox } from '@headless-media/ui-react';

const {
  getBackdropProps,
  getDialogProps,
  getCloseButtonProps,
  getNextButtonProps,
  getPrevButtonProps,
} = useLightbox({
  isOpen, // boolean — controls visibility
  onClose, // () => void
  onNext, // optional () => void
  onPrev, // optional () => void
  hasNext, // optional boolean, default true
  hasPrev, // optional boolean, default true
});
```

### Complete example

```tsx
import { useLightbox } from '@headless-media/ui-react';
import { createPortal } from 'react-dom';

interface LightboxProps {
  isOpen: boolean;
  imageUrl: string;
  alt: string;
  onClose: () => void;
  onNext?: () => void;
  onPrev?: () => void;
  hasNext?: boolean;
  hasPrev?: boolean;
}

function Lightbox({
  isOpen,
  imageUrl,
  alt,
  onClose,
  onNext,
  onPrev,
  hasNext,
  hasPrev,
}: LightboxProps) {
  const {
    getBackdropProps,
    getDialogProps,
    getCloseButtonProps,
    getNextButtonProps,
    getPrevButtonProps,
  } = useLightbox({ isOpen, onClose, onNext, onPrev, hasNext, hasPrev });

  if (!isOpen) return null;

  // createPortal renders outside the current DOM tree — recommended for lightboxes
  return createPortal(
    <div className="backdrop" {...getBackdropProps()}>
      {/* Dialog receives focus automatically */}
      <div className="dialog" {...getDialogProps()}>
        <img src={imageUrl} alt={alt} />
      </div>

      <button className="close-btn" {...getCloseButtonProps()}>
        ✕
      </button>
      <button className="prev-btn" {...getPrevButtonProps()}>
        ‹
      </button>
      <button className="next-btn" {...getNextButtonProps()}>
        ›
      </button>
    </div>,
    document.body,
  );
}
```

### Keyboard behavior (built-in, no config needed)

| Key                 | Action                     |
| ------------------- | -------------------------- |
| `Escape`            | Calls `onClose`            |
| `ArrowRight`        | Calls `onNext`             |
| `ArrowLeft`         | Calls `onPrev`             |
| `Tab` / `Shift+Tab` | Cycles focus within dialog |

### What the hook handles automatically

- **Focus trap**: Tab/Shift+Tab cycle within the dialog
- **Focus restore**: Returns focus to the triggering element when closed
- **Body scroll lock**: `document.body.style.overflow = 'hidden'` when open
- **Backdrop click**: Clicking `getBackdropProps()` element (not children) calls `onClose`

### What YOU must handle

- Conditional rendering (`if (!isOpen) return null`)
- All CSS — position, size, animation
- Semantic structure — title, content layout

---

## useReelSwiper — Vertical Snap Scroll

### API

```ts
import { useReelSwiper } from '@headless-media/ui-react';

const { getContainerProps, getItemProps, activeIndex, activeItem, scrollToIndex } = useReelSwiper({
  items, // readonly array, each must have `id`
  onActiveItemChange, // optional (item, index) => void — fires when active item changes
  snapEnabled, // optional boolean, default true — injects scroll-snap CSS
});
```

### Complete example

```tsx
import { useReelSwiper } from '@headless-media/ui-react';

interface Video {
  id: number;
  src: string;
  thumbnail: string;
  author: string;
}

interface VideoReelsProps {
  videos: readonly Video[];
  onActiveVideoChange?: (video: Video) => void;
}

function VideoReels({ videos, onActiveVideoChange }: VideoReelsProps) {
  const { getContainerProps, getItemProps, activeIndex } = useReelSwiper({
    items: videos,
    onActiveItemChange: onActiveVideoChange,
  });

  return (
    // Container needs height: 100vh and overflow: hidden (from YOUR CSS)
    <div className="reels-container" {...getContainerProps()}>
      {videos.map((video, index) => (
        <div key={video.id} className="reel-item" {...getItemProps(video, index)}>
          <video
            src={video.src}
            poster={video.thumbnail}
            autoPlay={index === activeIndex} // Only active item plays
            loop
            muted
            playsInline
          />
          <p>{video.author}</p>
        </div>
      ))}
    </div>
  );
}
```

### Required CSS (consumer provides this)

```css
.reels-container {
  height: 100vh;
  overflow-y: scroll;
  /* scroll-snap-type injected by hook when snapEnabled=true */
}

.reel-item {
  height: 100vh;
  /* scroll-snap-align injected by hook when snapEnabled=true */
}
```

### data attributes on items

- `data-reel-index`: numeric index (string), used internally by the hook
- `data-active`: `"true"` | `"false"` — useful for CSS targeting: `[data-active="true"]`

---

## Composing both packages — the wiring pattern

The app layer is the ONLY place that composes data hooks with UI hooks:

```tsx
// In your app component:
import { useSearch, useViewer } from '@headless-media/react'; // data
import { useGrid, useLightbox } from '@headless-media/ui-react'; // display

function Gallery() {
  // Data from media-react
  const { results, hasMore, isLoading, fetchMore } = useSearch('photos');
  const { isOpen, current, currentIndex, open, close, goNext, goPrev } = useViewer();

  // Display from media-ui-react
  const { getContainerProps, getItemProps, getSentinelProps } = useGrid({
    items: results,
    hasMore,
    isLoading,
    onLoadMore: () => void fetchMore(),
  });

  return (
    <>
      <div {...getContainerProps()}>
        {results.map((photo, i) => (
          <div
            key={photo.id}
            {...getItemProps(photo)}
            onClick={() => open(photo, results, i)} // <- wiring
          >
            <img src={photo.src.medium} alt={photo.alt} />
          </div>
        ))}
      </div>
      <div {...getSentinelProps()} />

      {/* Lightbox receives state from useViewer, behavior from useLightbox */}
      <MyLightbox
        isOpen={isOpen}
        photo={current}
        onClose={close}
        onNext={goNext}
        onPrev={goPrev}
        hasNext={currentIndex < results.length - 1}
        hasPrev={currentIndex > 0}
      />
    </>
  );
}
```

---

## Anti-patterns to avoid

```tsx
// ❌ WRONG: Importing SDK types in media-ui-react components
import type { Photo } from '@headless-media/core'; // FORBIDDEN in this package

// ✅ CORRECT: Define your own prop interface or use the consumer's types
interface GridItem { id: number; src: string; alt: string; }

// ❌ WRONG: Not spreading getItemProps — accessibility won't work
{photos.map((p) => <div key={p.id}>{/* missing getItemProps */}</div>)}

// ✅ CORRECT
{photos.map((p) => <div key={p.id} {...getItemProps(p)}>...</div>)}

// ❌ WRONG: Calling getItemProps without index in useReelSwiper
{...getItemProps(video)} // Missing index — IntersectionObserver target broken

// ✅ CORRECT
{...getItemProps(video, index)}

// ❌ WRONG: Putting content inside getSentinelProps() div
<div {...getSentinelProps()}>Loading...</div>  // Breaks intersection detection

// ✅ CORRECT: Sentinel is empty, loading state is separate
<div {...getSentinelProps()} />
{isLoading && <div className="loader" />}
```
