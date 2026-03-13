import { Router } from 'express';
import authRoutes from '../modules/auth/auth.routes.js';
import studentRoutes from '../modules/students/student.routes.js';
import noticeRoutes from '../modules/notices/notice.routes.js';
import { csrfProtection } from '../middlewares/csrf.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/students', csrfProtection, studentRoutes);
router.use('/notices', csrfProtection, noticeRoutes);

export default router;

