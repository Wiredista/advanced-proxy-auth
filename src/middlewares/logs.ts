import { type Request, type Response, type NextFunction } from 'express';
import sqlite from 'bun:sqlite'
import path from 'path';

const db = sqlite.open('db.sqlite')
db.exec(`
    CREATE TABLE IF NOT EXISTS access_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        ip TEXT NOT NULL,
        timestamp TEXT NOT NULL
    )
    `)

const recentActivity: Record<string, any> = {}
setInterval(() => {
    for(const ip in recentActivity) {
        if(recentActivity[ip] < new Date(Date.now() - 1000 * 60 * 5)) {
            delete recentActivity[ip];
        }
    }
}, 1000 * 60 * 5);

export const logsMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip;
    const time = new Date();
    
    next();

    if(!ip) return;
    if(
        recentActivity[ip] && 
        recentActivity[ip] > new Date(Date.now() - 1000 * 60 * 5)
    ) return; 

    const log = `IP: ${ip} - Timestamp: ${time.toISOString()}`;
    console.log(log);
    recentActivity[ip] = time;
    db.prepare('INSERT INTO access_logs (ip, timestamp, username) VALUES (?, ?, ?)').run(ip, time.toISOString(), res.locals.username);
}

export const accessLogsRoute = (req: Request, res: Response) => {
    if(res.locals.isAdmin) {
        const logs = db.query('SELECT * FROM access_logs').all();
        res.json(logs);
    }

    res.status(401).sendFile(path.resolve(__dirname, '../../public/error/401.html'));
}