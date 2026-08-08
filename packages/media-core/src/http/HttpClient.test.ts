import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  ApiError,
  AuthError,
  NetworkError,
  RateLimitError,
  TimeoutError,
} from '../errors/index.js';
import { HttpClient } from '../http/HttpClient.js';

// WHY mock fetch at module level: HttpClient is purely a fetch wrapper.
// We want to test error mapping without real network calls.
const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

function makeClient() {
  return new HttpClient({
    baseUrl: 'https://api.pexels.com',
    apiKey: 'test-key',
    timeoutMs: 5000,
  });
}

function makeResponse(
  status: number,
  body: unknown,
  headers: Record<string, string> = {},
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...headers },
  });
}

describe('HttpClient', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it('returns parsed data on a successful response', async () => {
    const payload = { photos: [], total_results: 0, page: 1, per_page: 15 };
    mockFetch.mockResolvedValueOnce(makeResponse(200, payload));

    const client = makeClient();
    const result = await client.get('/v1/curated');
    expect(result.data).toEqual(payload);
    expect(result.status).toBe(200);
  });

  it('sends Authorization header with API key', async () => {
    mockFetch.mockResolvedValueOnce(makeResponse(200, {}));
    const client = makeClient();
    await client.get('/v1/curated');

    const [, init] = mockFetch.mock.calls[0] as [string, RequestInit];
    expect((init.headers as Record<string, string>)['Authorization']).toBe('test-key');
  });

  it('throws AuthError on 401', async () => {
    mockFetch.mockResolvedValueOnce(makeResponse(401, { error: 'unauthorized' }));
    const client = makeClient();
    await expect(client.get('/v1/curated')).rejects.toBeInstanceOf(AuthError);
  });

  it('throws AuthError on 403', async () => {
    mockFetch.mockResolvedValueOnce(makeResponse(403, {}));
    await expect(makeClient().get('/v1/curated')).rejects.toBeInstanceOf(AuthError);
  });

  it('throws RateLimitError on 429', async () => {
    mockFetch.mockResolvedValueOnce(makeResponse(429, {}, { 'Retry-After': '60' }));
    const err = await makeClient()
      .get('/v1/curated')
      .catch((e: unknown) => e);
    expect(err).toBeInstanceOf(RateLimitError);
    expect((err as RateLimitError).retryAfterSeconds).toBe(60);
  });

  it('throws ApiError on 500', async () => {
    mockFetch.mockResolvedValueOnce(makeResponse(500, {}));
    await expect(makeClient().get('/v1/curated')).rejects.toBeInstanceOf(ApiError);
  });

  it('throws NetworkError on fetch rejection', async () => {
    mockFetch.mockRejectedValueOnce(new TypeError('Failed to fetch'));
    await expect(makeClient().get('/v1/curated')).rejects.toBeInstanceOf(NetworkError);
  });

  it('throws TimeoutError when request is aborted', async () => {
    mockFetch.mockImplementationOnce(
      (_url: string, init: RequestInit) =>
        new Promise((_resolve, reject) => {
          const signal = init.signal as AbortSignal;
          signal.addEventListener('abort', () => {
            const err = new Error('AbortError');
            err.name = 'AbortError';
            reject(err);
          });
        }),
    );
    const client = new HttpClient({
      baseUrl: 'https://api.pexels.com',
      apiKey: 'key',
      timeoutMs: 1,
    });
    await expect(client.get('/v1/curated')).rejects.toBeInstanceOf(TimeoutError);
  });

  it('appends query params to URL', async () => {
    mockFetch.mockResolvedValueOnce(makeResponse(200, {}));
    await makeClient().get('/v1/search', { query: 'cats', per_page: 10 });
    const [url] = mockFetch.mock.calls[0] as [string, RequestInit];
    expect(url).toContain('query=cats');
    expect(url).toContain('per_page=10');
  });
});
