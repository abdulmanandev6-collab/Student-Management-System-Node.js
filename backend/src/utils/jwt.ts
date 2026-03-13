import jwt, { type Secret, type SignOptions } from 'jsonwebtoken';
import { config } from '../config/env.js';
import type { AppJwtPayload } from '../shared/types.js';

/** Strip JWT reserved claims so the payload can be safely re-signed with new expiry */
function extractAppPayload(decoded: AppJwtPayload): AppJwtPayload {
  const { sub, email, role } = decoded;
  return { sub, email, role };
}

export function signAccessToken(payload: AppJwtPayload): string {
  const options: SignOptions = { expiresIn: config.jwt.accessExpiresIn as any };
  return jwt.sign(extractAppPayload(payload) as unknown as object, config.jwt.accessSecret as Secret, options);
}

export function signRefreshToken(payload: AppJwtPayload): string {
  const options: SignOptions = { expiresIn: config.jwt.refreshExpiresIn as any };
  return jwt.sign(extractAppPayload(payload) as unknown as object, config.jwt.refreshSecret as Secret, options);
}

export function verifyAccessToken(token: string): AppJwtPayload {
  return jwt.verify(token, config.jwt.accessSecret as Secret) as unknown as AppJwtPayload;
}

export function verifyRefreshToken(token: string): AppJwtPayload {
  return jwt.verify(token, config.jwt.refreshSecret as Secret) as unknown as AppJwtPayload;
}


