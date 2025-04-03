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

// CRUD operations for users
router.get('/users', (req, res) => {
    const users = db.query('SELECT * FROM users').all();
    res.json(users);
});

router.get('/users/:id', (req, res) => {
    const { id } = req.params;
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
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
    res.json(user);
});

router.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const { username, password, name } = req.body;

    if (!username || !name || (password === undefined)) {
        res.status(400).send('Bad Request');
        return;
    }

    const hashedPassword = password ? Bun.password.hashSync(password) : undefined;
    const updateQuery = `
        UPDATE users
        SET username = ?, name = ?, password = COALESCE(?, password)
        WHERE id = ?
    `;
    db.prepare(updateQuery).run(username, name, hashedPassword, id);
    res.status(200).send('User updated successfully');
});

router.delete('/users/:id', (req, res) => {
    const { id } = req.params;
    db.prepare('DELETE FROM users WHERE id = ?').run(id);
    res.status(204).send();
});

export default router;