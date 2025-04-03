import express, { Router } from 'express';
import adminRoutes from './routes';
import { httpWebUIAuthAdminMiddleware, httpWebUIAuthMiddleware, loginRoute } from './middleware';
import path from 'path';

export const router = Router();

router.post('/api-proxyauth-login', express.urlencoded({ extended: true }), express.json(), loginRoute);
router.use('/api-proxyauth-admin', httpWebUIAuthMiddleware, httpWebUIAuthAdminMiddleware, adminRoutes);

export default router;