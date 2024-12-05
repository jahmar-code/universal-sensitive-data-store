/**
 * API Route for fetching and comparing the sensitive_data table in MariaDB
 */

import { NextRequest, NextResponse } from 'next/server';
import { getClientIp, handleError } from '@/app/lib/utils';
import fixedWindowRateLimiter from '@/app/lib/fixedWindowRateLimiter';
import { z } from 'zod';
import { getConnection } from '@/app/lib/db';
import argon2 from 'argon2';
import { ValidationError, NotFoundError } from '@/app/lib/errors';

// Initialize rate limiter
const rateLimiter = fixedWindowRateLimiter({
  interval: 10 * 1000, // 10 second interval
  maxTokens: 20,       // Max 20 requests per interval
});


const fetchDataSchema = z.object({
  data: z.string().min(1, { message: 'Data is required' }),
});


/**
 * POST /api/sensitive_data/fetch
 * Retrieves all sensitive data records 
 * Compares with user input data using argon2.verify
 * Using POST instead of GET allows data to be sent in the request body, reducing the risk of exposure
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const clientIp = getClientIp(request);
    await rateLimiter(clientIp);

    const body = await request.json();
    const parseResult = fetchDataSchema.safeParse(body);

    if (!parseResult.success) {
      throw new ValidationError(parseResult.error.errors[0].message);
    }

    const { data } = parseResult.data;

    const connection = await getConnection(clientIp);

    // Fetch all hashes and titles from the database
    const rows = await connection.query(
      'SELECT id, title, hash FROM sensitive_data'
    );
    connection.release();

    const matchingTitles: string[] = [];


    // Verify the data against each stored hash
    for (const row of rows) {
      const hash = row.hash;
      const isMatch = await argon2.verify(hash, data);

      if (isMatch) {
        matchingTitles.push(row.title);
      }
    }

    if (matchingTitles.length > 0) {
      return NextResponse.json(
        { titles: matchingTitles },
        { status: 200 }
      );
    } else {
      throw new NotFoundError('No matching data found');
    }
  } catch (error) {
    const { message, status } = handleError(error);
    return NextResponse.json({ message }, { status });
  }
}
