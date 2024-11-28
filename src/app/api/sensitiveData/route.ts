/**
 * API Route for the sensitive_data table in MariaDB
 */

import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/app/lib/db';
import fixedWindowRateLimiter from '@/app/lib/fixedWindowRateLimiter';
import { z } from 'zod';
import { PoolConnection } from 'mariadb';
import argon2 from 'argon2';

// Initialize rate limiter
const rateLimiter = fixedWindowRateLimiter({
  interval: 60 * 1000, // 1 minute
  maxTokens: 10,       // Max 10 requests per interval
});

const insertDataSchema = z.object({
  sensitiveData: z.string().min(1, { message: 'sensitive data must be at least 1 character long' }),
  title: z.string().max(255, { message: 'title must be less than 256 characters long' }),
});

interface ResponseData {
  message: string;
  data?: {
    id: string; // Changed to string if BigInt is converted to string
    hash: string;
    title: string;
    created_at: string;
    updated_at: string;
  };
}

export async function GET(request: NextRequest) {
  return NextResponse.json({ message: 'GET method not supported' }, { status: 405 });
}

export async function POST(request: NextRequest) {
  // Rate Limiting
  try {
    const clientIp =
      request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip') ||
      request.ip ||
      'unknown';
    await rateLimiter.check(clientIp);
  } catch {
    return NextResponse.json({ message: 'Too Many Requests' }, { status: 429 });
  }

  // Validate Input
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: 'Invalid JSON' }, { status: 400 });
  }

  const parseResult = insertDataSchema.safeParse(body);
  if (!parseResult.success) {
    return NextResponse.json(
      { message: parseResult.error.errors[0].message },
      { status: 400 }
    );
  }

  const { sensitiveData, title } = parseResult.data;

  let connection: PoolConnection | null = null;

  try {
    connection = await pool.getConnection();

    await connection.beginTransaction();

    // Hash the sensitive data using Argon2
    const hashedSensitiveData = await argon2.hash(sensitiveData, {
      type: argon2.argon2id,
      memoryCost: 2 ** 16, // 64 MB
      timeCost: 4,
      parallelism: 2,
    });
    
    // Insert Operation
    const insertResult = await connection.query(
      'INSERT INTO sensitive_data (hash, title) VALUES (?, ?)',
      [hashedSensitiveData, title]
    );

    await connection.commit();

    // Fetch the inserted record
    const [insertedData] = await connection.query(
      'SELECT id, hash, title, created_at, updated_at FROM sensitive_data WHERE id = ?',
      [insertResult.insertId]
    );

    // Convert BigInt values to strings
    const data = Object.fromEntries(
      Object.entries(insertedData).map(([key, value]) => {
        if (typeof value === 'bigint') {
          return [key, value.toString()];
        }
        return [key, value];
      })
    );

    return NextResponse.json(
      {
        message: 'Data inserted successfully',
        data: data,
      },
      { status: 201 }
    );
  } catch (error) {
    if (connection) await connection.rollback();
    console.error('Database Insert Error:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  } finally {
    if (connection) connection.release();
  }
}