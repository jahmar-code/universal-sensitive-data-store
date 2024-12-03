/**
 * For performing CRUD operations on a specific row in the sensitive_data table.
 * 
 * Here's an example of what API to call for GET on the row with an id of 1: http://localhost:3000/api/sensitiveData/1
 */


import { NextRequest, NextResponse } from 'next/server';
import fixedWindowRateLimiter from '@/app/lib/fixedWindowRateLimiter';
import { getClientIp, handleError } from '@/app/lib/utils';
import { z } from 'zod';
import argon2 from 'argon2';
import { getConnection } from '@/app/lib/db';
import { SensitiveData, ResponseData } from '@/app/types/types';
import { ValidationError, NotFoundError } from '@/app/lib/errors';

const rateLimiter = fixedWindowRateLimiter({
  interval: 10 * 1000, // 10 second interval
  maxTokens: 100,       // Max 100 requests per interval (It's on a single databse row so throughput cost is low)
});

const updateDataSchema = z.object({
  preHash: z.string().min(1).optional(),
  title: z.string().max(255).optional(),
});

/**
 * GET /api/sensitiveData/id
 * Retrieves a sensitive data record by ID.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const clientIp = getClientIp(request);
    await rateLimiter(clientIp);

    const connection = await getConnection(clientIp);

    const [row] = await connection.query(
      'SELECT id, title, created_at, updated_at FROM sensitive_data WHERE id = ?',
      [params.id]
    );
    connection.release();

    if (!row) {
      throw new NotFoundError();
    }

    const data: SensitiveData = {
      ...row,
      id: row.id.toString(),
    };

    const response: ResponseData<SensitiveData> = {
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
 * PUT /api/sensitiveData/:id
 * Updates a sensitive data record by ID.
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const clientIp = getClientIp(request);
    await rateLimiter(clientIp);

    const body = await request.json();
    const parseResult = updateDataSchema.safeParse(body);

    if (!parseResult.success) {
      throw new ValidationError(parseResult.error.errors[0].message);
    }

    const { preHash, title } = parseResult.data;

    if (!preHash && !title) {
      throw new ValidationError('No data provided to update');
    }

    const connection = await getConnection(clientIp);
    await connection.beginTransaction();

    const updateFields: string[] = [];
    const updateValues: any[] = [];

    if (preHash) {
      const hash = await argon2.hash(preHash, {
        type: argon2.argon2id,
        memoryCost: 2 ** 16,
        timeCost: 4,
        parallelism: 2,
      });
      updateFields.push('hash = ?');
      updateValues.push(hash);
    }

    if (title) {
      updateFields.push('title = ?');
      updateValues.push(title);
    }

    updateValues.push(params.id);

    const updateResult = await connection.query(
      `UPDATE sensitive_data SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );

    if (updateResult.affectedRows === 0) {
      await connection.rollback();
      connection.release();
      throw new NotFoundError();
    }

    const [updatedData] = await connection.query(
      'SELECT id, title, created_at, updated_at FROM sensitive_data WHERE id = ?',
      [params.id]
    );

    await connection.commit();
    connection.release();

    if (!updatedData) {
      throw new NotFoundError('Record not found after update');
    }

    const data: SensitiveData = {
      ...updatedData,
      id: updatedData.id.toString(),
    };

    const response: ResponseData<SensitiveData> = {
      message: 'Data updated successfully',
      data,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    const { message, status } = handleError(error);
    return NextResponse.json({ message }, { status });
  }
}

/**
 * DELETE /api/sensitiveData/:id
 * Deletes a sensitive data record by ID.
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const clientIp = getClientIp(request);
    await rateLimiter(clientIp);

    const connection = await getConnection(clientIp);
    await connection.beginTransaction();

    const deleteResult = await connection.query(
      'DELETE FROM sensitive_data WHERE id = ?',
      [params.id]
    );

    if (deleteResult.affectedRows === 0) {
      await connection.rollback();
      connection.release();
      throw new NotFoundError();
    }

    await connection.commit();
    connection.release();

    const response: ResponseData = {
      message: 'Data deleted successfully',
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    const { message, status } = handleError(error);
    return NextResponse.json({ message }, { status });
  }
}