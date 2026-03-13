import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
/** Strip JWT reserved claims so the payload can be safely re-signed with new expiry */
function extractAppPayload(decoded) {
    const { sub, email, role } = decoded;
    return { sub, email, role };
}
export function signAccessToken(payload) {
    const options = { expiresIn: config.jwt.accessExpiresIn };
    return jwt.sign(extractAppPayload(payload), config.jwt.accessSecret, options);
}
export function signRefreshToken(payload) {
    const options = { expiresIn: config.jwt.refreshExpiresIn };
    return jwt.sign(extractAppPayload(payload), config.jwt.refreshSecret, options);
}
export function verifyAccessToken(token) {
    return jwt.verify(token, config.jwt.accessSecret);
}
export function verifyRefreshToken(token) {
    return jwt.verify(token, config.jwt.refreshSecret);
}
