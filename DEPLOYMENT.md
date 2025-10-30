# 🚀 Deployment Guide - Render.com

This guide will walk you through deploying the Mini Event Finder application to Render.com.

## 📋 Prerequisites

1. **Git Repository**: Your code must be in a GitHub repository
2. **Render Account**: Sign up at [render.com](https://render.com)
3. **Free Tier**: Both services can run on Render's free tier

## 🗂️ Project Structure

```
assign/
├── backend/           # Node.js Express API
├── frontend/          # React + Vite app
├── render.yaml        # Render configuration
└── .gitignore        # Git ignore rules
```

## 📤 Step 1: Push to GitHub

1. **Initialize Git** (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Mini Event Finder"
   ```

2. **Create GitHub Repository**:
   - Go to github.com and create a new repository
   - Name it `mini-event-finder` (or your preferred name)
   - Don't initialize with README (you already have code)

3. **Push Your Code**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/mini-event-finder.git
   git branch -M main
   git push -u origin main
   ```

## 🎯 Step 2: Deploy to Render

### Option A: Using Blueprint (render.yaml) - Recommended ✨

1. **Go to Render Dashboard**: [dashboard.render.com](https://dashboard.render.com)

2. **Create New Blueprint**:
   - Click **"New +"** → **"Blueprint"**
   - Connect your GitHub account if not already connected
   - Select your repository: `mini-event-finder`
   - Render will automatically detect `render.yaml`

3. **Review Services**:
   - Backend API: `mini-event-finder-api`
   - Frontend: `mini-event-finder-web`

4. **Configure Environment Variables**:
   
   **For Backend Service** (`mini-event-finder-api`):
   - `NODE_ENV` = `production` (already in render.yaml)
   - `PORT` = `3000` (already in render.yaml)
   
   **For Frontend Service** (`mini-event-finder-web`):
   - `VITE_API_URL` = `https://mini-event-finder-api.onrender.com/api`
     - ⚠️ **Important**: Replace `mini-event-finder-api` with your actual backend service name
     - You'll get this URL after backend deploys (Step 5)

5. **Deploy**:
   - Click **"Apply"**
   - Wait for both services to build and deploy (5-10 minutes)

6. **Get Your URLs**:
   - Backend API: `https://mini-event-finder-api.onrender.com`
   - Frontend: `https://mini-event-finder-web.onrender.com`

7. **Update CORS in Backend** (if needed):
   - Go to `backend/src/index.ts`
   - Update the frontend URL in the CORS configuration:
     ```typescript
     origin: process.env.NODE_ENV === 'production' 
       ? ['https://mini-event-finder-web.onrender.com']
       : ['http://localhost:5173']
     ```
   - Commit and push changes

8. **Update Frontend API URL**:
   - Go to Render Dashboard → Frontend Service → Environment
   - Update `VITE_API_URL` with your actual backend URL
   - Click **"Save Changes"**
   - The service will automatically redeploy

### Option B: Manual Deployment

If you prefer to deploy services separately:

#### Deploy Backend:

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Configure:
   - **Name**: `mini-event-finder-api`
   - **Region**: Oregon (or your preferred region)
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: `Free`

4. Add Environment Variables:
   - `NODE_ENV` = `production`
   - `PORT` = `3000`

5. Click **"Create Web Service"**

#### Deploy Frontend:

1. Click **"New +"** → **"Static Site"**
2. Connect your GitHub repository
3. Configure:
   - **Name**: `mini-event-finder-web`
   - **Region**: Oregon
   - **Branch**: `main`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
   - **Plan**: `Free`

4. Add Environment Variable:
   - `VITE_API_URL` = `https://YOUR-BACKEND-URL.onrender.com/api`
   - Replace with your actual backend URL from step above

5. Click **"Create Static Site"**

## ✅ Step 3: Verify Deployment

1. **Check Backend**:
   - Visit: `https://mini-event-finder-api.onrender.com/health`
   - Should return: `{"status":"ok","message":"Mini Event Finder API is running"}`

2. **Check Frontend**:
   - Visit: `https://mini-event-finder-web.onrender.com`
   - Should load the Mini Event Finder homepage
   - Test creating an event, searching, enabling location

3. **Test Features**:
   - ✅ Create Event
   - ✅ Search Events
   - ✅ Enable Location
   - ✅ View Event Details
   - ✅ Weather Forecast
   - ✅ Save Events
   - ✅ Set Reminders
   - ✅ Similar Events

## 🎨 Post-Deployment

### Custom Domain (Optional)

1. Go to your frontend service in Render
2. Click **"Settings"** → **"Custom Domains"**
3. Add your domain and follow DNS configuration steps

### Free Tier Limitations

⚠️ **Important**: Render's free tier has some limitations:

- **Sleep Mode**: Services sleep after 15 minutes of inactivity
- **Cold Start**: First request after sleep takes 30-60 seconds
- **Monthly Hours**: 750 hours per month (enough for one service 24/7)

**Solution for Cold Starts**:
- Use a service like [cron-job.org](https://cron-job.org) to ping your API every 10 minutes:
  - URL: `https://mini-event-finder-api.onrender.com/health`
  - Schedule: Every 10 minutes

## 🔧 Troubleshooting

### Issue: Frontend can't connect to backend
**Solution**: 
- Check `VITE_API_URL` is set correctly in frontend environment variables
- Check CORS settings in `backend/src/index.ts` include your frontend URL

### Issue: Build fails
**Solution**:
- Check build logs in Render dashboard
- Ensure all dependencies are in `package.json` (not just `devDependencies`)
- Verify build commands are correct

### Issue: Backend returns 500 errors
**Solution**:
- Check runtime logs in Render dashboard
- Ensure `PORT` environment variable is set
- Check all required environment variables are configured

### Issue: Service keeps sleeping
**Solution**:
- Upgrade to paid tier ($7/month) for always-on service
- Or set up automated pings (see Free Tier Limitations above)

## 📝 Update Deployment

After making code changes:

```bash
git add .
git commit -m "Your commit message"
git push origin main
```

Render will automatically detect the push and redeploy your services! 🎉

## 🔗 Useful Links

- [Render Dashboard](https://dashboard.render.com)
- [Render Documentation](https://render.com/docs)
- [Render Status](https://status.render.com)

## 🎉 Your App is Live!

**Backend API**: `https://mini-event-finder-api.onrender.com`
**Frontend**: `https://mini-event-finder-web.onrender.com`

Share your live Mini Event Finder with the world! 🌍✨
