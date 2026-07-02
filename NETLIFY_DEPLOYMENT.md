# Deploy to Render (Backend) + Netlify (Frontend)

## Part 1: Deploy Backend to Render

### Step 1: Create MongoDB Database

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas/database)
2. Create a free cluster
3. Get your connection string
4. Whitelist IPs: `0.0.0.0/0` (allows Render to connect)

### Step 2: Deploy Backend

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Blueprint"**
3. Connect your GitHub repository
4. Render auto-detects `render.yaml`
5. Click **"Apply"**

**OR Manual Setup:**

1. Click **"New +"** → **"Web Service"**
2. Connect GitHub repo
3. Configure:
   - **Name:** `ap-events-backend`
   - **Environment:** `Node`
   - **Plan:** `Free`
   - **Build Command:** `cd backend && npm install`
   - **Start Command:** `cd backend && npm start`

4. Add Environment Variables:
   ```
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_random_secret_key
   JWT_EXPIRE=7d
   ADMIN_PHONE=7411185509
   ADMIN_PASSWORD=Pachu@123
   CLOUDINARY_CLOUD_NAME=dvxhz7mzs
   CLOUDINARY_API_KEY=871415738924679
   CLOUDINARY_API_SECRET=1ShDGzIG3c7BW3PPc04iKLN7nDM
   FRONTEND_URL=https://your-site.netlify.app
   ```

5. Click **"Create Web Service"**

### Step 3: Verify Backend

Test: `https://ap-events-backend.onrender.com/api/health`

---

## Part 2: Deploy Frontend to Netlify

### Step 1: Update frontend/.env

```env
REACT_APP_API_URL=https://ap-events-backend.onrender.com/api
```

**Important:** Replace with your actual Render backend URL.

### Step 2: Deploy to Netlify

#### Option A: Netlify CLI (Recommended)

```bash
# Install CLI
npm install -g netlify-cli

# Navigate to frontend
cd frontend

# Build
npm run build

# Deploy
netlify deploy --prod --dir=build
```

Follow prompts:
- Authorize Netlify
- Create new site
- Site name: `ap-events-frontend`

#### Option B: Netlify Dashboard

1. Go to [Netlify Dashboard](https://app.netlify.com)
2. Click **"Add new site"** → **"Import an existing project"**
3. Connect GitHub repository
4. Configure:
   - **Branch:** `main`
   - **Base directory:** `frontend`
   - **Build command:** `npm run build`
   - **Publish directory:** `frontend/build`

5. Add Environment Variable:
   - **Key:** `REACT_APP_API_URL`
   - **Value:** `https://ap-events-backend.onrender.com/api`

6. Click **"Deploy site"**

### Step 3: Verify Frontend

Your site will be at: `https://ap-events-frontend.netlify.app`

---

## Part 3: Post-Deployment

### Update CORS in Render

1. Go to Render → Your Service → **Environment**
2. Update `FRONTEND_URL` to your Netlify URL
3. Click **"Save Changes"**

### Test Login

- Phone: `7411185509`
- Password: `Pachu@123`

---

## Environment Variables

### Backend (Render)
```
NODE_ENV=production
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_secret
JWT_EXPIRE=7d
ADMIN_PHONE=7411185509
ADMIN_PASSWORD=Pachu@123
CLOUDINARY_CLOUD_NAME=dvxhz7mzs
CLOUDINARY_API_KEY=871415738924679
CLOUDINARY_API_SECRET=1ShDGzIG3c7BW3PPc04iKLN7nDM
FRONTEND_URL=https://your-site.netlify.app
```

### Frontend (Netlify)
```
REACT_APP_API_URL=https://ap-events-backend.onrender.com/api
```

---

## Custom Domain (Optional)

### Netlify
1. Site settings → Domain management → Custom domains
2. Add your domain
3. Update DNS

### Render
1. Settings → Custom Domains
2. Add your domain
3. Update DNS

---

## Troubleshooting

**CORS Errors:**
- Ensure `FRONTEND_URL` in Render matches Netlify URL exactly
- No trailing slashes

**Images Not Loading:**
- Cloudinary credentials must be in Render environment variables
- Check Cloudinary dashboard for uploaded images

**Login Fails:**
- Clear browser cache
- Check Network tab for errors
- Verify backend is running

---

## Cost: $0/month
- Render: Free (750 hrs/month)
- Netlify: Free (100GB bandwidth)
- MongoDB Atlas: Free (512MB)
- Cloudinary: Free tier available