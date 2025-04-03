import { env } from 'bun';
import express, { type Request, type Response, type NextFunction } from 'express';
import proxy from 'express-http-proxy';
import { logsMiddleware, accessLogsRoute, clearLogsRoute } from './middlewares/logs';
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

if (AUTH_MODE === 'http_webui') {
    const { router } = require('./src/middlewares/http_webui');
    app.use(router);

    const { httpWebUIAuthMiddleware } = require('./src/middlewares/http_webui/middleware');
    app.use(httpWebUIAuthMiddleware);
}

// SETTINGS
app.get('/api-proxyauth-admin/settings', (req: Request, res: Response) => {
    if(!res.locals.isAdmin) {
        res.status(401).send("Unauthorized");
        return;
    }
    res.json({
        authMode: AUTH_MODE,
        proxyHost: PROXY_HOST,
        proxyPort: PROXY_PORT,
        proxyProtocol: PROXY_PROTOCOL,
        proxyUrl: PROXY_URL,
        logAccess: env.LOG_ACCESS=="1" || env.LOG_ACCESS?.toLowerCase()=="true",
    });
});

// LOGGING
app.get('/api-proxyauth-admin/logs', accessLogsRoute);
app.delete('/api-proxyauth-admin/logs', clearLogsRoute);

app.set('trust proxy', true);
if(env.LOG_ACCESS=="1" || env.LOG_ACCESS?.toLowerCase()=="true") {
    app.use(logsMiddleware);
}

// PROXY - Expects authentication to be done before proxying
app.all('*', proxy(PROXY_URL));



// LISTEN :)
app.listen(3000, () => {
    console.log(`Proxy server is running on port ${3000}`);
    console.log(`Proxying to ${PROXY_URL}`);
});