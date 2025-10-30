# 📋 Deployment Checklist for Render

Use this checklist to ensure a smooth deployment process.

## ✅ Pre-Deployment Checklist

### Code Preparation
- [ ] All code committed to Git
- [ ] `.gitignore` files in place (root, backend, frontend)
- [ ] No `.env` files committed (only `.env.example`)
- [ ] All dependencies in `package.json` (not just devDependencies)
- [ ] Build scripts tested locally:
  - [ ] Backend: `cd backend && npm run build`
  - [ ] Frontend: `cd frontend && npm run build`

### Configuration Files
- [ ] `render.yaml` exists in root directory
- [ ] CORS configuration updated in `backend/src/index.ts`
- [ ] Frontend API URL uses environment variable in `frontend/src/services/api.ts`
- [ ] `vite-env.d.ts` created for TypeScript environment variables

### GitHub Repository
- [ ] Repository created on GitHub
- [ ] Code pushed to `main` branch
- [ ] Repository is accessible (public or private with Render connection)

## 🚀 Deployment Steps

### On Render Dashboard
- [ ] Signed up / Logged into Render.com
- [ ] Created new Blueprint from `render.yaml`
- [ ] Connected GitHub repository
- [ ] Reviewed both services in blueprint:
  - [ ] Backend: `mini-event-finder-api`
  - [ ] Frontend: `mini-event-finder-web`

### Backend Configuration
- [ ] Service type: Web Service
- [ ] Environment: Node
- [ ] Build command: `cd backend && npm install && npm run build`
- [ ] Start command: `cd backend && npm start`
- [ ] Environment variables set:
  - [ ] `NODE_ENV=production`
  - [ ] `PORT=3000`

### Frontend Configuration
- [ ] Service type: Static Site
- [ ] Build command: `cd frontend && npm install && npm run build`
- [ ] Publish directory: `frontend/dist`
- [ ] Environment variable to add AFTER backend deploys:
  - [ ] `VITE_API_URL=https://YOUR-BACKEND-URL.onrender.com/api`

### Deployment
- [ ] Clicked "Apply" to deploy blueprint
- [ ] Waited for backend to deploy (5-10 minutes)
- [ ] Copied backend URL from Render dashboard
- [ ] Updated `VITE_API_URL` in frontend environment variables
- [ ] Waited for frontend to redeploy

## ✅ Post-Deployment Verification

### Backend API Tests
- [ ] Health check works: `https://YOUR-BACKEND.onrender.com/health`
  - Expected: `{"status":"ok","message":"Mini Event Finder API is running"}`
- [ ] Events endpoint works: `https://YOUR-BACKEND.onrender.com/api/events`
  - Expected: Array of 10 sample events

### Frontend Tests
- [ ] Homepage loads: `https://YOUR-FRONTEND.onrender.com`
- [ ] Sample events display correctly
- [ ] Search functionality works
- [ ] Category filter works
- [ ] Enable location button works (browser permission)
- [ ] Create event form works
- [ ] Event detail page loads
- [ ] Weather widget shows 7-day forecast
- [ ] Save event button works (localStorage)
- [ ] "Show Saved" page works
- [ ] Reminder functionality works
- [ ] Similar events section displays

### CORS Verification
- [ ] No CORS errors in browser console
- [ ] API requests from frontend to backend succeed
- [ ] Network tab shows successful API calls

## 🔧 If Something Goes Wrong

### Backend Issues
**Symptom**: 500 errors or service won't start
- [ ] Check logs in Render dashboard
- [ ] Verify environment variables are set correctly
- [ ] Check that build command ran successfully
- [ ] Ensure TypeScript compiled without errors

**Symptom**: CORS errors
- [ ] Verify frontend URL is in CORS whitelist in `backend/src/index.ts`
- [ ] Check that CORS origin includes your actual frontend URL
- [ ] Redeploy backend after fixing CORS

### Frontend Issues
**Symptom**: White screen or app won't load
- [ ] Check build logs for errors
- [ ] Verify `VITE_API_URL` is set correctly
- [ ] Check browser console for errors
- [ ] Ensure Vite build completed successfully

**Symptom**: API calls fail
- [ ] Verify `VITE_API_URL` ends with `/api` (not just base URL)
- [ ] Check network tab to see actual URL being called
- [ ] Verify backend is running and accessible
- [ ] Check for CORS errors

### Free Tier Issues
**Symptom**: Service sleeps after inactivity
- [ ] This is normal for free tier (15 min inactivity)
- [ ] First request takes 30-60 seconds (cold start)
- [ ] Consider setting up ping service (cron-job.org)
- [ ] Or upgrade to paid tier ($7/month) for always-on

## 🎉 Success Criteria

Your deployment is successful when:
- ✅ Backend health check returns success
- ✅ Frontend loads without errors
- ✅ Can view all 10 sample events
- ✅ Can create a new event
- ✅ Can search and filter events
- ✅ Location features work
- ✅ Weather displays correctly
- ✅ Save/reminder features work
- ✅ No console errors
- ✅ No CORS errors

## 📝 URLs to Save

After successful deployment, save these URLs:

```
Frontend: https://___________________.onrender.com
Backend:  https://___________________.onrender.com
Health:   https://___________________.onrender.com/health
API:      https://___________________.onrender.com/api/events
```

## 🔄 Future Updates

To update your deployed app:

```bash
git add .
git commit -m "Your update message"
git push origin main
```

Render will automatically detect and redeploy! 🚀

---

**Need help?** Check [DEPLOYMENT.md](DEPLOYMENT.md) for detailed troubleshooting.
