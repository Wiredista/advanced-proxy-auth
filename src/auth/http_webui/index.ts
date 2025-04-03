import express, { Router } from 'express';
import adminRoutes from './routes';
import { httpWebUIAuthAdminMiddleware, httpWebUIAuthMiddleware, isAdmin, loginRoute } from './middleware';
import path from 'path';

export const router = Router();

router.get('/api-proxyauth-admin/am-i-admin', (req, res) => {
    if (isAdmin(req)) res.status(200).send('Yes, you are an admin');
    else res.status(403).send('No, you are not an admin');
});
router.post('/api-proxyauth-login', express.urlencoded({ extended: true }), express.json(), loginRoute);
router.use('/api-proxyauth-admin', httpWebUIAuthMiddleware, httpWebUIAuthAdminMiddleware, adminRoutes);

export default router;