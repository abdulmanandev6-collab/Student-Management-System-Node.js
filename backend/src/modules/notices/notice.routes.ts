import { Router } from 'express';
import { z } from 'zod';
import { requireAuth, requireRole } from '../../middlewares/auth-middleware.js';
import { created, fail, getUserIdFromRequest, ok } from '../../utils/response.js';
import { noticeCreateSchema, noticeUpdateSchema } from './notice.schema.js';
import { addNotice, editNotice, listNotices, removeNotice } from './notice.service.js';

const router = Router();

router.use(requireAuth);

router.get('/', async (_req, res, next) => {
  try {
    const notices = await listNotices();
    return ok(res, notices);
  } catch (err) {
    return next(err);
  }
});

router.post('/', requireRole(['ADMIN', 'TEACHER']), async (req, res, next) => {
  try {
    const body = noticeCreateSchema.parse(req.body);
    const createdBy = getUserIdFromRequest(req);
    if (!createdBy) return fail(res, 'Authentication required', 401, 'UNAUTHENTICATED');
    const notice = await addNotice(createdBy, body);
    return created(res, notice);
  } catch (err) {
    return next(err);
  }
});

router.put('/:id', requireRole(['ADMIN', 'TEACHER']), async (req, res, next) => {
  try {
    const id = z.coerce.number().int().positive().parse(req.params.id);
    const body = noticeUpdateSchema.parse(req.body);
    const updated = await editNotice(id, body);
    if (!updated) return fail(res, 'Notice not found', 404, 'NOT_FOUND');
    return ok(res, updated);
  } catch (err) {
    return next(err);
  }
});

router.delete('/:id', requireRole(['ADMIN']), async (req, res, next) => {
  try {
    const id = z.coerce.number().int().positive().parse(req.params.id);
    const deleted = await removeNotice(id);
    if (!deleted) return fail(res, 'Notice not found', 404, 'NOT_FOUND');
    return ok(res, { deleted: true });
  } catch (err) {
    return next(err);
  }
});

export default router;

