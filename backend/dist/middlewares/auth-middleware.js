import { verifyAccessToken } from '../utils/jwt.js';
import { fail } from '../utils/response.js';
export function requireAuth(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        const bearerToken = authHeader?.startsWith('Bearer ')
            ? authHeader.slice('Bearer '.length)
            : undefined;
        const cookieToken = (req.cookies ?? {})['access_token'];
        const token = bearerToken ?? cookieToken;
        if (!token) {
            return fail(res, 'Authentication required', 401, 'UNAUTHENTICATED');
        }
        const payload = verifyAccessToken(token);
        req.user = payload;
        return next();
    }
    catch (err) {
        return fail(res, 'Invalid or expired token', 401, 'UNAUTHENTICATED');
    }
}
export function requireRole(allowed) {
    return (req, res, next) => {
        if (!req.user) {
            return fail(res, 'Authentication required', 401, 'UNAUTHENTICATED');
        }
        if (!allowed.includes(req.user.role)) {
            return fail(res, 'Forbidden', 403, 'FORBIDDEN');
        }
        return next();
    };
}
