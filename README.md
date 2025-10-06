# ScienceHub

Full-stack demo: React (Vite + Tailwind) frontend + Node/Express backend (SQLite).
Includes articles, subscription endpoint, and a simple admin editor (JWT-based auth).

## Quick start

### Backend
```
cd backend
npm install
cp .env.example .env
# (optional) edit .env
node init_db.js    # creates sqlite database and seeds admin (username: admin, password: password)
node app.js
```

### Frontend
```
cd frontend
npm install
npm run dev
# or build: npm run build
```

The frontend expects the backend API at `/api/*`. Configure `VITE_API_URL` in `frontend/.env` if backend runs on a different host.

## Deploy
- Frontend: Netlify / Vercel / GitHub Pages (build outputs `dist`)
- Backend: Render / Heroku / DigitalOcean
