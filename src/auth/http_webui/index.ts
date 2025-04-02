import express, { Router } from 'express';
import adminRoutes from './routes';
import { httpWebUIAuthAdminMiddleware, httpWebUIAuthMiddleware, loginRoute } from './middleware';
import path from 'path';

export const router = Router();

router.post('/proxyauth-login', express.urlencoded({ extended: true }), loginRoute);
router.use('/proxyauth-admin-api', httpWebUIAuthMiddleware, httpWebUIAuthAdminMiddleware, adminRoutes);

export default router;