# ScienceHub — React frontend + Flask backend

This repository template contains a complete **React (Vite) frontend** with routing, dark/light theme, images placeholders, and a small **Flask backend** (SQLite) that stores subscribers and provides a simple admin editor for articles. It’s ready to run locally and to deploy: the frontend can be hosted on GitHub Pages / Netlify / Vercel; the backend can be hosted on Render/Heroku or any VPS.

---

## Project structure

```
sciencehub/
├─ frontend/                # React + Vite app (deployable static site)
│  ├─ index.html
│  ├─ package.json
│  ├─ vite.config.js
│  ├─ postcss.config.js
│  ├─ tailwind.config.cjs
│  ├─ src/
│  │  ├─ main.jsx
│  │  ├─ App.jsx
│  │  ├─ pages/
│  │  │  ├─ Home.jsx
│  │  │  ├─ Article.jsx
│  │  │  └─ Admin.jsx
│  │  ├─ components/
│  │  │  ├─ Header.jsx
│  │  │  ├─ ArticleCard.jsx
│  │  │  └─ Editor.jsx
│  │  ├─ hooks/useDarkMode.jsx
│  │  └─ styles/index.css
│  └─ public/images/        # placeholder diagrams and images
├─ backend/                 # Flask API + SQLite
│  ├─ app.py
│  ├─ models.py
│  ├─ schema_init.py
│  ├─ requirements.txt
│  └─ .env.example
├─ README.md
└─ LICENSE
```

---

> **NOTE:** The files below are full source snippets. Save each snippet into its path in the project structure.

---

## Frontend

### `frontend/package.json`

```json
{
  "name": "sciencehub-frontend",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.15.0",
    "axios": "^1.4.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.0.0",
    "autoprefixer": "^10.4.14",
    "postcss": "^8.4.23",
    "tailwindcss": "^3.4.7",
    "vite": "^5.2.0"
  }
}
```


### `frontend/vite.config.js`

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: { port: 5173 }
})
```


### `frontend/index.html`

```html
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>ScienceHub</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```


### `frontend/src/main.jsx`

```jsx
import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './styles/index.css'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
```


### `frontend/src/App.jsx`

```jsx
import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Article from './pages/Article'
import Admin from './pages/Admin'
import Header from './components/Header'

export default function App(){
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <Header />
      <main className="max-w-5xl mx-auto p-4">
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/article/:id" element={<Article/>} />
          <Route path="/admin/*" element={<Admin/>} />
        </Routes>
      </main>
    </div>
  )
}
```


### `frontend/src/hooks/useDarkMode.jsx`

```jsx
import { useEffect, useState } from 'react'

export default function useDarkMode(){
  const [dark, setDark] = useState(()=>{
    const val = localStorage.getItem('sh_dark')
    return val ? JSON.parse(val) : true
  })

  useEffect(()=>{
    localStorage.setItem('sh_dark', JSON.stringify(dark))
    if(dark) document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')
  },[dark])

  return [dark, setDark]
}
```


### `frontend/src/components/Header.jsx`

```jsx
import React from 'react'
import { Link } from 'react-router-dom'
import useDarkMode from '../hooks/useDarkMode'

export default function Header(){
  const [dark, setDark] = useDarkMode()
  return (
    <header className="bg-slate-800/60 backdrop-blur sticky top-0 z-30">
      <div className="max-w-5xl mx-auto p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-teal-300 to-sky-400 rounded-md flex items-center justify-center font-bold text-slate-900">SH</div>
          <div>
            <Link to="/" className="font-semibold">ScienceHub</Link>
            <div className="text-sm text-slate-400">Clear explainers & diagrams</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/" className="text-slate-300 hover:text-white">Home</Link>
          <Link to="/admin" className="text-slate-300 hover:text-white">Admin</Link>
          <button
            onClick={()=>setDark(!dark)}
            className="px-3 py-1 rounded-md bg-slate-700 text-sm"
          >{dark? 'Light' : 'Dark'}</button>
        </div>
      </div>
    </header>
  )
}
```


### `frontend/src/components/ArticleCard.jsx`

```jsx
import React from 'react'
import { Link } from 'react-router-dom'

