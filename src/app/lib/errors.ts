// /app/lib/errors.ts

/**
 * Error class representing a "Too Many Requests" error.
 */
export class TooManyRequestsError extends Error {
  constructor(message = 'Too Many Requests') {
    super(message);
    this.name = 'TooManyRequestsError';
  }
}

/**
 * Error class representing a "Not Found" error.
 */
export class NotFoundError extends Error {
  constructor(message = 'Record not found') {
    super(message);
    this.name = 'NotFoundError';
  }
}

/**
 * Error class representing a validation error.
 */
export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}