# 🚀 FitFeast Deployment Guide

## Local Development

### Prerequisites
```bash
Node.js 18+ | PostgreSQL | npm/yarn
```

### Quick Start

```bash
# Clone repo
git clone https://github.com/yourname/fitfeast
cd fitfeast

# Install all dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with:
# DATABASE_URL=your_postgres_connection
# JWT_SECRET=your_secret_key
# OPENAI_API_KEY=optional_for_ai_features

# Run migrations
npm run db:push

# Start dev server (backend + frontend)
npm run dev

# Visit:
# Frontend: http://localhost:5173
# Backend: http://localhost:5000
```

---

## Replit Deployment (Recommended)

### 1. Fork on Replit
- Go to [https://replit.com](https://replit.com)
- Fork this repository
- Replit auto-detects Node.js + PostgreSQL

### 2. Add Environment Variables
```
Secrets tab → Add secrets:
- DATABASE_URL = (Replit auto-provides)
- JWT_SECRET = random_string_here
- OPENAI_API_KEY = sk-... (optional)
```

### 3. Deploy
```
Click "Run"
→ Backend: https://fitfeast-yourname.replit.dev
→ Frontend: https://fitfeast-yourname.replit.dev:5173
```

**Done!** Your app is live in 2 minutes ✅

---

## Production Deployment (Separate Services)

### Architecture
```
Frontend (Vercel/Netlify)
         ↓
     API Gateway
         ↓
Backend (Render/Railway) → PostgreSQL (MongoDB Atlas)
```

### Step 1: Deploy Backend (Render)

```bash
# 1. Push code to GitHub
git push origin main

# 2. Go to render.com → New → Web Service
# 3. Connect GitHub repo
# 4. Fill in:
Name: fitfeast-api
Runtime: Node
Build: npm install
Start: npm run build && npm start

# 5. Add Environment Variables:
DATABASE_URL = your_postgres_connection
JWT_SECRET = your_secret_key
OPENAI_API_KEY = your_api_key (optional)
PORT = 5000

# 6. Deploy
```

**Render will provide:** `https://fitfeast-api.onrender.com`

### Step 2: Deploy Frontend (Vercel)

```bash
# 1. Push code to GitHub (ensure client/ folder present)
# 2. Go to vercel.com → New Project
# 3. Import your GitHub repo
# 4. Select Framework: Vite
# 5. Add Environment Variables:
VITE_API_URL = https://fitfeast-api.onrender.com

# 6. Deploy
```

**Vercel will provide:** `https://fitfeast-yourname.vercel.app`

### Step 3: Database Setup (PostgreSQL on Render)

```bash
# Option 1: Use Render PostgreSQL
# Render dashboard → New → PostgreSQL
# Copy connection string → Add to Backend as DATABASE_URL

# Option 2: MongoDB Atlas (if migrating from PostgreSQL)
# 1. Create account: mongodb.com/cloud/atlas
# 2. Create free cluster
# 3. Get connection string
# 4. Update connection in code
```

---

## Environment Variables Reference

### Backend (.env)
```
# Database
DATABASE_URL=postgresql://user:pass@host:5432/fitfeast

# Authentication
JWT_SECRET=your_random_secret_key_min_32_chars

# Optional: AI Features
OPENAI_API_KEY=sk-your-api-key
OPENAI_ORG_ID=org-xxxxx (optional)

# Server
PORT=5000
NODE_ENV=production
```

### Frontend (.env.local)
```
VITE_API_URL=https://fitfeast-api.onrender.com
VITE_APP_NAME=FitFeast
VITE_APP_VERSION=1.0.0
```

---

## Database Migrations

### Local
```bash
npm run db:push      # Push schema to DB
npm run db:generate  # Generate migration files
npm run db:migrate   # Run migrations
```

### Production
```bash
# Render auto-runs migrations
# But you can SSH and run manually:
render logs
```

---

## Monitoring & Maintenance

### Logs
```bash
# Render
render logs

# Vercel
vercel logs

# Replit
Check replit dashboard
```

### Performance
```
Monitor:
- Backend response times (Render)
- Frontend bundle size (Vercel)
- Database queries (PostgreSQL)

Tools:
- Render Analytics
- Vercel Analytics
- New Relic (free tier)
```

### Backups
```bash
# PostgreSQL backup (automatic on Render)
# Manual backup:
pg_dump DATABASE_URL > backup.sql

# Restore:
psql DATABASE_URL < backup.sql
```

---

## Scaling Strategy

### Phase 1: MVP (Current)
- Replit full-stack
- Single database
- No caching

### Phase 2: Optimize
- Separate frontend (Vercel)
- Separate backend (Render)
- Add Redis cache

### Phase 3: Scale
- Load balancing
- Multi-region deployment
- CDN for static assets
- Database read replicas

---

## Troubleshooting

### CORS Errors
```bash
# Backend: Check CORS config in server/routes.ts
# Frontend: Check VITE_API_URL in .env

# Solution:
# Backend: Add frontend domain to allowed origins
# Frontend: Ensure credentials: 'include' in fetch
```

### Database Connection Fails
```bash
# Test connection:
psql "your_database_url"

# Check migrations:
npm run db:push

# View schema:
SELECT * FROM information_schema.tables;
```

### Authentication Issues
```bash
# Clear cookies in browser
# Ensure JWT_SECRET is set
# Check session duration config

# Test with Postman:
POST /api/login → Check response headers
```

### Deployment Stuck
```bash
# Render:
Clear build cache → Redeploy

# Vercel:
Rebuild from dashboard

# Replit:
Stop → Run again
```

---

## Security Checklist

- [ ] JWT_SECRET is random & secure (min 32 chars)
- [ ] Database credentials are in env vars (not in code)
- [ ] CORS origin is set to production domain
- [ ] HTTPS is enabled (all platforms enforce this)
- [ ] API rate limiting is enabled
- [ ] Password hashing uses bcrypt/scrypt
- [ ] Sensitive logs are removed
- [ ] No API keys in frontend code

---

## Cost Estimates

| Service | Free Tier | Cost |
|---------|-----------|------|
| Replit | Full-stack hosting | Free (or $7/mo) |
| Render | Backend + Database | $7/mo |
| Vercel | Frontend | Free |
| MongoDB Atlas | Database (5GB) | Free |
| **Total** | | **$7/mo or Free** |

---

## Getting Help

```bash
# Check logs
npm run dev 2>&1 | tee debug.log

# Test endpoints
curl http://localhost:5000/api/health

# Database issues
npm run db:studio   # Open Drizzle Studio

# Contact support
Email: your-email@example.com
```

---

**🎉 You're now production-ready!**
