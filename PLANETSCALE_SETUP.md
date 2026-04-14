# PlanetScale Setup - Complete Guide

## Step 1: Create PlanetScale Account

1. Visit: **https://planetscale.com/signup**
2. Sign up with **GitHub** (recommended - easy authentication)
3. Verify email
4. You'll land on the dashboard

---

## Step 2: Create Your Database

1. Click **"Create a new database"** button
2. Fill in details:
   - **Organization name:** Your name or company
   - **Database name:** `prismpulse`
   - **Region:** Choose closest to you:
     - US East (us-east): Default
     - EU West (eu-west): Europe
     - Asia Pacific (ap-south): Asia
   - **Billing:** Free tier is fine for now

3. Click **"Create database"**
4. Wait ~30 seconds for creation

---

## Step 3: Get Connection String

### Find Your Credentials:

1. In dashboard, click your `prismpulse` database
2. Click **"Connect"** button (top right)
3. Select **"MySQL"** from dropdown
4. You'll see connection string:

```
mysql://[username]:[password]@[hostname]/prismpulse?sslaccept=strict
```

### Extract Individual Values:

From the connection string, copy:
- **DB_HOST:** `hostname` (e.g., `aws.connect.psdb.cloud`)
- **DB_USER:** `username`
- **DB_PASSWORD:** `password` (the long one starting with `pscale_pw_`)
- **DB_NAME:** `prismpulse`
- **DB_PORT:** `3306`

---

## Step 4: Create Local .env.planetscale File

Create a test file to store PlanetScale credentials:

```env
DB_HOST=your-hostname.psdb.cloud
DB_USER=your-username
DB_PASSWORD=pscale_pw_xxxxxxxxxxxxx
DB_NAME=prismpulse
DB_PORT=3306
NODE_ENV=production
PORT=3000
```

⚠️ **Keep this file private - don't commit to Git!** Add `.env.planetscale` to `.gitignore`

---

## Step 5: Test Connection & Migrate Data

### Create Database Schema on PlanetScale

```bash
# In your project directory
cd "c:\Users\user\Documents\New project"

# Update .env to use PlanetScale credentials
# Edit .env file and replace with PlanetScale values

# Create the table on PlanetScale
node setup-db.js
```

Expected output:
```
✓ MySQL table 'leads' created successfully
✅ Database setup complete!
```

### Migrate Data from SQLite to PlanetScale

```bash
# Run migration script
node migrate-data.js
```

Expected output:
```
🔄 Starting migration from SQLite to MySQL...
📦 Found 2 records in SQLite
✓ Successfully migrated 2/2 records
📊 MySQL now has 2 total records
✅ Migration complete!
```

---

## Step 6: Test Locally

Update your `.env` file with PlanetScale credentials, then test:

```bash
# Start server with PlanetScale database
node server.js
```

Should see:
```
🚀 Server running at http://localhost:3000
📊 Database: prismpulse@aws.connect.psdb.cloud
⏰ 2026-04-14T...
```

Test endpoints:
```bash
# Health check
curl http://localhost:3000/api/health
# Returns: {"status":"ok"}

# Get leads
curl http://localhost:3000/api/leads
# Returns: {"leads":[...]}
```

---

## Step 7: Update Git & Environment Variables

### Add to Project (Don't Commit Credentials!)

```bash
# Update .gitignore to exclude sensitive files
echo ".env.local" >> .gitignore
echo ".env.planetscale" >> .gitignore

# Commit changes
git add .
git commit -m "chore: add PlanetScale database configuration"
git push origin main
```

### Add Vercel Environment Variables

1. Go to **https://vercel.com/dashboard**
2. Select your `prismpulse` project
3. Click **"Settings"** > **"Environment Variables"**
4. Add each variable separately:

```
DB_HOST = your-hostname.psdb.cloud
DB_USER = your-username
DB_PASSWORD = pscale_pw_xxxxx
DB_NAME = prismpulse
DB_PORT = 3306
NODE_ENV = production
```

5. Click "Save"
6. Vercel will auto-redeploy

---

## Step 8: Verify Deployment

Once deployed to Vercel:

```bash
# Test your live deployment
curl https://your-project.vercel.app/api/health
# Returns: {"status":"ok"}

curl https://your-project.vercel.app/api/leads
# Returns: {"leads":[...]}
```

---

## ✅ Checklist

- [ ] PlanetScale account created
- [ ] Database `prismpulse` created
- [ ] Connection credentials copied
- [ ] `.env` file updated locally
- [ ] `node setup-db.js` executed successfully
- [ ] `node migrate-data.js` executed successfully
- [ ] Local server tested
- [ ] Code pushed to GitHub
- [ ] Vercel environment variables added
- [ ] Deployment tested

---

## 🆘 Troubleshooting

### Connection Error: "Can't reach database"
```
Solution: 
1. Check credentials are correct in .env
2. Verify network access enabled in PlanetScale
3. Check firewall/VPN settings
```

### SSL Certificate Error
```
Solution:
Add to connection string: ?sslaccept=strict
Already included in PlanetScale defaults
```

### "Table already exists"
```
Solution: Table creation is safe to re-run, skips if exists
```

### Migration shows "0 records"
```
Solution: LocalSQLite has no data yet
Create test lead first: node server.js (locally)
POST to http://localhost:3000/api/leads with test data
```

### Vercel Still Shows Connection Error
```
Solution:
1. Check env vars in Vercel dashboard
2. Redeploy: git push origin main
3. Check logs: Vercel > Deployments > Logs
```

---

## 📚 Useful Links

- **PlanetScale Docs:** https://docs.planetscale.com
- **PlanetScale CLI:** https://planetscale.com/docs/tutorials/planetscale-cli-tutorial
- **Vercel + PlanetScale:** https://vercel.com/guides/planetscale
- **PlanetScale Support:** https://planetscale.com/help

---

## 🎉 Next Steps After Setup

Once PlanetScale is connected and working:

1. ✅ Database is live (MySQL in cloud)
2. ✅ App scales automatically
3. ✅ Accessible from anywhere
4. ✅ Ready for production

You can now:
- Add more features to your app
- Test with real data
- Monitor database usage
- Scale up when needed

**Need help?** Contact PlanetScale support or check their docs!
