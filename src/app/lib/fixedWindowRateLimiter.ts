/**
 * Very simple rate limiter for API routes.
 * 
 * Since serverless functions will all store their own version of the token map we can't
 * effectively implement a proper distributed rate limiter like a token bucket unless we
 * used a shared database or cache (i.e. storing it directly in MariaDB or Redis). 
 */

import { RateLimiterOptions, TokenRecord } from '@/app/types/types';
import { TooManyRequestsError } from '@/app/lib/errors';

/**
 * Creates a fixed window rate limiter.
 * @param options - The rate limiter options.
 * @returns A function to perform rate limiting.
 */
const fixedWindowRateLimiter = ({ interval, maxTokens }: RateLimiterOptions) => {
  const tokenMap = new Map<string, TokenRecord>();

  return async function rateLimit(key: string): Promise<void> {
    const now = Date.now();
    let record = tokenMap.get(key);

    if (!record) {
      record = { tokens: maxTokens - 1, lastRefill: now };
      tokenMap.set(key, record);
      return;
    }

    const timePassed = now - record.lastRefill;

    if (timePassed > interval) {
      record.tokens = maxTokens - 1;
      record.lastRefill = now;
      return;
    }

    if (record.tokens > 0) {
      record.tokens -= 1;
    } else {
      throw new TooManyRequestsError();
    }
  };
};

export default fixedWindowRateLimiter;