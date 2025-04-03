import { type Request, type Response, type NextFunction } from 'express';
import sqlite from 'bun:sqlite'
import path from 'path';

const db = sqlite.open('db.sqlite')
db.exec(`
    CREATE TABLE IF NOT EXISTS access_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT,
        ip TEXT,
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

    recentActivity[ip] = time;
    db.prepare('INSERT INTO access_logs (ip, timestamp, username) VALUES (?, ?, ?)').run(ip, time.toISOString(), res.locals.username);
}

export const accessLogsRoute = (req: Request, res: Response) => {
    if(res.locals.isAdmin) {
        const logs = db.query('SELECT * FROM access_logs').all();
        res.json(logs);
        return;
    }

    res.status(401).send("Unauthorized");
}

export const clearLogsRoute = (req: Request, res: Response) => {
    if(res.locals.isAdmin) {
        db.exec('DELETE FROM access_logs');
        res.status(200).json({ message: 'Logs cleared successfully' });
        return;
    }

    res.status(401).send("Unauthorized");
}
