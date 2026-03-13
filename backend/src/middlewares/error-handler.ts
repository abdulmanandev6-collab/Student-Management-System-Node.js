import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { fail } from '../utils/response.js';

// Centralized error handler for the API
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ZodError) {
    return fail(res, 'Validation error', 422, 'VALIDATION_ERROR', err.flatten());
  }

  if (err?.name === 'UnauthorizedError') {
    return fail(res, 'Unauthorized', 401, 'UNAUTHORIZED');
  }

  if (err?.isUniqueViolation) {
    return fail(res, 'Conflict: duplicate value', 409, 'CONFLICT');
  }

  if (err?.isForeignKeyViolation) {
    return fail(res, 'Related resource not found', 400, 'FOREIGN_KEY_VIOLATION');
  }

  console.error('Unhandled error', err);
  return fail(res, 'Internal server error', 500, 'INTERNAL_SERVER_ERROR');
}

