import {
  ApiError,
  AuthError,
  NetworkError,
  RateLimitError,
  TimeoutError,
} from '../errors/index.js';

export interface HttpClientConfig {
  readonly baseUrl: string;
  readonly apiKey: string;
  readonly timeoutMs: number;
  readonly headers?: Record<string, string>;
}

export interface HttpResponse<T> {
  readonly data: T;
  readonly status: number;
  readonly headers: Record<string, string>;
}

/**
 * A minimal, portable HTTP client wrapping the Fetch API.
 *
 * WHY this abstraction: Spreading `fetch` calls throughout the codebase makes
 * auth, error handling, and timeouts inconsistent. A single client enforces a
 * uniform contract and can be swapped for any fetch-compatible implementation
 * (e.g. node-fetch in Node 16, a mock in tests).
 *
 * WHY not axios: Zero additional dependencies. `fetch` is available in all
 * target environments (browser, Node 18+, React Native, Cloudflare Workers).
 */
export class HttpClient {
  constructor(private readonly config: HttpClientConfig) {}

  async get<T>(path: string, params?: Record<string, string | number>): Promise<HttpResponse<T>> {
    const url = this.buildUrl(path, params);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeoutMs);

    let response: Response;
    try {
      response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          Authorization: this.config.apiKey,
          'Content-Type': 'application/json',
          ...this.config.headers,
        },
        signal: controller.signal,
      });
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw new TimeoutError(this.config.timeoutMs);
      }
      throw new NetworkError(
        `Network request failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error instanceof Error ? error : undefined,
      );
    } finally {
      clearTimeout(timeoutId);
    }

    return this.parseResponse<T>(response, path);
  }

  private buildUrl(path: string, params?: Record<string, string | number>): URL {
    const url = new URL(path, this.config.baseUrl);
    if (params !== undefined) {
      for (const [key, value] of Object.entries(params)) {
        url.searchParams.set(key, String(value));
      }
    }
    return url;
  }

  private async parseResponse<T>(response: Response, endpoint: string): Promise<HttpResponse<T>> {
    if (response.status === 401 || response.status === 403) {
      throw new AuthError(
        `Authentication failed (HTTP ${response.status}). Check your Pexels API key.`,
      );
    }

    if (response.status === 429) {
      const retryAfter = response.headers.get('Retry-After');
      throw new RateLimitError(
        'Rate limit exceeded. Please slow down requests.',
        retryAfter !== null ? Number(retryAfter) : undefined,
      );
    }

    if (!response.ok) {
      throw new ApiError(
        `API request failed with status ${response.status}`,
        response.status,
        endpoint,
      );
    }

    const data = (await response.json()) as T;

    const responseHeaders: Record<string, string> = {};
    response.headers.forEach((value: string, key: string) => {
      responseHeaders[key] = value;
    });

    return {
      data,
      status: response.status,
      headers: responseHeaders,
    };
  }
}
