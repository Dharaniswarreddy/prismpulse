# Vercel Deployment Guide

## Step 1: Prepare for Deployment

Your project is now configured for Vercel serverless deployment. The structure is:
- `api/health.js` - Health check endpoint
- `api/leads.js` - GET/POST leads endpoint
- `vercel.json` - Vercel configuration
- `index.html`, `script.js`, `styles.css` - Static frontend files

## Step 2: Set Environment Variables on Vercel

You need to configure a cloud database (Vercel does NOT support local databases).

### Option A: Use Vercel Postgres (Recommended for Vercel)
1. Go to your Vercel project dashboard
2. Go to Settings → Environment Variables
3. Add these variables:
```
DB_HOST=<your-postgres-host>
DB_USER=<your-postgres-user>
DB_PASSWORD=<your-postgres-password>
DB_NAME=<your-postgres-database>
DB_PORT=5432
```

### Option B: Use PlanetScale (MySQL Compatible)
1. Create PlanetScale account and database
2. Get connection string from PlanetScale dashboard
3. Extract credentials and add to Vercel:
```
DB_HOST=<planetscale-host>
DB_USER=<planetscale-user>
DB_PASSWORD=<planetscale-password>
DB_NAME=<planetscale-database>
DB_PORT=3306
```

### Option C: Use Supabase (PostgreSQL)
1. Create Supabase project
2. Get connection details from project settings
3. Add to Vercel environment variables

## Step 3: Deploy to Vercel

1. **First time deployment:**
   ```
   npx vercel
   ```
   Follow the prompts and link your GitHub repository

2. **Connect your GitHub repo:**
   - When prompted, authorize Vercel to access your GitHub
   - Select the repository: Dharaniswarreddy/prismpulse

3. **Configure environment:**
   - Vercel will ask about environment variables
   - Add the DB credentials there (don't commit .env)

4. **Deploy:**
   - Vercel will automatically deploy
   - You'll get a production URL

## Step 4: Test Your Deployment

After deployment, test the endpoints:

```bash
# Health check
curl https://your-vercel-url/api/health

# Get leads
curl https://your-vercel-url/api/leads

# Create a lead
curl -X POST https://your-vercel-url/api/leads \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com","goals":"Grow business"}'
```

## Step 5: Update Frontend

Make sure your `script.js` uses the correct API endpoints:

```javascript
const API_URL = window.location.origin; // Auto-detects production URL
```

## Troubleshooting

**Error: Cannot GET /**
- Solution: Vercel now serves index.html correctly with the rewrites in vercel.json

**Error: Connection refused (database)**
- Solution: Ensure DB_HOST, DB_USER, DB_PASSWORD are set in Vercel Environment Variables
- Use a cloud database, NOT localhost

**Error: CORS issues**
- Solution: CORS headers are already set in api/leads.js

**Database table doesn't exist:**
- Solution: Run `node setup-db.js` locally to create tables, or connect to your cloud DB and create the `leads` table manually:
```sql
CREATE TABLE leads (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  goals TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Local Development

To continue developing locally:
```bash
npm install
node server.js
```

The local server uses the values in `.env` (localhost MySQL by default).

For production (Vercel): Set DB_HOST, DB_USER, DB_PASSWORD in Vercel dashboard.
