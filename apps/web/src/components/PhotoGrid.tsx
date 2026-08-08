import type { Photo } from '@headless-media/core';
import { useGrid } from '@headless-media/ui-react';
import { LoadingState, EmptyState } from './StateComponents.js';

interface PhotoGridProps {
  photos: readonly Photo[];
  isLoading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  onPhotoClick: (photo: Photo, index: number) => void;
}

/**
 * PhotoGrid: wires @headless-media/ui-react's useGrid hook to
 * @headless-media/core's Photo model.
 *
 * This is the integration layer — where data meets display. The useGrid hook
 * provides all accessibility attributes and infinite-scroll mechanics; this
 * component supplies the actual markup and styling.
 */
export function PhotoGrid({
  photos,
  isLoading,
  hasMore,
  onLoadMore,
  onPhotoClick,
}: PhotoGridProps) {
  const { getContainerProps, getItemProps, getSentinelProps } = useGrid({
    items: photos,
    hasMore,
    isLoading,
    onLoadMore,
  });

  if (!isLoading && photos.length === 0) {
    return <EmptyState message="No photos found. Try a different search term." />;
  }

  return (
    <>
      <div className="photo-grid" {...getContainerProps()}>
        {photos.map((photo, index) => (
          <div
            key={photo.id}
            className="photo-grid-item"
            {...getItemProps(photo)}
            onClick={() => onPhotoClick(photo, index)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onPhotoClick(photo, index);
              }
            }}
            tabIndex={0}
            role="button"
            aria-label={`View photo by ${photo.photographer}: ${photo.alt}`}
            style={{ backgroundColor: photo.avgColor }}
          >
            <img
              src={photo.src.medium}
              alt={photo.alt}
              loading="lazy"
              width={photo.width}
              height={photo.height}
            />
            <div className="photo-grid-item-overlay" aria-hidden="true">
              <span className="photo-grid-item-photographer">{photo.photographer}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="load-more-sentinel" {...getSentinelProps()}>
        {isLoading && <LoadingState message="Loading more..." />}
      </div>
    </>
  );
}
