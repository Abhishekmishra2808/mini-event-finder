# 🚀 Vercel Deployment Guide - Mini Event Finder

This guide will walk you through deploying the Mini Event Finder application to Vercel.

## 📋 Prerequisites

1. **Git Repository**: Your code must be in a GitHub repository ✅ (You already have this!)
2. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
3. **Free Tier**: Unlimited deployments on Vercel's free tier!

## 🎯 Deployment Strategy

We'll deploy TWO separate projects on Vercel:
1. **Backend API** - Node.js serverless functions
2. **Frontend** - Static React site

## 📤 Step 1: Deploy Backend API

### 1.1 Go to Vercel Dashboard

1. Visit [vercel.com/new](https://vercel.com/new)
2. Click **"Import Git Repository"**
3. Select your repository: `abhishekmishra2808/mini-event-finder`

### 1.2 Configure Backend Project

1. **Project Name**: `mini-event-finder-api` (or your choice)
2. **Framework Preset**: Other
3. **Root Directory**: Click **"Edit"** → Select `backend`
4. **Build & Development Settings**:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

### 1.3 Environment Variables

Add these in the Vercel dashboard:

| Name | Value |
|------|-------|
| `NODE_ENV` | `production` |
| `PORT` | `3000` |
| `FRONTEND_URL` | (Leave blank for now, add after frontend deploys) |

### 1.4 Deploy

1. Click **"Deploy"**
2. Wait 1-2 minutes for deployment
3. **Copy your API URL**: `https://mini-event-finder-api.vercel.app`

## 📤 Step 2: Deploy Frontend

### 2.1 Create New Project

1. Go back to [vercel.com/new](https://vercel.com/new)
2. Click **"Import Git Repository"**
3. Select your repository: `abhishekmishra2808/mini-event-finder` again

### 2.2 Configure Frontend Project

1. **Project Name**: `mini-event-finder` (or your choice)
2. **Framework Preset**: Vite
3. **Root Directory**: Click **"Edit"** → Select `frontend`
4. **Build & Development Settings**:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
   - Development Command: `npm run dev`

### 2.3 Environment Variables

Add this environment variable:

| Name | Value |
|------|-------|
| `VITE_API_URL` | `https://mini-event-finder-api.vercel.app/api` |

**Important**: Replace with your actual backend URL from Step 1.4!

### 2.4 Deploy

1. Click **"Deploy"**
2. Wait 1-2 minutes for deployment
3. **Your app is live!** 🎉

## 🔄 Step 3: Update Backend CORS

Now that you have your frontend URL, update the backend:

1. Go to your backend project in Vercel
2. Go to **Settings** → **Environment Variables**
3. Add or update:
   - `FRONTEND_URL` = `https://mini-event-finder.vercel.app`
4. Go to **Deployments** → Click "..." on latest → **Redeploy**

## ✅ Verify Deployment

### Backend Health Check
Visit: `https://mini-event-finder-api.vercel.app/health`

Should return:
```json
{"status":"ok","message":"Mini Event Finder API is running"}
```

### Frontend
Visit: `https://mini-event-finder.vercel.app`

Should load the Mini Event Finder homepage with all events!

### Test Features
- ✅ View events
- ✅ Search events
- ✅ Enable location
- ✅ Create new event
- ✅ View event details
- ✅ Weather forecast
- ✅ Save events
- ✅ Set reminders

## 🎨 Custom Domain (Optional)

### For Frontend:
1. Go to your frontend project
2. **Settings** → **Domains**
3. Add your custom domain
4. Update DNS records as instructed

### For Backend:
1. Go to your backend project
2. **Settings** → **Domains**
3. Add API subdomain (e.g., `api.yourdomain.com`)
4. Update `VITE_API_URL` in frontend to use new domain

## 🔧 Troubleshooting

### Issue: CORS Errors

**Solution**:
1. Check `FRONTEND_URL` is set in backend environment variables
2. Verify frontend URL matches exactly (with https://)
3. Redeploy backend after adding environment variable

### Issue: API calls return 404

**Solution**:
1. Verify `VITE_API_URL` ends with `/api`
2. Check backend deployment succeeded
3. Visit `/health` endpoint to verify backend is running

### Issue: Backend functions timeout

**Solution**:
Vercel serverless functions have a 10-second timeout on free tier. This should be enough for the Mini Event Finder API.

### Issue: Build fails

**Solution**:
1. Check build logs in Vercel dashboard
2. Verify `package.json` has all dependencies
3. Make sure TypeScript compiles locally: `npm run build`

## 🆓 Vercel Free Tier Benefits

✅ **Advantages**:
- Unlimited deployments
- Automatic HTTPS/SSL
- Global CDN
- Preview deployments for every Git push
- No cold starts (unlike Render)
- Instant deployments (1-2 minutes)
- 100GB bandwidth per month
- Automatic Git integration

⚡ **No Sleep Mode**: Your apps are always on!

## 🔄 Automatic Deployments

Every time you push to GitHub:

```bash
git add .
git commit -m "Your changes"
git push origin master
```

Vercel automatically:
1. Detects the push
2. Builds both projects
3. Deploys updates
4. Shows preview URLs

## 📊 Monitoring

### View Logs:
1. Go to your project in Vercel
2. Click **"Functions"** tab
3. See real-time logs for API requests

### Analytics:
1. Go to **"Analytics"** tab
2. See visitor stats, page views, performance

## 🎯 Your Live URLs

After deployment, save these URLs:

```
Frontend:     https://mini-event-finder.vercel.app
Backend API:  https://mini-event-finder-api.vercel.app
Health Check: https://mini-event-finder-api.vercel.app/health
Events API:   https://mini-event-finder-api.vercel.app/api/events
```

## 🚀 Quick Commands Reference

### Push Updates:
```bash
git add .
git commit -m "Update message"
git push origin master
```

### Check Backend Locally:
```bash
cd backend
npm run dev
```

### Check Frontend Locally:
```bash
cd frontend
npm run dev
```

## 📱 Share Your App!

Your Mini Event Finder is now live and ready to share:

- Share the frontend URL with friends
- Post on social media
- Add to your portfolio
- Show in job interviews

## 🎉 Success!

Congratulations! Your Mini Event Finder is now deployed on Vercel with:

- ⚡ Lightning-fast performance
- 🌍 Global CDN
- 🔒 Automatic HTTPS
- 🚀 Automatic deployments
- 💯 100% uptime (no cold starts!)

---

**Need Help?**
- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Support](https://vercel.com/support)
- [Vercel Status](https://www.vercel-status.com/)

**Built with ❤️ and deployed on Vercel**
