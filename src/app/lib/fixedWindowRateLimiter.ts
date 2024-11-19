/**
 * Very simple rate limiter for API routes.
 * 
 * Since serverless functions will all store their own version of the token map we can't
 * effectively implement a proper distributed rate limiter like a token bucket unless we
 * used a shared database or cache (i.e. storing it directly in MariaDB or Redis). 
 */

type Options = {
  interval: number;  // in milliseconds
  maxTokens: number; // Maximum tokens per interval
};

type TokenRecord = {
  tokens: number;
  lastRefill: number;
};

const fixedWindowRateLimiter = ({ interval, maxTokens }: Options) => {
  const tokenMap = new Map<string, TokenRecord>();

  return {
    check: async (key: string) => {
      return new Promise<void>((resolve, reject) => {
        const now: number = Date.now();
        let record = tokenMap.get(key);

        if (!record) {
          // Initialize token record
          record = { tokens: maxTokens - 1, lastRefill: now };
          tokenMap.set(key, record);
          resolve();
          return;
        }

        const timePassed: number = now - record.lastRefill;

        if (timePassed > interval) {
          // Refill tokens
          record.tokens = maxTokens - 1;
          record.lastRefill = now;
          resolve();
          return;
        }

        if (record.tokens > 0) {
          record.tokens -= 1;
          resolve();
        } else {
          // Exceeded rate limit
          reject();
        }
      });
    },
  };
};

export default fixedWindowRateLimiter;