export default function ArticleCard({a}){
  return (
    <article className="p-4 bg-slate-800/40 rounded-md flex gap-4">
      <div className="w-28 h-20 bg-slate-700 rounded-md flex items-center justify-center text-slate-300">{a.topic}</div>
      <div className="flex-1">
        <Link to={`/article/${a.id}`} className="font-semibold text-lg">{a.title}</Link>
        <p className="text-sm text-slate-400 mt-1">{a.excerpt}</p>
      </div>
    </article>
  )
}
```


### `frontend/src/pages/Home.jsx`

```jsx
import React, {useEffect, useState} from 'react'
import axios from 'axios'
import ArticleCard from '../components/ArticleCard'

export default function Home(){
  const [articles, setArticles] = useState([])
  const [q, setQ] = useState('')

  useEffect(()=>{ fetchArticles() },[])

  async function fetchArticles(){
    try{
      const res = await axios.get('/api/articles')
      setArticles(res.data)
    }catch(err){
      // fallback: sample content
      setArticles(window.__SAMPLE_ARTICLES || [])
    }
  }

  const filtered = articles.filter(a=> (a.title + a.excerpt + a.topic).toLowerCase().includes(q.toLowerCase()))

  return (
    <div>
      <div className="mb-4 flex gap-3">
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search articles..." className="flex-1 p-2 rounded-md bg-slate-700/40" />
        <input type="email" id="email-sub" placeholder="you@example.com" className="p-2 rounded-md bg-slate-700/40" />
        <button onClick={async()=>{const email=document.getElementById('email-sub').value; await axios.post('/api/subscribe',{email}); alert('Subscribed (demo)')}} className="px-3 py-2 bg-emerald-400 rounded-md text-slate-900">Subscribe</button>
      </div>

      <div className="grid gap-3">
        {filtered.map(a=> <ArticleCard key={a.id} a={a}/>)}
      </div>
    </div>
  )
}
```


### `frontend/src/pages/Article.jsx`

```jsx
import React, {useEffect, useState} from 'react'
import {useParams} from 'react-router-dom'
import axios from 'axios'

export default function Article(){
  const {id} = useParams()
  const [a, setA] = useState(null)

  useEffect(()=>{ if(id) load() },[id])
  async function load(){
    try{
      const res = await axios.get('/api/articles/' + id)
      setA(res.data)
    }catch(err){
      // fallback
      const sample = (window.__SAMPLE_ARTICLES||[]).find(x=>String(x.id)===String(id))
      setA(sample)
    }
  }

  if(!a) return <div>Loading...</div>
  return (
    <article>
      <h1 className="text-2xl font-bold">{a.title}</h1>
      <div className="text-sm text-slate-400 mb-4">Topic: {a.topic}</div>
      <div className="prose dark:prose-invert" dangerouslySetInnerHTML={{__html: a.content}} />
    </article>
  )
}
```


### `frontend/src/components/Editor.jsx`

```jsx
import React, {useState, useEffect} from 'react'
import axios from 'axios'

export default function Editor(){
  const [title,setTitle] = useState('')
  const [topic,setTopic] = useState('Physics')
  const [content,setContent] = useState('')

  async function save(){
    await axios.post('/api/admin/articles',{title,topic,content})
    alert('Saved')
  }

  return (
    <div className="space-y-3">
      <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title" className="w-full p-2 rounded-md bg-slate-700/40" />
      <input value={topic} onChange={e=>setTopic(e.target.value)} placeholder="Topic" className="w-full p-2 rounded-md bg-slate-700/40" />
      <textarea value={content} onChange={e=>setContent(e.target.value)} rows={10} className="w-full p-2 rounded-md bg-slate-700/40" />
      <div><button onClick={save} className="px-3 py-2 bg-sky-400 text-slate-900 rounded-md">Save Article</button></div>
    </div>
  )
}
```


### `frontend/src/pages/Admin.jsx`

```jsx
import React, {useEffect, useState} from 'react'
import axios from 'axios'
import Editor from '../components/Editor'

