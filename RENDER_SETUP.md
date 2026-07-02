# Render Deployment - Manual Setup (Recommended)

Since Render Blueprint might not detect the configuration properly, use this manual setup guide.

## Step 1: Prepare Your Repository

Make sure these files are committed to GitHub:
- ✅ `render.yaml`
- ✅ `package.json` (root - with render-build and render-start scripts)
- ✅ `backend/` folder
- ✅ `backend/package.json`
- ✅ `netlify.toml` (for frontend)

## Step 2: Create Web Service on Render

1. Go to https://dashboard.render.com
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository: `ancilla-vei/apevents`
4. Configure the service:

### Basic Settings:
- **Name:** `ap-events-backend`
- **Environment:** `Node`
- **Plan:** `Free`
- **Region:** Choose closest to you (e.g., Singapore or Mumbai)

### Build & Deploy Settings:
- **Root Directory:** Leave EMPTY (or `.`)
- **Build Command:** `cd backend && npm install`
- **Start Command:** `cd backend && node server.js`

**Important:** Do NOT use `npm start` as it might run dev mode. Use `node server.js` directly.

## Step 3: Add Environment Variables

Click the **"Environment"** tab and add these variables:

### Required:
```
NODE_ENV=production
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_random_secret_key_here_make_it_long_and_secure
JWT_EXPIRE=7d
```

### Admin Credentials:
```
ADMIN_PHONE=7411185509
ADMIN_PASSWORD=Pachu@123
```

### Cloudinary (for image uploads):
```
CLOUDINARY_CLOUD_NAME=dvxhz7mzs
CLOUDINARY_API_KEY=871415738924679
CLOUDINARY_API_SECRET=1ShDGzIG3c7BW3PPc04iKLN7nDM
```

### CORS (update after frontend deploys):
```
FRONTEND_URL=https://your-site.netlify.app
```
**Note:** Initially you can leave this blank or set to `*`, then update it after deploying frontend.

## Step 4: Deploy

1. Click **"Create Web Service"**
2. Wait for build to complete (2-3 minutes)
3. Check the logs for any errors

## Step 5: Verify Deployment

### Test Health Endpoint:
Open in browser: `https://ap-events-backend.onrender.com/api/health`

Should return:
```json
{
  "status": "AP Events API running",
  "timestamp": "2026-06-30T..."
}
```

### Test Login:
```bash
curl -X POST https://ap-events-backend.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"phone":"7411185509","password":"Pachu@123"}'
```

Should return a JWT token and user data.

## Step 6: Deploy Frontend to Netlify

1. Update `frontend/.env`:
   ```env
   REACT_APP_API_URL=https://ap-events-backend.onrender.com/api
   ```

2. Go to https://app.netlify.com
3. **Add new site** → **Import an existing project**
4. Connect GitHub repo
5. Configure:
   - **Branch:** `main`
   - **Base directory:** `frontend`
   - **Build command:** `npm run build`
   - **Publish directory:** `frontend/build`

6. Add environment variable:
   - **Key:** `REACT_APP_API_URL`
   - **Value:** `https://ap-events-backend.onrender.com/api`

7. Click **"Deploy site"**

## Step 7: Update CORS

After frontend deploys:
1. Copy your Netlify URL (e.g., `https://ap-events-frontend.netlify.app`)
2. Go to Render → Your Service → **Environment**
3. Update `FRONTEND_URL` to your Netlify URL
4. Click **"Save Changes"** (triggers redeploy)

## Troubleshooting

### Build Fails:
- Check Render logs for specific errors
- Ensure MongoDB URI is correct
- Verify all environment variables are set

### App Crashes on Start:
- Check logs for "MongoDB connected" message
- If no MongoDB message, check connection string
- Ensure JWT_SECRET is set

### CORS Errors:
- Verify FRONTEND_URL matches Netlify URL exactly
- No trailing slashes
- Include `https://` prefix

### Images Not Uploading:
- Verify Cloudinary credentials in Render environment variables
- Check Cloudinary dashboard to see if images are being uploaded

## MongoDB Atlas Setup

If you haven't set up MongoDB yet:

1. Go to https://www.mongodb.com/atlas/database
2. Create free account
3. Build a cluster (choose FREE tier)
4. Create database user:
   - Username: `admin`
   - Password: (generate strong password)
5. Whitelist IP: `0.0.0.0/0` (allows all IPs)
6. Get connection string:
   - Click "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your password
   - Replace `<dbname>` with `ap-events`
7. Paste into Render's `MONGODB_URI` variable

## Your URLs

After deployment:
- **Backend API:** `https://ap-events-backend.onrender.com`
- **Frontend:** `https://ap-events-frontend.netlify.app`
- **Admin Login:** 
  - Phone: `7411185509`
  - Password: `Pachu@123`

## Cost: $0/month
- Render: Free (750 hrs/month)
- Netlify: Free (100GB bandwidth)
- MongoDB Atlas: Free (512MB storage)
- Cloudinary: Free tier