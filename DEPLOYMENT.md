# AP Events - Deployment Guide

This guide covers deploying the AP Events application to Render (backend) and Vercel (frontend).

## Prerequisites

- GitHub repository with your code
- MongoDB database (MongoDB Atlas recommended)
- Render account (https://render.com)
- Vercel account (https://vercel.com)

---

## Part 1: Deploy Backend to Render

### Step 1: Prepare Your Repository

Ensure your code is pushed to GitHub with these files:
- `render.yaml` (already created)
- `backend/` folder with all backend code
- `backend/package.json`
- `backend/.env` (DO NOT commit this - use Render environment variables instead)

### Step 2: Create MongoDB Database

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas/database)
2. Create a free cluster
3. Get your connection string (looks like: `mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/ap-events?retryWrites=true&w=majority`)
4. Whitelist Render's IP addresses (or use 0.0.0.0/0 for testing)

### Step 3: Deploy to Render

#### Option A: Using render.yaml (Recommended)

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Blueprint"**
3. Connect your GitHub repository
4. Render will automatically detect `render.yaml`
5. Click **"Apply"**

#### Option B: Manual Setup

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure:
   - **Name:** `ap-events-backend`
   - **Environment:** `Node`
   - **Plan:** `Free`
   - **Build Command:** `cd backend && npm install`
   - **Start Command:** `cd backend && npm start`
   - **Root Directory:** (leave empty)

5. Add Environment Variables:
   ```
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_random_jwt_secret_key_here
   JWT_EXPIRE=7d
   ADMIN_PHONE=7411185509
   ADMIN_PASSWORD=Pachu@123
   FRONTEND_URL=https://your-frontend-app.vercel.app
   ```

6. Click **"Create Web Service"**

### Step 4: Verify Backend Deployment

- Your backend will be available at: `https://ap-events-backend.onrender.com`
- Test health endpoint: `https://ap-events-backend.onrender.com/api/health`
- You should see: `{"status":"AP Events API running",...}`

---

## Part 2: Deploy Frontend to Vercel

### Step 1: Update Frontend Configuration

Before deploying, update `frontend/.env` for production:

```env
REACT_APP_API_URL=https://ap-events-backend.onrender.com/api
```

**Important:** Replace `ap-events-backend` with your actual Render service name.

### Step 2: Deploy to Vercel

#### Option A: Using Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

3. Deploy:
   ```bash
   vercel
   ```

4. Follow the prompts:
   - Set up and deploy? `Y`
   - Which scope? (select your account)
   - Link to existing project? `N`
   - Project name? `ap-events-frontend` (or your choice)
   - In which directory is your code located? `./`
   - Want to modify settings? `N`

#### Option B: Using Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Configure:
   - **Framework Preset:** `Create React App`
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build` (auto-detected)
   - **Output Directory:** `build` (auto-detected)

5. Add Environment Variable:
   - **Key:** `REACT_APP_API_URL`
   - **Value:** `https://ap-events-backend.onrender.com/api`

6. Click **"Deploy"**

### Step 3: Verify Frontend Deployment

- Your frontend will be available at: `https://ap-events-frontend.vercel.app`
- Test the login page
- Try registering a new account
- Test admin login with:
  - Phone: `7411185509`
  - Password: `Pachu@123`

---

## Part 3: Post-Deployment Configuration

### Update CORS Settings

After deploying both services, update your backend's `FRONTEND_URL` environment variable in Render:

1. Go to Render Dashboard → Your Web Service
2. Click **"Environment"** tab
3. Update `FRONTEND_URL` to your Vercel URL: `https://ap-events-frontend.vercel.app`
4. Click **"Save Changes"** (this will redeploy)

### Update vercel.json (if using)

If you're using the `vercel.json` file, update the API URL:

```json
{
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "https://ap-events-backend.onrender.com/api/$1"
    }
  ],
  "env": {
    "REACT_APP_API_URL": "https://ap-events-backend.onrender.com/api"
  }
}
```

---

## Part 4: Custom Domain (Optional)

### For Render (Backend)

1. Go to Render Dashboard → Your Service
2. Click **"Settings"** → **"Custom Domains"**
3. Add your domain (e.g., `api.yourapp.com`)
4. Update DNS records as instructed

### For Vercel (Frontend)

1. Go to Vercel Dashboard → Your Project
2. Click **"Settings"** → **"Domains"**
3. Add your domain (e.g., `yourapp.com` or `www.yourapp.com`)
4. Update DNS records as instructed

---

## Environment Variables Summary

### Backend (Render)

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment | `production` |
| `PORT` | Server port | `5000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://...` |
| `JWT_SECRET` | JWT signing secret | `your_secret_key` |
| `JWT_EXPIRE` | Token expiration | `7d` |
| `ADMIN_PHONE` | Admin phone number | `7411185509` |
| `ADMIN_PASSWORD` | Admin password | `Pachu@123` |
| `FRONTEND_URL` | Frontend URL for CORS | `https://your-app.vercel.app` |

### Frontend (Vercel)

| Variable | Description | Example |
|----------|-------------|---------|
| `REACT_APP_API_URL` | Backend API URL | `https://ap-events-backend.onrender.com/api` |

---

## Troubleshooting

### Backend Issues

1. **MongoDB Connection Error:**
   - Check MongoDB Atlas cluster is running
   - Verify connection string is correct
   - Ensure IP whitelist includes Render (0.0.0.0/0)

2. **CORS Errors:**
   - Verify `FRONTEND_URL` matches your Vercel domain exactly
   - Check for trailing slashes

3. **Build Failures:**
   - Check Render logs for specific errors
   - Ensure all dependencies are in `package.json`

### Frontend Issues

1. **API Calls Failing:**
   - Verify `REACT_APP_API_URL` is set correctly
   - Check backend is running and accessible
   - Test API endpoint directly in browser

2. **Blank Page:**
   - Check browser console for errors
   - Verify build completed successfully in Vercel

3. **Login Not Working:**
   - Clear browser localStorage
   - Check network tab for failed requests
   - Verify backend `/api/auth/login` endpoint works

---

## Useful Commands

### Local Development
```bash
# Install all dependencies
npm run install-all

# Run both backend and frontend
npm run dev

# Run only backend
npm run dev-backend

# Run only frontend
npm run dev-frontend
```

### Testing Deployment
```bash
# Test backend health
curl https://your-backend.onrender.com/api/health

# Test login
curl -X POST https://your-backend.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"phone":"7411185509","password":"Pachu@123"}'
```

---

## Cost Estimate

- **Render (Backend):** Free tier available (750 hours/month)
- **Vercel (Frontend):** Free tier available (100GB bandwidth/month)
- **MongoDB Atlas:** Free tier (512MB storage)

**Total: $0/month** for small to medium usage!

---

## Next Steps

1. ✅ Deploy backend to Render
2. ✅ Deploy frontend to Vercel
3. ✅ Update CORS settings
4. ✅ Test all features (login, register, bookings, etc.)
5. ✅ Set up custom domain (optional)
6. ✅ Configure monitoring and alerts (optional)

---

## Support

If you encounter issues:
1. Check Render/Vercel logs
2. Test API endpoints individually
3. Verify environment variables are set correctly
4. Check MongoDB connection