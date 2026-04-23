# Netlify Deployment Guide with MongoDB Atlas

## Prerequisites

- GitHub account
- Netlify account (sign up at [netlify.com](https://netlify.com))
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
APP_URL="https://your-app.netlify.app"
```

**Note:** Never commit `.env.local` to git. It's already in `.gitignore`.

## Step 2: Deploy to Netlify

### 2.1 Connect GitHub to Netlify

1. Go to [app.netlify.com](https://app.netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Click "GitHub" to connect your account
4. Select your repository
5. Click "Import site"

### 2.2 Configure Build Settings

Netlify will auto-detect Next.js, but verify these settings:

**Build command:**
```
npm run build
```

**Publish directory:**
```
.next
```

**Base directory:**
```
/
```

Click "Deploy site"

## Step 3: Configure Netlify for Next.js

### 3.1 Create netlify.toml File

Create a `netlify.toml` file in your project root:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"

[build.environment]
  NODE_VERSION = "18"
```

### 3.2 Install Netlify Next.js Plugin

```bash
npm install --save-dev @netlify/plugin-nextjs
```

Commit this file and push to GitHub. Netlify will automatically redeploy.

## Step 4: Set Environment Variables in Netlify

### 4.1 Add Environment Variables

1. Go to your site dashboard in Netlify
2. Click "Site configuration" → "Environment variables"
3. Click "Add a variable"
4. Add the following variables:

**For Production:**
- **Key:** `MONGODB_URI`
  - **Value:** Your MongoDB Atlas connection string
  - **Scope:** All contexts (Production, Branch deploys, Preview deploys)

- **Key:** `GEMINI_API_KEY`
  - **Value:** Your Gemini API key
  - **Scope:** All contexts

- **Key:** `APP_URL`
  - **Value:** Your Netlify domain (e.g., `https://your-app.netlify.app`)
  - **Scope:** All contexts

- **Key:** `NODE_VERSION`
  - **Value:** `18`
  - **Scope:** All contexts

### 4.2 Redeploy After Adding Variables

After adding environment variables:
1. Go to "Deploys" tab
2. Click "Trigger deploy" → "Deploy site"

## Step 5: MongoDB Atlas Setup

### 5.1 Configure IP Whitelist (Required for Netlify)

Since Netlify uses dynamic IP addresses, you need to allow access from anywhere:

1. Go to [MongoDB Atlas Dashboard](https://cloud.mongodb.com)
2. Select your cluster
3. Click "Network Access" → "IP Access"
4. Click "Add IP Address"
5. Select "Allow Access from Anywhere" (0.0.0.0/0)
6. Click "Confirm"

**Security Note:** This is necessary because Netlify's serverless functions use dynamic IPs. For better security, consider using MongoDB Atlas serverless instances.

### 5.2 Alternative: Use MongoDB Atlas Serverless

For better security with Netlify:
1. Create a MongoDB Atlas Serverless instance
2. Serverless instances automatically handle Netlify's dynamic IPs
3. Update your `MONGODB_URI` with the serverless connection string

## Step 6: Custom Domain (Optional)

### 6.1 Add Custom Domain

1. Go to Netlify site → "Domain management"
2. Click "Add custom domain"
3. Enter your domain (e.g., `yourdomain.com`)
4. Click "Add domain"

### 6.2 Update DNS

Add these records to your domain registrar:

**For Apex Domain (yourdomain.com):**
- **Type:** A
- **Name:** @
- **Value:** 75.2.70.75

**For Subdomain (www.yourdomain.com):**
- **Type:** CNAME
- **Name:** www
- **Value:** your-app-name.netlify.app

### 6.3 Update APP_URL

After custom domain is active:
1. Go to "Site configuration" → "Environment variables"
2. Update `APP_URL` to your custom domain
3. Trigger a new deploy

## Step 7: Verify Deployment

### 7.1 Check Build Logs

1. Go to "Deploys" tab
2. Click on your latest deployment
3. Check "Deploy log" for any errors

### 7.2 Test Your Application

- Visit your Netlify URL
- Test all pages
- Test API routes
- Test database connections (admin panel, contact form, etc.)

### 7.3 Check Function Logs

1. Go to "Functions" tab
2. Check function logs for any runtime errors

## Step 8: Monitoring

### 8.1 Netlify Analytics

Enable Netlify Analytics for performance monitoring:
1. Go to "Site configuration" → "Analytics"
2. Click "Enable Analytics"

### 8.2 MongoDB Atlas Monitoring

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
- Make sure `netlify.toml` is configured correctly

### Issue: Environment Variables Not Working

**Solution:**
- Ensure variables are set for correct scopes
- Trigger a new deploy after adding/changing variables
- Check variable names match exactly (case-sensitive)

### Issue: Next.js Plugin Not Working

**Solution:**
- Ensure `@netlify/plugin-nextjs` is installed
- Check `netlify.toml` has the plugin configuration
- Verify the plugin is enabled in Netlify dashboard

### Issue: Images Not Loading

**Solution:**
- Your `next.config.ts` already has remote patterns configured
- Ensure image domains are in the allowlist
- Check if images are in `public/` folder

## Netlify-Specific Considerations

### Serverless Functions

Netlify automatically handles Next.js API routes as serverless functions. No additional configuration needed.

### Edge Functions

For better performance, you can use Netlify Edge Functions:
1. Create `netlify/edge-functions` directory
2. Add your edge functions there
3. Update `netlify.toml` to configure edge functions

### Forms

Netlify has built-in form handling. If you're using Next.js forms, they'll work automatically with Netlify's form processing.

## Best Practices

1. **Always use environment variables** for sensitive data
2. **Enable branch protection** on GitHub main branch
3. **Use deploy previews** for pull requests
4. **Monitor MongoDB costs** - set up alerts
5. **Regular backups** - MongoDB Atlas has automated backups
6. **Keep dependencies updated** - run `npm audit` regularly

## Continuous Deployment

Netlify automatically deploys when you push to GitHub:

- Push to `main` branch → Production deployment
- Push to other branches → Deploy previews
- Pull requests → Deploy previews

## Cost Estimates

**Netlify:**
- Free tier: 100GB bandwidth, 300 minutes build time
- Pro: $19/month (400GB bandwidth, 1000 minutes build time)
- Business: Custom pricing

**MongoDB Atlas:**
- Free tier: 512MB storage
- Shared cluster: ~$9/month (2GB storage)
- Serverless: Pay per usage

## Alternative: Netlify Functions with MongoDB

If you want to use Netlify's native functions instead of Next.js API routes:

1. Create `netlify/functions` directory
2. Add your functions there
3. Each function is a separate file that exports a handler

Example:
```javascript
// netlify/functions/hello.js
exports.handler = async (event, context) => {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Hello" })
  };
};
```

## Support

- [Netlify Documentation](https://docs.netlify.com)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com)
- [Next.js on Netlify Documentation](https://docs.netlify.com/integrations/frameworks/nextjs)
