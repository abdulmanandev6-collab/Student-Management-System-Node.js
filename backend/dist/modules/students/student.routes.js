import { Router } from 'express';
import { z } from 'zod';
import { requireAuth, requireRole } from '../../middlewares/auth-middleware.js';
import { created, fail, ok } from '../../utils/response.js';
import { studentCreateSchema, studentUpdateSchema } from './student.schema.js';
import { addStudent, editStudent, generateStudentReport, getStudent, listStudents, removeStudent } from './student.service.js';
const router = Router();
router.use(requireAuth);
router.get('/', async (_req, res, next) => {
    try {
        const students = await listStudents();
        return ok(res, students);
    }
    catch (err) {
        return next(err);
    }
});
router.get('/:id', async (req, res, next) => {
    try {
        const id = z.coerce.number().int().positive().parse(req.params.id);
        const student = await getStudent(id);
        if (!student)
            return fail(res, 'Student not found', 404, 'NOT_FOUND');
        return ok(res, student);
    }
    catch (err) {
        return next(err);
    }
});
router.post('/', requireRole(['ADMIN', 'TEACHER']), async (req, res, next) => {
    try {
        const body = studentCreateSchema.parse(req.body);
        const createdStudent = await addStudent(body);
        return created(res, createdStudent);
    }
    catch (err) {
        return next(err);
    }
});
router.put('/:id', requireRole(['ADMIN', 'TEACHER']), async (req, res, next) => {
    try {
        const id = z.coerce.number().int().positive().parse(req.params.id);
        const body = studentUpdateSchema.parse(req.body);
        const updated = await editStudent(id, body);
        if (!updated)
            return fail(res, 'Student not found', 404, 'NOT_FOUND');
        return ok(res, updated);
    }
    catch (err) {
        return next(err);
    }
});
router.delete('/:id', requireRole(['ADMIN']), async (req, res, next) => {
    try {
        const id = z.coerce.number().int().positive().parse(req.params.id);
        const deleted = await removeStudent(id);
        if (!deleted)
            return fail(res, 'Student not found', 404, 'NOT_FOUND');
        return ok(res, { deleted: true });
    }
    catch (err) {
        return next(err);
    }
});
router.get('/:id/report', requireAuth, async (req, res, next) => {
    try {
        const id = z.coerce.number().int().positive().parse(req.params.id);
        const buffer = await generateStudentReport(id);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=student-report-${id}.pdf`);
        res.send(buffer);
    }
    catch (err) {
        return next(err);
    }
});
export default router;
