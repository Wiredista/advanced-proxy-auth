import express, { Router } from 'express';
import adminRoutes from './routes';
import { httpAdvancedAuthAdminMiddleware, httpAdvancedAuthMiddleware } from './middleware';
export const router = Router();

router.use('/api-proxyauth-admin', httpAdvancedAuthMiddleware, httpAdvancedAuthAdminMiddleware, adminRoutes);

export default router;