import type { NextFunction, Request, Response } from 'express';
import { verifyAccessToken } from '../utils/jwt.js';
import type { AuthenticatedRequestUser, Role } from '../shared/types.js';
import { fail } from '../utils/response.js';

declare module 'express-serve-static-core' {
  interface Request {
    user?: AuthenticatedRequestUser;
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    const bearerToken = authHeader?.startsWith('Bearer ')
      ? authHeader.slice('Bearer '.length)
      : undefined;
    const cookieToken = (req.cookies ?? {})['access_token'] as string | undefined;
    const token = bearerToken ?? cookieToken;

    if (!token) {
      return fail(res, 'Authentication required', 401, 'UNAUTHENTICATED');
    }

    const payload = verifyAccessToken(token);
    req.user = payload;
    return next();
  } catch (err) {
    return fail(res, 'Invalid or expired token', 401, 'UNAUTHENTICATED');
  }
}

export function requireRole(allowed: Role[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return fail(res, 'Authentication required', 401, 'UNAUTHENTICATED');
    }
    if (!allowed.includes(req.user.role)) {
      return fail(res, 'Forbidden', 403, 'FORBIDDEN');
    }
    return next();
  };
}

