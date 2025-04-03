import express from 'express';
import sqlite from 'bun:sqlite'

const db = sqlite.open('db.sqlite')
db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        name TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        password TEXT NOT NULL
    )
    `)


export const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

// CRUD operations for users
router.get('/users', (req, res) => {
    const users = db.query('SELECT id, username, name, created_at FROM users').all();
    res.json(users);
});

router.get('/users/:id', (req, res) => {
    const { id } = req.params;
    const user = db.prepare('SELECT id, username, name, created_at FROM users WHERE id = ?').get(id);
    if (!user) {
        res.status(404).send('User not found');
        return;
    }
    res.json(user);
});

router.post('/users', (req, res) => {
    const { username, password, name } = req.body;
    if (!username || !password || !name) { 
        res.status(400).send('Bad Request');
        return;
    }

    const hashedPassword = Bun.password.hashSync(password);
    const user = db.prepare('INSERT INTO users (username, password, name) VALUES (?, ?, ?)').run(username, hashedPassword, name);
    res.status(201).json({ id: user.lastInsertRowid, username, name, created_at: new Date() });
});

router.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const { username, password, name } = req.body;

    if (!username && !password && !name) {
        res.status(400).send('Bad Request');
        return;
    }

    const updates = [];
    const params = [];

    if (username) {
        updates.push('username = ?');
        params.push(username);
    }
    if (password) {
        updates.push('password = ?');
        params.push(Bun.password.hashSync(password));
    }
    if (name) {
        updates.push('name = ?');
        params.push(name);
    }

    params.push(id);

    const query = `UPDATE users SET ${updates.join(', ')} WHERE id = ?`;
    const result = db.prepare(query).run(...params);

    if (result.changes === 0) {
        res.status(404).send('User not found');
        return;
    }

    res.status(200).send('User updated successfully');
});

router.delete('/users/:id', (req, res) => {
    const { id } = req.params;
    db.prepare('DELETE FROM users WHERE id = ?').run(id);
    res.status(204).send();
});

export default router;