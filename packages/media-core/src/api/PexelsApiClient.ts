import type { HttpClient } from '../http/HttpClient.js';
import type {
  Photo,
  Video,
  VideoFile,
  PaginatedResponse,
  SearchParams,
  PaginationParams,
} from '../models/index.js';
import { ParseError } from '../errors/index.js';

/**
 * Raw Pexels API response shapes.
 *
 * WHY internal types: We never expose Pexels' raw API shape to consumers.
 * The transformation happens here, at the boundary, so the rest of the SDK
 * works with our own stable domain models.
 */
interface RawPexelsPhoto {
  id: number;
  width: number;
  height: number;
  url: string;
  photographer: string;
  photographer_url: string;
  photographer_id: number;
  avg_color: string;
  src: {
    original: string;
    large2x: string;
    large: string;
    medium: string;
    small: string;
    portrait: string;
    landscape: string;
    tiny: string;
  };
  liked: boolean;
  alt: string;
}

interface RawPexelsVideoFile {
  id: number;
  quality: string;
  file_type: string;
  width: number | null;
  height: number | null;
  fps: number | null;
  link: string;
  size: number | null;
}

interface RawPexelsVideo {
  id: number;
  width: number;
  height: number;
  url: string;
  image: string;
  duration: number;
  user: { id: number; name: string; url: string };
  video_files: RawPexelsVideoFile[];
  video_pictures: { id: number; nr: number; picture: string }[];
}

interface RawPhotoList {
  photos: RawPexelsPhoto[];
  total_results: number;
  page: number;
  per_page: number;
  next_page?: string;
  prev_page?: string;
}

interface RawVideoList {
  videos: RawPexelsVideo[];
  total_results: number;
  page: number;
  per_page: number;
  next_page?: string;
  prev_page?: string;
}

/**
 * Transforms a raw Pexels photo into the SDK's domain model.
 * Pure function — no side effects.
 */
function toPhoto(raw: RawPexelsPhoto): Photo {
  return {
    id: raw.id,
    width: raw.width,
    height: raw.height,
    url: raw.url,
    photographer: raw.photographer,
    photographerUrl: raw.photographer_url,
    photographerId: raw.photographer_id,
    avgColor: raw.avg_color,
    src: raw.src,
    liked: raw.liked,
    alt: raw.alt,
  };
}

function toVideoFile(raw: RawPexelsVideoFile): VideoFile {
  return {
    id: raw.id,
    quality: raw.quality as 'sd' | 'hd' | 'uhd',
    fileType: raw.file_type,
    width: raw.width,
    height: raw.height,
    fps: raw.fps,
    link: raw.link,
    size: raw.size,
  };
}

function toVideo(raw: RawPexelsVideo): Video {
  return {
    id: raw.id,
    width: raw.width,
    height: raw.height,
    url: raw.url,
    image: raw.image,
    duration: raw.duration,
    user: raw.user,
    videoFiles: raw.video_files.map(toVideoFile),
    videoPictures: raw.video_pictures,
  };
}

function toPhotoPaginated(raw: RawPhotoList): PaginatedResponse<Photo> {
  return {
    items: raw.photos.map(toPhoto),
    totalResults: raw.total_results,
    page: raw.page,
    perPage: raw.per_page,
    nextPage: raw.next_page ?? null,
    prevPage: raw.prev_page ?? null,
  };
}

function toVideoPaginated(raw: RawVideoList): PaginatedResponse<Video> {
  return {
    items: raw.videos.map(toVideo),
    totalResults: raw.total_results,
    page: raw.page,
    perPage: raw.per_page,
    nextPage: raw.next_page ?? null,
    prevPage: raw.prev_page ?? null,
  };
}

function buildPhotoParams(
  params: SearchParams | PaginationParams,
): Record<string, string | number> {
  const result: Record<string, string | number> = {};
  if ('query' in params) result['query'] = params.query;
  if (params.page !== undefined) result['page'] = params.page;
  if (params.perPage !== undefined) result['per_page'] = params.perPage;
  if ('orientation' in params && params.orientation !== undefined)
    result['orientation'] = params.orientation;
  if ('size' in params && params.size !== undefined) result['size'] = params.size;
  if ('color' in params && params.color !== undefined) result['color'] = params.color;
  if ('locale' in params && params.locale !== undefined) result['locale'] = params.locale;
  return result;
}

/**
 * Pexels API client — implements the photo and video service operations.
 *
 * WHY this is NOT the service interface: The API client handles HTTP mechanics.
 * Service interfaces (PhotoService, VideoService) define the domain contract.
 * This separation allows future alternative implementations (e.g. Unsplash).
 */
export class PexelsApiClient {
  constructor(private readonly http: HttpClient) {}

  // --- Photos ---

  async searchPhotos(params: SearchParams): Promise<PaginatedResponse<Photo>> {
    const response = await this.http.get<RawPhotoList>('/v1/search', buildPhotoParams(params));
    if (!response.data.photos) {
      throw new ParseError('Unexpected response shape from /v1/search', response.data);
    }
    return toPhotoPaginated(response.data);
  }

  async getCuratedPhotos(params?: PaginationParams): Promise<PaginatedResponse<Photo>> {
    const response = await this.http.get<RawPhotoList>(
      '/v1/curated',
      params !== undefined ? buildPhotoParams(params) : undefined,
    );
    return toPhotoPaginated(response.data);
  }

  async getPhotoById(id: number): Promise<Photo> {
    const response = await this.http.get<RawPexelsPhoto>(`/v1/photos/${id}`);
    return toPhoto(response.data);
  }

  // --- Videos ---

  async searchVideos(params: SearchParams): Promise<PaginatedResponse<Video>> {
    const response = await this.http.get<RawVideoList>('/videos/search', buildPhotoParams(params));
    if (!response.data.videos) {
      throw new ParseError('Unexpected response shape from /videos/search', response.data);
    }
    return toVideoPaginated(response.data);
  }

  async getPopularVideos(params?: PaginationParams): Promise<PaginatedResponse<Video>> {
    const response = await this.http.get<RawVideoList>(
      '/videos/popular',
      params !== undefined ? buildPhotoParams(params) : undefined,
    );
    return toVideoPaginated(response.data);
  }

  async getVideoById(id: number): Promise<Video> {
    const response = await this.http.get<RawPexelsVideo>(`/videos/videos/${id}`);
    return toVideo(response.data);
  }
}
