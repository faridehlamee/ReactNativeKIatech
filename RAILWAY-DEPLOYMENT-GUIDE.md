# 🚀 Railway Deployment Guide

## 📋 Prerequisites

1. **Railway Account** - Sign up at [railway.app](https://railway.app)
2. **MongoDB Atlas** - Set up a cloud database
3. **Firebase Project** - For push notifications
4. **GitHub Repository** - Your code must be on GitHub

## 🎯 Step-by-Step Deployment

### 1. Create New Railway Project

1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose your `ReactNativeKiatech` repository
5. Select **"Deploy Now"**

### 2. Configure Build Settings

Railway should auto-detect Node.js, but if not:
- **Build Command:** `cd backend && npm install --include=dev && npm run build`
- **Start Command:** `cd backend && npm run start`
- **Root Directory:** Leave empty (or set to `backend`)

### 3. Set Environment Variables

Go to Railway Dashboard → Your Project → Settings → Variables

Add these variables:

```
NODE_ENV=production
PORT=3001
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secret_jwt_key_here
CORS_ORIGIN=https://your-website-domain.vercel.app
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_CLIENT_EMAIL=your_firebase_client_email
FIREBASE_PRIVATE_KEY=your_firebase_private_key
```

### 4. Deploy

1. Railway will automatically build and deploy
2. Check **Build Logs** for any errors
3. Check **Deploy Logs** for startup success
4. Test the health endpoint: `https://your-project.up.railway.app/health`

## 🔧 Troubleshooting

### Build Errors
- Check that TypeScript is installed
- Verify all dependencies are in package.json
- Check build logs for specific errors

### Runtime Errors
- Verify environment variables are set
- Check MongoDB connection string
- Verify Firebase credentials

### Health Check Failures
- Ensure `/health` endpoint is working
- Check server is listening on correct port
- Verify no startup errors in logs

## 📱 Testing Push Notifications

1. **Test API endpoints:**
   - `GET /health` - Health check
   - `POST /api/notifications/send` - Send notification

2. **Use the admin panel:**
   - Open `admin-panel.html` in browser
   - Update API URL to your Railway domain
   - Test sending notifications

## 🎉 Success Indicators

- ✅ Build logs show successful TypeScript compilation
- ✅ Deploy logs show "Server running on port 3001"
- ✅ Health endpoint returns 200 OK
- ✅ Admin panel can connect to API
- ✅ Push notifications work on mobile devices

## 📞 Support

If you encounter issues:
1. Check Railway logs first
2. Verify all environment variables
3. Test endpoints individually
4. Check MongoDB and Firebase connections
