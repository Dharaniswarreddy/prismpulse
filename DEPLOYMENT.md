# Vercel Deployment Guide

## Project: PrismPulse Agency

Your application is ready for deployment to Vercel! Follow one of these methods:

### Method 1: Complete CLI Authentication (Recommended)

1. Visit: `https://vercel.com/oauth/device?user_code=FCTP-LKDW`
2. Log in with your Vercel account
3. The CLI will automatically complete the deployment
4. Once complete, you'll get a URL like: `https://prismpulse-xxx.vercel.app`

### Method 2: Vercel Web Dashboard

1. Go to https://vercel.com/dashboard
2. Click "Add New Project"
3. Select "Import Git Repository"
4. Paste: `https://github.com/Dharaniswarreddy/prismpulse`
5. Click "Import"

### Step 3: Configure Environment Variables

After importing, you must add the following environment variables in Vercel dashboard (Settings > Environment Variables):

```
DB_HOST=<your-mysql-host>
DB_USER=<your-mysql-username>
DB_PASSWORD=<your-mysql-password>
DB_NAME=prismpulse
DB_PORT=3306
NODE_ENV=production
```

**Important:** You need a MySQL database accessible from the internet. Options:
- AWS RDS MySQL
- Google Cloud SQL
- DigitalOcean Managed Databases
- PlanetScale (MySQL-compatible)
- Supabase PostgreSQL (alternative)

⚠️ **Note:** Your local MySQL instance (localhost:3306) won't be accessible from Vercel's serverless environment.

### Step 4: Deploy

Once environment variables are set, Vercel will automatically redeploy. You can manually trigger deployment by pushing to GitHub.

### Verify After Deployment

1. Visit: `https://your-project.vercel.app/api/health`
2. Should return: `{"status":"ok"}`
3. Test endpoints:
   - GET `/api/leads` - Fetch all leads
   - POST `/api/leads` - Create new lead

### Database Connection Issues

If you get connection errors after deployment:

1. Verify MySQL is accessible from the internet
2. Check firewall/security group settings allow port 3306
3. Verify credentials in environment variables
4. Check Vercel deployment logs (Deployments > Details > > Logs)

### MongoDB Alternative (Easier)

If MySQL over the internet is difficult, consider switching to MongoDB:
- MongoDB Atlas (free tier available)
- No firewall needed
- Similar code changes required

---

**Support:** Check Vercel docs at https://vercel.com/docs
