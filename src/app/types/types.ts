export interface SensitiveData {
  id: number;
  hash: string;
  title: string; // This has a limit of 255 characters
  description: string; // This is "hash" in the database
  created_at: string;
  updated_at: string;
}

export interface User {
  username: string;
  password: string;
}

/**
 * Generic interface for API responses.
 * @template T - The type of the data payload.
 */
export interface ResponseData<T = unknown> {
  message: string;
  data?: T;
}

/**
 * Options for the rate limiter.
 */
export interface RateLimiterOptions {
  interval: number;  // in milliseconds
  maxTokens: number; // Maximum tokens per interval
}

/**
 * Record for tracking tokens in the rate limiter.
 */
export interface TokenRecord {
  tokens: number;
  lastRefill: number;
}