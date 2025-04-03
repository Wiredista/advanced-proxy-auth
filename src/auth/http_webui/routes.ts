import express from 'express';
import sqlite from 'bun:sqlite'

const db = sqlite.open('db.sqlite')
db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        password TEXT NOT NULL
    )
    `)


export const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

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
    const { username, password } = req.body;
    if (!username || !password) { 
        res.status(400).send('Bad Request');
        return;
    }

    const hashedPassword = Bun.password.hashSync(password);
    const user = db.prepare('INSERT INTO users (username, password) VALUES (?, ?)').run(username, hashedPassword);
    res.json(user);
});

router.delete('/users/:id', (req, res) => {
    const { id } = req.params;
    db.prepare('DELETE FROM users WHERE id = ?').run(id);
    res.status(204).send();
});

export default router;