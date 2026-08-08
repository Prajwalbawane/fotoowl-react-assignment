/**
 * Base error class for all SDK errors.
 *
 * WHY: A unified error hierarchy lets consumers use `instanceof` checks to
 * distinguish between network failures, auth issues, and API errors without
 * coupling to error message strings.
 */
export class MediaSDKError extends Error {
  constructor(
    message: string,
    public readonly code: string,
  ) {
    super(message);
    this.name = 'MediaSDKError';
    // Maintains correct prototype chain in transpiled environments
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Thrown when the API returns a 4xx/5xx response.
 */
export class ApiError extends MediaSDKError {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly endpoint: string,
  ) {
    super(message, 'API_ERROR');
    this.name = 'ApiError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Thrown when the request fails at the network level (no response received).
 */
export class NetworkError extends MediaSDKError {
  constructor(
    message: string,
    public override readonly cause?: Error,
  ) {
    super(message, 'NETWORK_ERROR');
    this.name = 'NetworkError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Thrown when the API key is missing or rejected by the upstream API.
 */
export class AuthError extends MediaSDKError {
  constructor(message: string) {
    super(message, 'AUTH_ERROR');
    this.name = 'AuthError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Thrown when the upstream API returns HTTP 429 Too Many Requests.
 */
export class RateLimitError extends MediaSDKError {
  constructor(
    message: string,
    public readonly retryAfterSeconds?: number,
  ) {
    super(message, 'RATE_LIMIT_ERROR');
    this.name = 'RateLimitError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Thrown when a request exceeds the configured timeout.
 */
export class TimeoutError extends MediaSDKError {
  constructor(public readonly timeoutMs: number) {
    super(`Request timed out after ${timeoutMs}ms`, 'TIMEOUT_ERROR');
    this.name = 'TimeoutError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Thrown when the API response cannot be parsed into the expected shape.
 */
export class ParseError extends MediaSDKError {
  constructor(
    message: string,
    public readonly raw: unknown,
  ) {
    super(message, 'PARSE_ERROR');
    this.name = 'ParseError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