export default function Admin(){
  const [auth, setAuth] = useState(localStorage.getItem('sh_token'))
  const [articles, setArticles] = useState([])

  useEffect(()=>{ if(auth) load() },[auth])
  async function load(){
    const res = await axios.get('/api/admin/articles', {headers: {Authorization: `Bearer ${auth}`}})
    setArticles(res.data)
  }

  if(!auth) return (
    <div className="max-w-md">
      <h2 className="text-xl font-semibold">Admin login</h2>
      <button onClick={async()=>{const res = await axios.post('/api/admin/login',{username:'admin',password:'password'}); localStorage.setItem('sh_token', res.data.token); setAuth(res.data.token)}} className="mt-3 px-3 py-2 bg-emerald-400 rounded-md text-slate-900">Login (demo)</button>
    </div>
  )

  return (
    <div>
      <h2 className="text-xl font-semibold">Admin</h2>
      <div className="mt-3">
        <Editor />
      </div>
      <div className="mt-6">
        <h3 className="font-semibold">Existing articles</h3>
        <ul className="mt-2 space-y-2">
          {articles.map(a=> <li key={a.id} className="p-2 bg-slate-800/30 rounded-md">{a.title}</li>)}
        </ul>
      </div>
    </div>
  )
}
```


### `frontend/src/styles/index.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root { --bg: #071024 }
html.dark { background: #05060a }
body { background: var(--bg) }

/* small prose support */
.prose { color: #dbeafe }
```


### `frontend/tailwind.config.cjs`

```js
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [],
}
```


### `frontend/postcss.config.js`

```js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  }
}
```


### Sample static fallback data

At the top of `frontend/index.html` you may add a small script exposing `window.__SAMPLE_ARTICLES` so the frontend still shows things if the backend isn't running. Use the same article objects created earlier.

---

## Backend (Flask)

### `backend/requirements.txt`

```
Flask==2.4.1
Flask-Cors==4.0.0
python-dotenv==1.0.0
SQLAlchemy==2.0.22
passlib==1.7.4
```


### `backend/schema_init.py` (create DB and seed)

```py
from sqlalchemy import create_engine, text
engine = create_engine('sqlite:///sciencehub.db', future=True)
with engine.connect() as c:
    c.execute(text('''
    CREATE TABLE IF NOT EXISTS articles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      topic TEXT,
      excerpt TEXT,
      content TEXT
    )
    '''))
    c.execute(text('''
    CREATE TABLE IF NOT EXISTS subscribers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE
    )
    '''))
    c.execute(text('''
    CREATE TABLE IF NOT EXISTS admins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password_hash TEXT
    )
    '''))
    # seed admin (password: password) - hashed using passlib
    from passlib.hash import bcrypt
    h = bcrypt.hash('password')
    try:
        c.execute(text("INSERT INTO admins (username,password_hash) VALUES ('admin', :h)"),{'h':h})
    except Exception:
        pass
    c.commit()
print('DB ready')
```


### `backend/app.py`

```py
from flask import Flask, jsonify, request
from flask_cors import CORS
from sqlalchemy import create_engine, text
from passlib.hash import bcrypt
import os

app = Flask(__name__)
CORS(app)
DB_URL = os.environ.get('DATABASE_URL', 'sqlite:///sciencehub.db')
engine = create_engine(DB_URL, future=True)

# Public API
@app.route('/api/articles')
def list_articles():
    with engine.connect() as c:
        rows = c.execute(text('SELECT id,title,topic,excerpt FROM articles ORDER BY id DESC')).mappings().all()
        return jsonify([dict(r) for r in rows])

@app.route('/api/articles/<int:id>')
def get_article(id):
    with engine.connect() as c:
        r = c.execute(text('SELECT * FROM articles WHERE id=:id'),{'id':id}).mappings().first()
        return jsonify(dict(r)) if r else ('',404)

@app.route('/api/subscribe', methods=['POST'])
def subscribe():
    data = request.get_json() or {}
    email = data.get('email')
    if not email: return ('',400)
    with engine.connect() as c:
        try:
            c.execute(text('INSERT INTO subscribers (email) VALUES (:email)'),{'email':email})
            c.commit()
        except Exception:
            pass
    return ('',204)

