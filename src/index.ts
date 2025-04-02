import { env } from 'bun';
import express, { type Request, type Response, type NextFunction } from 'express';
import proxy from 'express-http-proxy';
import { logsMiddleware, accessLogsRoute } from './middlewares/logs';
import next from 'next';

const isDevelopment = env.NODE_ENV !== 'production';

const app = express();
const nextApp = next({ dev: isDevelopment });

const handle = nextApp.getRequestHandler() as any;
await nextApp.prepare();

// PROXY CONFIG
const PROXY_HOST = env.PROXY_HOST || 'app';
const PROXY_PORT = env.PROXY_PORT || '80';
const PROXY_PROTOCOL = env.PROXY_PROTOCOL || 'http';

const PROXY_URL = `${PROXY_PROTOCOL}://${PROXY_HOST}:${PROXY_PORT}`;

app.all('/proxyauth*', (req: Request, res: Response) => {
    return handle(req, res);
});

// AUTHENTICATION MODES
const AUTH_MODE = env.AUTH_MODE || 'none';

if (AUTH_MODE === 'http') { 
    const { httpAuthMiddleware } = require('./auth/http');
    app.use(httpAuthMiddleware);
}

if (AUTH_MODE === 'http_advanced') {
    const { router } = require('./auth/http_advanced');
    app.use(router);

    const { httpAdvancedAuthMiddleware } = require('./auth/http_advanced/middleware');
    app.use(httpAdvancedAuthMiddleware);
}

if (AUTH_MODE === 'http_webui') {
    const { router } = require('./auth/http_webui');
    app.use(router);

    const { httpWebUIAuthMiddleware } = require('./auth/http_webui/middleware');
    app.use(httpWebUIAuthMiddleware);
}

// PROXY - Expects authentication to be done before proxying
app.set('trust proxy', true);

if(env.LOG_ACCESS=="1" || env.LOG_ACCESS?.toLowerCase()=="true") {
    app.use(logsMiddleware);
    app.get('/proxyauth/logs', accessLogsRoute);
}

app.all('*', proxy(PROXY_URL));



// LISTEN :)
app.listen(3000, () => {
    console.log(`Proxy server is running on port ${3000}`);
    console.log(`Proxying to ${PROXY_URL}`);
});