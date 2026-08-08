export interface PaginationParams {
  readonly page?: number;
  readonly perPage?: number;
}

export interface SearchParams extends PaginationParams {
  readonly query: string;
  readonly orientation?: 'landscape' | 'portrait' | 'square';
  readonly size?: 'large' | 'medium' | 'small';
  readonly color?: string;
  readonly locale?: string;
}

export interface PaginatedResponse<T> {
  readonly items: readonly T[];
  readonly totalResults: number;
  readonly page: number;
  readonly perPage: number;
  readonly nextPage: string | null;
  readonly prevPage: string | null;
}

/** Returns true if there are more pages to fetch. */
export function hasNextPage(response: PaginatedResponse<unknown>): boolean {
  return response.nextPage !== null;
}

/** Computes the total number of pages. */
export function totalPages(response: PaginatedResponse<unknown>): number {
  return Math.ceil(response.totalResults / response.perPage);
}
