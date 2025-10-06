// init_db.js - create sqlite DB and seed sample data
const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const dbFile = process.env.DATABASE_FILE || './sciencehub.db';
const db = new Database(dbFile);

db.exec(`
CREATE TABLE IF NOT EXISTS articles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT,
  topic TEXT,
  excerpt TEXT,
  content TEXT
);
CREATE TABLE IF NOT EXISTS subscribers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE
);
CREATE TABLE IF NOT EXISTS admins (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE,
  password_hash TEXT
);
`);

const admin = db.prepare("SELECT * FROM admins WHERE username = ?").get('admin');
if (!admin) {
  const hash = bcrypt.hashSync('password', 10);
  db.prepare("INSERT INTO admins (username, password_hash) VALUES (?, ?)").run('admin', hash);
  console.log('Seeded admin with username=admin password=password');
} else {
  console.log('Admin already exists');
}

// Seed sample articles if empty
const row = db.prepare("SELECT count(*) as c FROM articles").get();
if (row.c === 0) {
  const insert = db.prepare("INSERT INTO articles (title,topic,excerpt,content) VALUES (?, ?, ?, ?)");
  const samples = [
    ['Why light can\\'t escape a black hole', 'Astronomy', 'Event horizons and gravity wells in plain language.', '<h3>Why light can\\'t escape a black hole</h3><p>Black holes curve space-time so steeply that all paths lead inward.</p>'],
    ['Introduction to Quantum Superposition','Physics','What superposition means and simple thought experiments.','<h3>Quantum superposition</h3><p>Superposition means a quantum system can be in multiple states at once until measured.</p>'],
    ['How DNA stores information','Biology','A short explainer on DNA structure and coding.','<h3>DNA and information</h3><p>DNA is a long chain of nucleotides (A,T,C,G). Sequences map to proteins.</p>']
  ];
  for (const s of samples) insert.run(...s);
  console.log('Seeded sample articles');
} else {
  console.log('Articles already present');
}
console.log('DB initialized at', dbFile);