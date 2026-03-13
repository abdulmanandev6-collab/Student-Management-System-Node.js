import type { Response } from 'express';
import { verifyPassword } from '../../utils/crypto.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../../utils/jwt.js';
import type { AppJwtPayload } from '../../shared/types.js';
import { findUserByEmail } from './auth.repository.js';
import { attachCsrfToken, generateCsrfToken } from '../../middlewares/csrf.js';
import { config } from '../../config/env.js';

const REFRESH_COOKIE_NAME = 'refresh_token';

function setRefreshCookie(res: Response, token: string) {
  res.cookie(REFRESH_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'strict',
    secure: config.nodeEnv === 'production',
    path: '/api/v1/auth'
  });
}

export function clearAuthCookies(res: Response) {
  res.clearCookie(REFRESH_COOKIE_NAME, { path: '/api/v1/auth' });
  // CSRF cookie is path '/' in our middleware
  res.clearCookie('csrf_token', { path: '/' });
}

export async function login(res: Response, email: string, password: string) {
  const user = await findUserByEmail(email);
  if (!user) {
    return null;
  }

  const ok = await verifyPassword(user.password_hash, password);
  if (!ok) {
    return null;
  }

  const payload: AppJwtPayload = {
    sub: user.id,
    email: user.email,
    role: user.role
  };

  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);
  setRefreshCookie(res, refreshToken);

  const csrfToken = generateCsrfToken();
  attachCsrfToken(res, csrfToken);

  return {
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      first_name: user.first_name,
      last_name: user.last_name
    },
    accessToken,
    csrfToken
  };
}

export async function refresh(res: Response, refreshToken: string) {
  const payload = verifyRefreshToken(refreshToken);

  const newAccessToken = signAccessToken(payload);
  const newRefreshToken = signRefreshToken(payload);
  setRefreshCookie(res, newRefreshToken);

  const csrfToken = generateCsrfToken();
  attachCsrfToken(res, csrfToken);

  return { accessToken: newAccessToken, csrfToken };
}

