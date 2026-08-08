import { createPortal } from 'react-dom';
import type { Photo } from '@headless-media/core';
import { useLightbox } from '@headless-media/ui-react';
import { useDownload } from '@headless-media/react';

interface PhotoLightboxProps {
  isOpen: boolean;
  photo: Photo | null;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  hasNext: boolean;
  hasPrev: boolean;
}

/**
 * PhotoLightbox: wires useLightbox (media-ui-react) with:
 * - Photo data (media-core types)
 * - useDownload (media-react) for download + SDK event emission
 *
 * This is the boundary where UI behavior (focus trap, keyboard nav) meets
 * data concerns (download, view events). The Lightbox UI component knows
 * nothing about Pexels — it just receives getters.
 */
export function PhotoLightbox({
  isOpen,
  photo,
  onClose,
  onNext,
  onPrev,
  hasNext,
  hasPrev,
}: PhotoLightboxProps) {
  const { download, isDownloading } = useDownload();

  const {
    getBackdropProps,
    getDialogProps,
    getCloseButtonProps,
    getNextButtonProps,
    getPrevButtonProps,
  } = useLightbox({
    isOpen,
    onClose,
    onNext,
    onPrev,
    hasNext,
    hasPrev,
  });

  if (!isOpen || photo === null) return null;

  return createPortal(
    <div className="lightbox-backdrop" {...getBackdropProps()}>
      <div className="lightbox-dialog" {...getDialogProps()}>
        <img className="lightbox-img" src={photo.src.large} alt={photo.alt} />
      </div>

      <button className="lightbox-close" {...getCloseButtonProps()}>
        ✕
      </button>

      <button className="lightbox-nav lightbox-prev" {...getPrevButtonProps()}>
        ‹
      </button>

      <button className="lightbox-nav lightbox-next" {...getNextButtonProps()}>
        ›
      </button>

      <p className="lightbox-caption">
        Photo by{' '}
        <a href={photo.photographerUrl} target="_blank" rel="noopener noreferrer">
          {photo.photographer}
        </a>
      </p>

      <button
        className="lightbox-download"
        onClick={() => void download(photo.src.original, photo.id, 'photo')}
        disabled={isDownloading}
        type="button"
        aria-label="Download original photo"
      >
        {isDownloading ? 'Downloading...' : '⬇ Download'}
      </button>
    </div>,
    document.body,
  );
}
