# 🚀 Quick Deployment Reference

## One-Command Deployment

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit - Mini Event Finder"
git remote add origin https://github.com/YOUR_USERNAME/mini-event-finder.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy on Render
1. Go to [dashboard.render.com](https://dashboard.render.com)
2. Click **"New +"** → **"Blueprint"**
3. Select your repository: `mini-event-finder`
4. Click **"Apply"**

### Step 3: Configure Frontend
After backend deploys (check dashboard for URL):
1. Go to frontend service → Environment
2. Add variable:
   - Key: `VITE_API_URL`
   - Value: `https://YOUR-BACKEND-NAME.onrender.com/api`
3. Save (auto-redeploys)

## ✅ Verify Deployment

**Backend Health Check**:
```
https://YOUR-BACKEND.onrender.com/health
```
Should return: `{"status":"ok",...}`

**Frontend**:
```
https://YOUR-FRONTEND.onrender.com
```
Should show the Mini Event Finder homepage.

## 🎯 Environment Variables Needed

### Backend (auto-configured in render.yaml)
- `NODE_ENV=production`
- `PORT=3000`

### Frontend (add manually after backend deploys)
- `VITE_API_URL=https://YOUR-BACKEND.onrender.com/api`

## 📁 Files Created for Deployment

```
assign/
├── render.yaml                      # ⭐ Render blueprint config
├── .gitignore                       # Git ignore rules
├── .env.example                     # Environment variable template
├── DEPLOYMENT.md                    # 📚 Full deployment guide
├── DEPLOYMENT_CHECKLIST.md          # ✅ Interactive checklist
├── DEPLOYMENT_READY.md              # 🎉 Setup summary
├── QUICK_DEPLOY.md                  # ⚡ This file
├── backend/
│   ├── .gitignore
│   └── src/
│       └── index.ts                 # ✅ CORS configured
├── frontend/
│   ├── .gitignore
│   ├── .env.production.example
│   ├── src/
│   │   ├── vite-env.d.ts           # ✅ TypeScript env types
│   │   └── services/
│   │       └── api.ts               # ✅ Uses VITE_API_URL
```

## 🔗 Important URLs to Know

After deployment, you'll have:

```
Frontend:     https://mini-event-finder-web.onrender.com
Backend API:  https://mini-event-finder-api.onrender.com
Health Check: https://mini-event-finder-api.onrender.com/health
Events API:   https://mini-event-finder-api.onrender.com/api/events
```

*(Replace with your actual service names)*

## ⚡ Update Your Deployed App

```bash
git add .
git commit -m "Your update message"
git push origin main
```

Render auto-detects and redeploys! 🎉

## 🆘 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| CORS errors | Update frontend URL in `backend/src/index.ts` CORS config |
| Frontend can't connect | Check `VITE_API_URL` is set correctly |
| Build fails | Check build logs in Render dashboard |
| Service sleeps | Normal for free tier - first request takes 30-60s |
| 404 on routes | Render.yaml includes rewrite rule for SPA routing |

## 📖 More Help

- **Full Guide**: [DEPLOYMENT.md](DEPLOYMENT.md)
- **Checklist**: [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)
- **Setup Summary**: [DEPLOYMENT_READY.md](DEPLOYMENT_READY.md)

---

**Total time to deploy: ~10 minutes** ⏱️
