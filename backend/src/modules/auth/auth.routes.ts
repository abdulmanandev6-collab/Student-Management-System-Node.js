import { Router } from 'express';
import { loginSchema } from './auth.schema.js';
import { clearAuthCookies, login, refresh } from './auth.service.js';
import { ok, fail } from '../../utils/response.js';

const router = Router();

router.post('/login', async (req, res, next) => {
  try {
    const body = loginSchema.parse(req.body);
    const result = await login(res, body.email, body.password);
    if (!result) {
      return fail(res, 'Invalid email or password', 401, 'INVALID_CREDENTIALS');
    }
    return ok(res, result);
  } catch (err) {
    return next(err);
  }
});

router.post('/logout', (req, res) => {
  clearAuthCookies(res);
  return ok(res, { message: 'Logged out' });
});

router.get('/refresh', async (req, res, next) => {
  try {
    const token = (req.cookies ?? {})['refresh_token'] as string | undefined;
    if (!token) {
      return fail(res, 'Refresh token missing', 401, 'UNAUTHENTICATED');
    }
    const result = await refresh(res, token);
    return ok(res, result);
  } catch (err) {
    return next(err);
  }
});

export default router;

