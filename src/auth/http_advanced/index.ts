import express, { Router } from 'express';
import adminRoutes from './routes';
import { httpAdvancedAuthAdminMiddleware, httpAdvancedAuthMiddleware, isAdmin } from './middleware';
export const router = Router();

router.get('/api-proxyauth-admin/am-i-admin', (req, res) => {
    if (isAdmin(req)) res.status(200).send('Yes, you are an admin');
    else res.status(403).send('No, you are not an admin');
});
router.use('/api-proxyauth-admin', httpAdvancedAuthMiddleware, httpAdvancedAuthAdminMiddleware, adminRoutes);

export default router;