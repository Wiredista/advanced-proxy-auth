import express, { Router } from 'express';
import adminRoutes from './routes';
import { httpAdvancedAuthAdminMiddleware, httpAdvancedAuthMiddleware } from './middleware';
export const router = Router();

router.use('/proxyauth-admin-api', httpAdvancedAuthMiddleware, httpAdvancedAuthAdminMiddleware, adminRoutes);

export default router;