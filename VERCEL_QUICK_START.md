# ⚡ Vercel Quick Start - 5 Minutes to Deploy!

## 🎯 Two Separate Deployments

You'll deploy **Backend** and **Frontend** as separate projects on Vercel.

---

## 📦 Part 1: Deploy Backend API (2 minutes)

### Step 1: Import Project
1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **"Import Git Repository"**
3. Select: `abhishekmishra2808/mini-event-finder`

### Step 2: Configure
- **Project Name**: `mini-event-finder-api`
- **Framework**: Other
- **Root Directory**: `backend` ⬅️ IMPORTANT!
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

### Step 3: Environment Variables
```
NODE_ENV = production
PORT = 3000
```

### Step 4: Deploy
- Click **"Deploy"**
- Wait 1-2 minutes
- **Copy URL**: `https://mini-event-finder-api.vercel.app` ✅

---

## 📦 Part 2: Deploy Frontend (2 minutes)

### Step 1: Import Project Again
1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **"Import Git Repository"**
3. Select: `abhishekmishra2808/mini-event-finder` (same repo!)

### Step 2: Configure
- **Project Name**: `mini-event-finder`
- **Framework**: Vite
- **Root Directory**: `frontend` ⬅️ IMPORTANT!
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

### Step 3: Environment Variables
```
VITE_API_URL = https://mini-event-finder-api.vercel.app/api
```
⚠️ Use YOUR backend URL from Part 1, Step 4!

### Step 4: Deploy
- Click **"Deploy"**
- Wait 1-2 minutes
- **Your app is LIVE!** 🎉

---

## 🔄 Part 3: Update Backend CORS (1 minute)

### Final Step:
1. Go to **Backend project** in Vercel
2. **Settings** → **Environment Variables**
3. Add:
   ```
   FRONTEND_URL = https://mini-event-finder.vercel.app
   ```
   ⚠️ Use YOUR frontend URL from Part 2, Step 4!
4. Go to **Deployments** → Click "..." → **Redeploy**

---

## ✅ Test Your Deployment

### Backend:
Visit: `https://mini-event-finder-api.vercel.app/health`
```json
{"status":"ok","message":"Mini Event Finder API is running"}
```

### Frontend:
Visit: `https://mini-event-finder.vercel.app`

Should show your event finder with all features working! 🎊

---

## 🎯 Your Live URLs

```
Frontend:  https://mini-event-finder.vercel.app
Backend:   https://mini-event-finder-api.vercel.app
API:       https://mini-event-finder-api.vercel.app/api/events
```

---

## 🚀 Future Updates

Just push to GitHub:
```bash
git add .
git commit -m "Your changes"
git push origin master
```

Vercel auto-deploys both projects! 🎉

---

## ⚡ Why Vercel?

- ✅ No cold starts (always fast!)
- ✅ Free SSL/HTTPS
- ✅ Global CDN
- ✅ Auto deployments
- ✅ Preview URLs
- ✅ 100% uptime

---

**Total Time: ~5 minutes** ⏱️
**Cost: $0 (Free tier)** 💰
