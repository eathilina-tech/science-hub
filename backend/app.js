// app.js - Express backend for ScienceHub
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
app.use(cors());
app.use(express.json());

const DB_FILE = process.env.DATABASE_FILE || './sciencehub.db';
const JWT_SECRET = process.env.JWT_SECRET || 'change-me';
const db = new Database(DB_FILE);

// Public endpoints
app.get('/api/articles', (req, res) => {
  const rows = db.prepare('SELECT id,title,topic,excerpt FROM articles ORDER BY id DESC').all();
  res.json(rows);
});

app.get('/api/articles/:id', (req, res) => {
  const id = req.params.id;
  const row = db.prepare('SELECT * FROM articles WHERE id = ?').get(id);
  if (!row) return res.status(404).send({error:'not found'});
  res.json(row);
});

app.post('/api/subscribe', (req, res) => {
  const email = req.body.email;
  if (!email) return res.status(400).send({error:'email required'});
  try {
    db.prepare('INSERT INTO subscribers (email) VALUES (?)').run(email);
  } catch (e) { /* ignore duplicates */ }
  res.status(204).send();
});

// Admin auth (login -> JWT)
app.post('/api/admin/login', (req, res) => {
  const {username, password} = req.body || {};
  if (!username || !password) return res.status(400).send({error:'username/password required'});
  const row = db.prepare('SELECT * FROM admins WHERE username = ?').get(username);
  if (!row) return res.status(401).send({error:'invalid'});
  if (!bcrypt.compareSync(password, row.password_hash)) return res.status(401).send({error:'invalid'});
  const token = jwt.sign({sub: username}, JWT_SECRET, {expiresIn: '7d'});
  res.json({token});
});

// Middleware to check auth
function requireAuth(req, res, next) {
  const h = req.headers.authorization || '';
  if (!h.startsWith('Bearer ')) return res.status(401).send({error:'auth required'});
  const token = h.slice(7);
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (e) {
    return res.status(401).send({error:'invalid token'});
  }
}

// Admin routes
app.get('/api/admin/articles', requireAuth, (req, res) => {
  const rows = db.prepare('SELECT * FROM articles ORDER BY id DESC').all();
  res.json(rows);
});

app.post('/api/admin/articles', requireAuth, (req, res) => {
  const {title, topic, excerpt, content} = req.body || {};
  if (!title) return res.status(400).send({error:'title required'});
  db.prepare('INSERT INTO articles (title,topic,excerpt,content) VALUES (?, ?, ?, ?)').run(title, topic || '', (excerpt||'').slice(0,250), content || '');
  res.status(201).send();
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=> console.log('Server listening on', PORT));