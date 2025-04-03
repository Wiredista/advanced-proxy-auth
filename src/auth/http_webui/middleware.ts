import { env } from 'bun';
import express, { type Request, type Response, type NextFunction } from 'express';
import sqlite from 'bun:sqlite'
import path from 'path';
import crypto from 'crypto';

const db = sqlite.open('db.sqlite')
db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        password TEXT NOT NULL
    )
    `)

const AUTH_HTTP_USER = env.AUTH_HTTP_USERNAME || 'admin';
const AUTH_HTTP_PASS = env.AUTH_HTTP_PASSWORD || 'admin';

if (AUTH_HTTP_USER === 'admin' && AUTH_HTTP_PASS === 'admin') {
    console.warn('Warning: Using default username and password for HTTP authentication');
}

const sessions = new Map<string, string>();

export const httpWebUIAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const session = req.headers.cookie?.split(';').find((c) => c.includes('session'))?.split('=')[1];
    if(session && sessions.get(session)) {
        res.locals.username = sessions.get(session);

        if (res.locals.username === AUTH_HTTP_USER)
            res.locals.isAdmin = true;
    
        return next();
    }

    res.redirect(`/proxyauth?redirect=${encodeURIComponent(req.originalUrl)}`);
}

export const httpWebUIAuthAdminMiddleware = (req: Request, res: Response, next: NextFunction) => {
    if (res.locals.isAdmin) return next();
    res.redirect(`/proxyauth?redirect=${encodeURIComponent(req.originalUrl)}`);
}

export const loginRoute = (req: Request, res: Response) => {
    const { username, password, redirect } = req.body;
    const redirectURL = redirect || "/";
    console.log(redirectURL);
    if (!username || !password) {
        res.status(400).send('Bad Request');
        return;
    }

    if (username === AUTH_HTTP_USER && password === AUTH_HTTP_PASS) {
        res.locals.isAdmin = true;
        const token = crypto.randomBytes(16).toString('hex');
        sessions.set(token, username);
        res.cookie('session', token, { httpOnly: true });
        res.status(200).send('OK');
        return;
    }

    const userData = db.query('SELECT * FROM users WHERE username = ?').get(username) as Record<string, any>;
    if (!userData) {
        res.status(401).send('Unauthorized');
        return;
    }

    if (username && Bun.password.verifySync(password, userData.password)) {
        const token = crypto.randomBytes(16).toString('hex');
        sessions.set(token, username);
        res.cookie('session', token, { httpOnly: true });
        res.status(200).send('OK');
        return;
    }
    
    res.status(401).send('Unauthorized');
    return;
}