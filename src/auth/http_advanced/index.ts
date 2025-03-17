import express, { Router } from 'express';
import adminRoutes from './routes';
import { httpAdvancedAuthAdminMiddleware, httpAdvancedAuthMiddleware } from './middleware';
import path from 'path';
export const router = Router();

router.use('/proxyauth-admin-ui', httpAdvancedAuthMiddleware, httpAdvancedAuthAdminMiddleware, express.static(path.join(__dirname, 'admin')));
router.use('/proxyauth-admin-api', httpAdvancedAuthMiddleware, httpAdvancedAuthAdminMiddleware, adminRoutes);

export default router;