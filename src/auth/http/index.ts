import { env } from 'bun';
import { type Request, type Response, type NextFunction } from 'express';
import path from 'path';

const AUTH_HTTP_USER = env.AUTH_HTTP_USERNAME || 'admin';
const AUTH_HTTP_PASS = env.AUTH_HTTP_PASSWORD || 'admin';

if (AUTH_HTTP_USER === 'admin' && AUTH_HTTP_PASS === 'admin') {
    console.warn('Warning: Using default username and password for HTTP authentication');
}

export const httpAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        res.set('WWW-Authenticate', 'Basic realm="Authorization Required"');
        return res.status(401).sendFile('/public/error/401.html', { root: path.resolve(__dirname, '../../..') });
    }

    const auth = Buffer.from(authHeader.split(' ')[1], 'base64').toString();
    const [user, pass] = auth.split(':');

    if (user === AUTH_HTTP_USER && pass === AUTH_HTTP_PASS) {
        return next();
    }

    res.set('WWW-Authenticate', 'Basic realm="Authorization Required"');
    return res.status(401).sendFile('/public/error/401.html', { root: path.resolve(__dirname, '../../..') });
}