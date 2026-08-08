/**
 * Domain models for Pexels API responses.
 *
 * WHY separate models: These types are the SDK's public contract. Keeping them
 * isolated means we can adapt to Pexels API changes without breaking
 * consumers — we transform at the boundary (in the API client), not in domain
 * code.
 *
 * All fields use `readonly` to enforce immutability — the SDK never mutates
 * received data.
 */

export interface PhotoSrc {
  readonly original: string;
  readonly large2x: string;
  readonly large: string;
  readonly medium: string;
  readonly small: string;
  readonly portrait: string;
  readonly landscape: string;
  readonly tiny: string;
}

export interface Photo {
  readonly id: number;
  readonly width: number;
  readonly height: number;
  readonly url: string;
  readonly photographer: string;
  readonly photographerUrl: string;
  readonly photographerId: number;
  readonly avgColor: string;
  readonly src: PhotoSrc;
  readonly liked: boolean;
  readonly alt: string;
}

/** The aspect ratio as a decimal (width / height). Useful for layout. */
export function getPhotoAspectRatio(photo: Photo): number {
  return photo.width / photo.height;
}
