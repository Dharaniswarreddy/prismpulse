# Vercel Database Options Guide

## Quick Comparison

| Database | Type | Free Tier | Setup | MySQL Compatible | Best For |
|----------|------|-----------|-------|------------------|----------|
| **PlanetScale** | MySQL | ✅ Yes | 5 min | ✅ Yes | **BEST** - Easy migration |
| **Vercel Postgres** | PostgreSQL | ✅ Yes | 5 min | ❌ No | Native Vercel integration |
| **Supabase** | PostgreSQL | ✅ Yes | 10 min | ❌ No | Full-featured PostgreSQL |
| **Neon** | PostgreSQL | ✅ Yes | 5 min | ❌ No | Serverless PostgreSQL |
| **MongoDB Atlas** | NoSQL | ✅ Yes | 10 min | ❌ No | Document-based |
| **Firebase** | NoSQL | ✅ Yes | 10 min | ❌ No | Real-time features |

---

## **🏆 RECOMMENDED: PlanetScale**

### Why PlanetScale?
- ✅ MySQL-compatible (no code changes needed!)
- ✅ Free tier: 5GB storage
- ✅ Serverless, auto-scales
- ✅ Fast setup (< 5 minutes)
- ✅ Works everywhere (Vercel, Railway, etc.)

### Setup Steps

#### 1. Create PlanetScale Account
```bash
# Visit: https://planetscale.com/signup
# Sign up with GitHub (recommended)
```

#### 2. Create Organization & Database
- Go to dashboard
- Click "Create a new database"
- Name: `prismpulse`
- Region: Choose nearest to you
- Click "Create database"

#### 3. Get Connection String
```
# In PlanetScale dashboard:
- Click your database
- Click "Connect"
- Copy "MySQL Connection String"
# Format: mysql://user:password@host/prismpulse?sslaccept=strict
```

#### 4. Update .env File
```env
DB_HOST=your-host.us-east-2.psdb.cloud
DB_USER=xxxxx
DB_PASSWORD=pscale_pw_xxxxx
DB_NAME=prismpulse
DB_PORT=3306
NODE_ENV=production
```

#### 5. Create Table & Migrate Data
```bash
# Create table on PlanetScale
node setup-db.js

# Migrate data from SQLite
node migrate-data.js

# Verify
node server.js
```

#### 6. Deploy to Vercel
- Set environment variables in Vercel dashboard
- Push to GitHub
- Vercel auto-deploys

---

## **Alternative: Vercel Postgres**

### Advantages
- Native Vercel integration
- No separate account needed
- Works directly with Vercel dashboard

### Disadvantages
- Uses PostgreSQL (different SQL dialect)
- Requires code changes for `mysql2` → `pg` package
- More expensive than PlanetScale

### Setup
```bash
# In Vercel dashboard:
1. Go to Project > Storage
2. Click "Create Database"
3. Select "Postgres"
4. PlanetScale connection string auto-added to env vars
```

---

## **Alternative: Supabase (PostgreSQL)**

### Advantages
- Free tier: 500MB
- Built on PostgreSQL
- Real-time subscriptions
- Full auth system included
- Great dashboard

### Disadvantages
- PostgreSQL (needs code changes)
- Slower setup

### Setup
```bash
# Visit: https://supabase.com/dashboard
1. Create new project
2. Get connection URL from "Project Settings > Database"
3. Update code to use PostgreSQL instead of MySQL
```

---

## **Alternative: MongoDB Atlas (NoSQL)**

### Advantages
- Free tier: 512MB
- Document-based (flexible schema)
- Built for Node.js
- No SQL syntax needed

### Disadvantages
- Completely different data model
- Major code refactoring needed
- Slower for relational queries

### Setup
```bash
# Visit: https://www.mongodb.com/cloud/atlas
1. Create account
2. Create cluster (free tier)
3. Get connection string
4. Rewrite code to use MongoDB driver
```

---

## **Step-by-Step PlanetScale Setup (Recommended)**

### 1. Sign Up
Visit: https://planetscale.com/signup

### 2. Create Database
```
Organization name: Your name
Database name: prismpulse
Region: us-east-2 (or nearest)
```

### 3. Get Credentials
Dashboard → prismpulse database → "Connect" button

Copy this section:
```
[mysqldump]
user=[username]
password=[password]
host=[hostname]
port=3306
```

### 4. Update Project
Create `.env.production`:
```env
DB_HOST=host.psdb.cloud
DB_USER=username
DB_PASSWORD=password
DB_NAME=prismpulse
NODE_ENV=production
```

### 5. Initialize Database
```bash
# Ensure you're in project directory
cd "c:\Users\user\Documents\New project"

# Create table on PlanetScale
node setup-db.js

# Migrate data from SQLite
node migrate-data.js

# Test locally
node server.js
```

### 6. Deploy to Vercel
```bash
# Push code
git add .
git commit -m "chore: add PlanetScale database configuration"
git push origin main

# In Vercel dashboard:
# Settings > Environment Variables
# Add: DB_HOST, DB_USER, DB_PASSWORD, DB_NAME
```

---

## **Comparison: Local → Cloud**

### Current Setup (Local - Won't work on Vercel)
```
SQLite: data/agency.db (file-based, localhost only)
↓ Migrated ↓
MySQL: localhost:3306 (local machine only)
❌ Vercel can't access this
```

### After PlanetScale Migration
```
SQLite: data/agency.db (kept as backup)
↓ Migrated ↓
PlanetScale MySQL: host.psdb.cloud:3306
✅ Accessible from anywhere (Vercel, phone, etc.)
```

---

## **Cost Comparison**

| Service | Free Tier | Trial Duration | Next Tier Cost |
|---------|-----------|----------------|----------------|
| PlanetScale | 5GB / month | Unlimited | $39/month |
| Vercel Postgres | 256MB | 30 days | $15/month |
| Supabase | 500MB | 30 days | $25/month |
| MongoDB | 512MB | Unlimited | $57/month |

---

## **⚡ Recommended Path for You**

1. **Setup PlanetScale** (5 minutes)
   - Fastest free setup
   - No code changes
   - MySQL compatible

2. **Update .env** (2 minutes)
   ```bash
   # Copy connection details from PlanetScale
   DB_HOST=...
   DB_USER=...
   DB_PASSWORD=...
   ```

3. **Migrate Data** (5 minutes)
   ```bash
   node setup-db.js      # Create table
   node migrate-data.js  # Move SQLite data
   ```

4. **Test Locally** (2 minutes)
   ```bash
   node server.js
   # Open http://localhost:3000/api/health
   ```

5. **Deploy to Vercel** (3 minutes)
   ```bash
   git push origin main
   # Set env vars in Vercel dashboard
   ```

**Total time: ~20 minutes for production-ready app!**

---

## **Need Help?**

- PlanetScale docs: https://docs.planetscale.com
- Vercel + PlanetScale guide: https://vercel.com/guides/planetscale
- Vercel Postgres: https://vercel.com/docs/storage/vercel-postgres
- Contact support: support@planetscale.com

---

**Which database would you like to set up?** 
I can help with:
- ✅ PlanetScale (Recommended)
- ✅ Vercel Postgres (Alternative)
- ✅ Supabase (Alternative)
- ✅ MongoDB Atlas (Alternative)