# Simple admin (token is returned on login; token = username for demo)
@app.route('/api/admin/login', methods=['POST'])
def admin_login():
    data = request.get_json() or {}
    u = data.get('username')
    p = data.get('password')
    if not u or not p: return ('',400)
    with engine.connect() as c:
        row = c.execute(text('SELECT * FROM admins WHERE username=:u'),{'u':u}).mappings().first()
        if not row or not bcrypt.verify(p, row['password_hash']):
            return ('',401)
        token = u  # DO NOT use this in production; replace with JWT
        return jsonify({'token': token})

# Protected admin endpoints (very simple token check)
def check_auth():
    auth = request.headers.get('Authorization','')
    if auth.startswith('Bearer '):
        token = auth.split(' ',1)[1]
        # demo: token must match an admin username
        with engine.connect() as c:
            r = c.execute(text('SELECT * FROM admins WHERE username=:u'),{'u':token}).mappings().first()
            return bool(r)
    return False

@app.route('/api/admin/articles', methods=['GET','POST'])
def admin_articles():
    if request.method=='GET':
        if not check_auth(): return ('',401)
        with engine.connect() as c:
            rows = c.execute(text('SELECT * FROM articles ORDER BY id DESC')).mappings().all()
            return jsonify([dict(r) for r in rows])
    else:
        if not check_auth(): return ('',401)
        data = request.get_json() or {}
        with engine.connect() as c:
            c.execute(text('INSERT INTO articles (title,topic,excerpt,content) VALUES (:title,:topic,:excerpt,:content)'),{
                'title':data.get('title'), 'topic':data.get('topic'), 'excerpt': (data.get('excerpt') or '')[:250], 'content': data.get('content')
            })
            c.commit()
        return ('',201)

if __name__=='__main__':
    app.run(debug=True, port=int(os.environ.get('PORT',5000)))
```


### `backend/.env.example`

```
DATABASE_URL=sqlite:///sciencehub.db
FLASK_ENV=development
```


### How backend works

- SQLite DB `sciencehub.db` contains `articles`, `subscribers`, `admins`.
- `schema_init.py` creates tables and seeds an admin with username `admin` and password `password` (hashed) for demo.
- `app.py` exposes endpoints used by the React frontend.
- **Security note:** This setup uses a demo token (username) and no production JWTs — replace with proper auth for real deployments.

---

## README (top-level) — `README.md`

```md
# ScienceHub

Demo full-stack site: React frontend (Vite + Tailwind) + Flask backend (SQLite). Ready for local development and deployment.

## Local setup

### Backend

1. `cd backend`
2. `python -m venv .venv && source .venv/bin/activate` (or use Windows venv activation)
3. `pip install -r requirements.txt`
4. `python schema_init.py`  # creates `sciencehub.db` and seeds admin
5. `python app.py`

### Frontend

1. `cd frontend`
2. `npm install`
3. `npm run dev`  # open http://localhost:5173

The frontend expects API endpoints at `/api/*`. For local development you can run both and use a proxy or configure CORS (the Flask app already allows CORS).

## Deployment

- Frontend: `npm run build` and deploy the `dist/` to GitHub Pages, Netlify or Vercel.
- Backend: host on Render / Heroku / DigitalOcean and set `DATABASE_URL` appropriately. Use HTTPS and a proper secret and token-based auth for production.

## License

MIT
```

---

## LICENSE (MIT)

```
MIT License

Copyright (c) 2025

Permission is hereby granted, free of charge, to any person obtaining a copy
... (standard MIT text) ...
```

---

## Next steps I can do for you (pick any):
1. Create a GitHub repo structure and ZIP the project for download.
2. Convert the backend to Node/Express instead of Flask if you prefer JavaScript everywhere.
3. Add JWT authentication, image uploads (S3), and WYSIWYG editor for admins (TipTap or Quill).
4. Deploy a demo to a free hosting provider (Netlify + Render) and share the live URL.

Tell me which of the next steps you want; I already prepared the full code in this document so you can copy it into files.

