/**
 * API Route for the sensitive_data table in MariaDB
 */

import { NextRequest, NextResponse } from 'next/server';
import { getClientIp, handleError } from '@/app/lib/utils';
import fixedWindowRateLimiter from '@/app/lib/fixedWindowRateLimiter';
import { z } from 'zod';
import { getConnection } from '@/app/lib/db';
import { SensitiveData, ResponseData } from '@/app/types/types';
import { ValidationError } from '@/app/lib/errors';
import argon2 from 'argon2';

// Initialize rate limiter
const rateLimiter = fixedWindowRateLimiter({
  interval: 10 * 1000, // 10 second interval
  maxTokens: 20,       // Max 20 requests per interval
});

const insertDataSchema = z.object({
  preHash: z.string().min(1, { message: 'Sensitive data must be at least 1 character long' }),
  title: z.string().max(255, { message: 'Title must be less than 256 characters long' }),
});

/**
 * GET /api/sensitive_data
 * Retrieves all sensitive data records.
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const clientIp = getClientIp(request);
    await rateLimiter(clientIp);

    const connection = await getConnection(clientIp);

    const rows = await connection.query(
      'SELECT id, title, created_at, updated_at FROM sensitive_data'
    );
    connection.release();

    // Convert BigInt values to strings
    const data: SensitiveData[] = rows.map((row: any) => ({
      ...row,
      id: row.id.toString(),
    }));

    const response: ResponseData<SensitiveData[]> = {
      message: 'Data retrieved successfully',
      data,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    const { message, status } = handleError(error);
    return NextResponse.json({ message }, { status });
  }
}

/**
 * POST /api/sensitive_data
 * Creates a new sensitive data record.
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const clientIp = getClientIp(request);
    await rateLimiter(clientIp);

    const body = await request.json();
    const parseResult = insertDataSchema.safeParse(body);

    if (!parseResult.success) {
      throw new ValidationError(parseResult.error.errors[0].message);
    }

    const { preHash, title } = parseResult.data;
    const connection = await getConnection(clientIp);

    await connection.beginTransaction();

    const hash = await argon2.hash(preHash, {
      type: argon2.argon2id,
      memoryCost: 2 ** 16,
      timeCost: 4,
      parallelism: 2,
    });

    const insertResult = await connection.query(
      'INSERT INTO sensitive_data (hash, title) VALUES (?, ?)',
      [hash, title]
    );

    const [insertedData] = await connection.query(
      'SELECT id, title, created_at, updated_at FROM sensitive_data WHERE id = ?',
      [insertResult.insertId]
    );

    await connection.commit();
    connection.release();

    if (!insertedData) {
      throw new Error('Failed to retrieve inserted data');
    }

    const data: SensitiveData = {
      ...insertedData,
      id: insertedData.id.toString(),
    };

    const response: ResponseData<SensitiveData> = {
      message: 'Data inserted successfully',
      data,
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    const { message, status } = handleError(error);
    return NextResponse.json({ message }, { status });
  }
}