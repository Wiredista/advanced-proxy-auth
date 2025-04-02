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

export const httpAdvancedAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        res.set('WWW-Authenticate', 'Basic realm="Authorization Required"');
        return res.redirect(`/proxyauth/error?error=401&redirect=${encodeURIComponent(req.originalUrl)}`);
    }

    const auth = Buffer.from(authHeader.split(' ')[1], 'base64').toString();
    const [user, pass] = auth.split(':');

    // Admin user
    if (user === AUTH_HTTP_USER && pass === AUTH_HTTP_PASS) {
        res.locals.isAdmin = true;
        return next();
    }

    const session = req.headers.cookie?.split(';').find((c) => c.includes('session'))?.split('=')[1];
    if(session && sessions.get(user) === session) {
        return next();
    }

    if (!user || !pass) { // No user or password
        res.set('WWW-Authenticate', 'Basic realm="Authorization Required"');
        return res.redirect(`/proxyauth/error?error=401&redirect=${encodeURIComponent(req.originalUrl)}`);
    }

    const userData = db.query('SELECT * FROM users WHERE username = ?').get(user) as Record<string, any>;
    if (!userData) { // User not found
        res.set('WWW-Authenticate', 'Basic realm="Authorization Required"');
        return res.redirect(`/proxyauth/error?error=401&redirect=${encodeURIComponent(req.originalUrl)}`);
    }
        
    if (user && Bun.password.verifySync(pass, userData.password)) { // User and password match
        const token = crypto.randomBytes(16).toString('hex');
        sessions.set(user, token);

        res.cookie('session', token, { httpOnly: true });
        return next();
    }
    
    
    res.set('WWW-Authenticate', 'Basic realm="Authorization Required"');
    return res.redirect(`/proxyauth/error?error=401&redirect=${encodeURIComponent(req.originalUrl)}`);
}

export const httpAdvancedAuthAdminMiddleware = (req: Request, res: Response, next: NextFunction) => {
    if (res.locals.isAdmin) return next();
    return res.redirect(`/proxyauth/error?error=403&redirect=${encodeURIComponent(req.originalUrl)}`);
}