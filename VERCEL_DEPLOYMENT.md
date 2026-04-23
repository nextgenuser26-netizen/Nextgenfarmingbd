# Vercel Deployment Guide with MongoDB Atlas

## Prerequisites

- GitHub account
- Vercel account (sign up at [vercel.com](https://vercel.com))
- MongoDB Atlas account (or existing MongoDB cluster)
- Your project pushed to GitHub

## Step 1: Prepare Your Project

### 1.1 Push to GitHub

If you haven't already, push your project to GitHub:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/your-username/your-repo.git
git push -u origin main
```

### 1.2 Verify Environment Variables

Make sure your `.env.local` file has the required variables:

```env
MONGODB_URI="mongodb+srv://your-username:your-password@cluster0.g2korqj.mongodb.net/nextgenfarming?retryWrites=true&w=majority&appName=Cluster0"
GEMINI_API_KEY="your_gemini_api_key"
APP_URL="https://your-app.vercel.app"
```

**Note:** Never commit `.env.local` to git. It's already in `.gitignore`.

## Step 2: Deploy to Vercel

### 2.1 Import Project to Vercel

1. Go to [vercel.com](https://vercel.com) and log in
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Vercel will automatically detect it's a Next.js project

### 2.2 Configure Project Settings

**Framework Preset:** Next.js (auto-detected)

**Root Directory:** `./` (leave as default)

**Build Command:** `npm run build` (auto-detected)

**Output Directory:** `.next` (auto-detected)

**Install Command:** `npm install` (auto-detected)

Click "Deploy"

## Step 3: Set Environment Variables in Vercel

### 3.1 Add Environment Variables

1. Go to your project dashboard in Vercel
2. Click "Settings" → "Environment Variables"
3. Add the following variables:

**For Production:**
- **Name:** `MONGODB_URI`
  - **Value:** Your MongoDB Atlas connection string
  - **Environments:** Production, Preview, Development

- **Name:** `GEMINI_API_KEY`
  - **Value:** Your Gemini API key
  - **Environments:** Production, Preview, Development

- **Name:** `APP_URL`
  - **Value:** Your Vercel domain (e.g., `https://your-app.vercel.app`)
  - **Environments:** Production, Preview, Development

### 3.2 Redeploy After Adding Variables

After adding environment variables:
1. Go to "Deployments" tab
2. Click the three dots next to the latest deployment
3. Click "Redeploy"

## Step 4: MongoDB Atlas Setup

### 4.1 Configure IP Whitelist (Required for Vercel)

Since Vercel uses dynamic IP addresses, you need to allow access from anywhere:

1. Go to [MongoDB Atlas Dashboard](https://cloud.mongodb.com)
2. Select your cluster
3. Click "Network Access" → "IP Access"
4. Click "Add IP Address"
5. Select "Allow Access from Anywhere" (0.0.0.0/0)
6. Click "Confirm"

**Security Note:** This is necessary because Vercel's serverless functions use dynamic IPs. For better security, consider using Vercel's reserved IPs or MongoDB Atlas serverless instances.

### 4.2 Alternative: Use MongoDB Atlas Serverless

For better security with Vercel:
1. Create a MongoDB Atlas Serverless instance
2. Serverless instances automatically handle Vercel's dynamic IPs
3. Update your `MONGODB_URI` with the serverless connection string

## Step 5: Custom Domain (Optional)

### 5.1 Add Custom Domain

1. Go to Vercel project → "Settings" → "Domains"
2. Add your domain (e.g., `yourdomain.com`)
3. Vercel will provide DNS records to add

### 5.2 Update DNS

Add these records to your domain registrar:

**For Apex Domain (yourdomain.com):**
- **Type:** A
- **Name:** @
- **Value:** 76.76.21.21

**For Subdomain (www.yourdomain.com):**
- **Type:** CNAME
- **Name:** www
- **Value:** cname.vercel-dns.com

### 5.3 Update APP_URL

After custom domain is active:
1. Go to "Settings" → "Environment Variables"
2. Update `APP_URL` to your custom domain
3. Redeploy

## Step 6: Verify Deployment

### 6.1 Check Build Logs

1. Go to "Deployments" tab
2. Click on your latest deployment
3. Check "Build Logs" for any errors

### 6.2 Test Your Application

- Visit your Vercel URL
- Test all pages
- Test API routes
- Test database connections (admin panel, contact form, etc.)

### 6.3 Check Function Logs

1. Go to "Deployments" → your deployment
2. Click "Function Logs"
3. Check for any runtime errors

## Step 7: Monitoring

### 7.1 Vercel Analytics

Enable Vercel Analytics for performance monitoring:
1. Go to "Analytics" tab
2. Click "Enable Analytics"

### 7.2 MongoDB Atlas Monitoring

Monitor your database:
1. Go to MongoDB Atlas Dashboard
2. Check "Metrics" tab
3. Monitor connections, performance, and storage

## Troubleshooting

### Issue: MongoDB Connection Timeout

**Solution:**
- Verify IP whitelist includes 0.0.0.0/0
- Check your `MONGODB_URI` is correct
- Ensure MongoDB cluster is running (not paused)

### Issue: Build Fails

**Solution:**
- Check build logs for specific errors
- Ensure all dependencies are in `package.json`
- Verify TypeScript errors are resolved

### Issue: Environment Variables Not Working

**Solution:**
- Ensure variables are set for correct environments (Production/Preview/Development)
- Redeploy after adding/changing variables
- Check variable names match exactly (case-sensitive)

### Issue: Images Not Loading

**Solution:**
- Your `next.config.ts` already has remote patterns configured
- Ensure image domains are in the allowlist
- Check if images are in `public/` folder

## Best Practices

1. **Always use environment variables** for sensitive data
2. **Enable branch protection** on GitHub main branch
3. **Use Preview deployments** for testing before merging
4. **Monitor MongoDB costs** - set up alerts
5. **Regular backups** - MongoDB Atlas has automated backups
6. **Keep dependencies updated** - run `npm audit` regularly

## Continuous Deployment

Vercel automatically deploys when you push to GitHub:

- Push to `main` branch → Production deployment
- Push to other branches → Preview deployment
- Pull requests → Preview deployments

## Cost Estimates

**Vercel:**
- Free tier: 100GB bandwidth, 6,000 minutes build time
- Pro: $20/month (unlimited bandwidth, more build time)

**MongoDB Atlas:**
- Free tier: 512MB storage
- Shared cluster: ~$9/month (2GB storage)
- Serverless: Pay per usage

## Support

- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com)
- [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)
