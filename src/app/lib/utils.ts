import { NextRequest } from 'next/server';
import { TooManyRequestsError, NotFoundError, ValidationError } from './errors';

/**
 * Retrieves the client IP address from the request.
 * @param request - The Next.js request object.
 * @returns The client IP address as a string.
 */
export function getClientIp(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for') ||
    request.headers.get('x-real-ip') ||
    request.ip ||
    'unknown'
  );
}

/**
 * Handles errors and maps them to appropriate HTTP responses.
 * @param error - The error to handle.
 * @returns An object containing the error message and HTTP status code.
 */
export function handleError(error: unknown): { message: string; status: number } {
  if (error instanceof TooManyRequestsError) {
    return { message: error.message, status: 429 };
  }
  if (error instanceof NotFoundError) {
    return { message: error.message, status: 404 };
  }
  if (error instanceof ValidationError) {
    return { message: error.message, status: 400 };
  }
  console.error('Error:', error);
  return { message: 'Internal Server Error', status: 500 };
}