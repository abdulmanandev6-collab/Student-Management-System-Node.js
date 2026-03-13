import type { Request, Response } from 'express';

interface SuccessResponse<T> {
  success: true;
  data: T;
}

interface ErrorResponse {
  success: false;
  error: {
    message: string;
    code?: string;
    details?: unknown;
  };
}

export function ok<T>(res: Response, data: T, statusCode = 200): Response<SuccessResponse<T>> {
  return res.status(statusCode).json({ success: true, data });
}

export function created<T>(res: Response, data: T): Response<SuccessResponse<T>> {
  return ok(res, data, 201);
}

export function fail(
  res: Response,
  message: string,
  statusCode = 400,
  code?: string,
  details?: unknown
): Response<ErrorResponse> {
  return res.status(statusCode).json({
    success: false,
    error: { message, code, details }
  });
}

export function getUserIdFromRequest(req: Request): number | null {
  const anyReq = req as any;
  return anyReq.user?.sub ?? null;
}

