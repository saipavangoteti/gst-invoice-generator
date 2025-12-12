# Deployment Guide for Vercel

This guide will help you deploy your GST Invoice Generator to Vercel.

## Prerequisites

- A GitHub account
- A Vercel account (sign up at https://vercel.com - free tier available)

## Step-by-Step Deployment

### 1. Push to GitHub

First, create a new repository on GitHub, then push your code:

```bash
# Add all files
git add .

# Commit the files
git commit -m "Initial commit - GST Invoice Generator"

# Create the main branch
git branch -M main

# Add your GitHub repository as remote (replace with your actual repo URL)
git remote add origin https://github.com/yourusername/gst-invoice-generator.git

# Push to GitHub
git push -u origin main
```

### 2. Deploy to Vercel

#### Option A: Via Vercel Dashboard (Recommended)

1. Go to https://vercel.com and sign in
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Vercel will automatically detect Next.js
5. Keep the default settings:
   - **Framework Preset:** Next.js
   - **Build Command:** `next build`
   - **Output Directory:** `.next`
   - **Install Command:** `npm install`
6. Click "Deploy"
7. Wait 1-2 minutes for deployment to complete
8. Your app will be live at: `https://your-project-name.vercel.app`

#### Option B: Via Vercel CLI

1. Install Vercel CLI globally:
```bash
npm install -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy from the project directory:
```bash
cd /Users/saipavangoteti/Projects/gst-invoice-generator
vercel
```

4. Follow the prompts:
   - Set up and deploy? Yes
   - Which scope? (Choose your account)
   - Link to existing project? No
   - What's your project's name? (Press enter for default or type a name)
   - In which directory is your code located? (Press enter for ./)
   - Want to modify settings? No

5. For production deployment:
```bash
vercel --prod
```

### 3. Custom Domain (Optional)

After deployment, you can add a custom domain:

1. Go to your project in Vercel Dashboard
2. Click on "Settings" → "Domains"
3. Add your custom domain
4. Follow the DNS configuration instructions

## Environment Variables

This application doesn't require any environment variables, but if you want to add any:

1. Go to your project in Vercel Dashboard
2. Click "Settings" → "Environment Variables"
3. Add your variables
4. Redeploy for changes to take effect

## Automatic Deployments

Once connected to GitHub:
- Every push to the main branch triggers a production deployment
- Pull requests automatically create preview deployments
- You can view deployment status in the Vercel Dashboard

## Troubleshooting

### Build Fails
- Check the build logs in Vercel Dashboard
- Ensure all dependencies are in package.json
- Test locally with `npm run build`

### Styles Not Loading
- Clear Vercel cache and redeploy
- Check that Tailwind CSS is properly configured

### Application Not Starting
- Verify Next.js version compatibility
- Check for console errors in browser

### 401 Unauthorized on Vercel

If visiting your deployed URL shows **401 Unauthorized** while the app works locally, it is almost always due to Vercel project protection, not this codebase.

Steps to disable project protection for public access:

1. Open your project in the **Vercel Dashboard**.
2. Go to **Settings → Functions & Security** (or **Security / Protection**, depending on UI version).
3. Look for **Password Protection**, **Access Control**, or **Protection Level**.
4. If it is set to **Protected** or requires a password, change it to **Public** (no password).
5. Save the settings and trigger a new deployment (or click **Redeploy** on the latest deployment).

After this, the app should be publicly accessible at your `*.vercel.app` URL without returning 401.

## Performance Tips

Your app is already optimized for Vercel:
- ✅ Static generation where possible
- ✅ Automatic code splitting
- ✅ Image optimization ready
- ✅ Edge network CDN

## Support

- Vercel Documentation: https://vercel.com/docs
- Next.js Documentation: https://nextjs.org/docs
- GitHub Issues: Open an issue in your repository

## Monitoring

Vercel provides:
- Analytics (in the free tier with limits)
- Deployment logs
- Runtime logs
- Performance insights

Access these from your project dashboard.
