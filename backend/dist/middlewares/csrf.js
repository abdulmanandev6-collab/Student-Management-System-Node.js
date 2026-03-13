import crypto from 'crypto';
import { fail } from '../utils/response.js';
const CSRF_COOKIE_NAME = 'csrf_token';
const CSRF_HEADER_NAME = 'x-csrf-token';
export function generateCsrfToken() {
    return crypto.randomBytes(32).toString('hex');
}
export function attachCsrfToken(res, token) {
    res.cookie(CSRF_COOKIE_NAME, token, {
        httpOnly: false,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
        path: '/'
    });
}
export function csrfProtection(req, res, next) {
    if (req.method === 'GET' || req.method === 'HEAD' || req.method === 'OPTIONS') {
        return next();
    }
    const csrfCookie = (req.cookies ?? {})[CSRF_COOKIE_NAME];
    const csrfHeader = req.headers[CSRF_HEADER_NAME];
    if (!csrfCookie || !csrfHeader || csrfCookie !== csrfHeader) {
        return fail(res, 'Invalid CSRF token', 403, 'CSRF_INVALID');
    }
    return next();
}
