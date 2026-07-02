# Debug Admin Login Issue

## Problem: Admin cannot login with correct credentials

## Solution Steps:

### Step 1: Kill any process on port 5000

Open Command Prompt or PowerShell and run:
```bash
netstat -ano | findstr :5000
```

If you see output with a PID (Process ID), kill it:
```bash
taskkill /PID <PID_NUMBER> /F
```

Or kill all node processes:
```bash
taskkill /IM node.exe /F
```

### Step 2: Start Backend Server

```bash
cd backend
npm run dev
```

**Watch the console output carefully!** You should see:
```
✅ MongoDB connected
✅ Admin user seeded
🚀 Server running on port 5000
```

If you see `❌ Error seeding admin user: ...`, that's the problem.

### Step 3: Verify Admin Credentials

The admin credentials are in `backend/.env`:
```
ADMIN_PHONE=7411185509
ADMIN_PASSWORD=Pachu@123
```

**Login with:**
- Phone: `7411185509`
- Password: `Pachu@123`

### Step 4: If Admin User Wasn't Created

The admin user is seeded automatically when the server starts (see `backend/server.js` lines 69-86). If it failed, check:

1. **MongoDB Connection**: Is MongoDB connected? Look for `✅ MongoDB connected`
2. **Error Messages**: Look for `❌ Error seeding admin user: ...`

### Step 5: Manual Admin User Creation (if needed)

If the automatic seeding failed, create admin manually:

```bash
node check-admin.js
```

This script will:
- Connect to MongoDB
- Check if admin exists
- Create admin if not found
- Reset password if mismatch
- Show all users in database

### Step 6: Test Admin Login

Once the server is running, test with:
```bash
node test-login.js
```

Or via frontend:
1. Go to http://localhost:3000/login
2. Enter phone: `7411185509`
3. Enter password: `Pachu@123`
4. Click Login

## Common Issues:

### Issue 1: "Invalid credentials"
**Cause**: Admin user doesn't exist or password is wrong
**Solution**: Run `node check-admin.js` to create/reset admin

### Issue 2: Port 5000 already in use
**Cause**: Another instance of server is running
**Solution**: Kill the process using `taskkill /IM node.exe /F`

### Issue 3: MongoDB connection failed
**Cause**: MongoDB URI is wrong or network issue
**Solution**: Check `backend/.env` file for correct MongoDB URI

### Issue 4: Admin seeded but still can't login
**Cause**: Password might have been changed
**Solution**: Run `node check-admin.js` to reset password

## Quick Fix:

Run these commands in order:

```bash
# 1. Kill all node processes
taskkill /IM node.exe /F

# 2. Start backend server
cd backend
npm run dev

# 3. In a new terminal, check admin user
node check-admin.js

# 4. Test login
node test-login.js
```

## Verification Checklist:

- [ ] Backend server is running on port 5000
- [ ] MongoDB is connected (see console output)
- [ ] Admin user was seeded (see console output)
- [ ] Admin credentials are correct (7411185509 / Pachu@123)
- [ ] No errors in server console
- [ ] Frontend is running on port 3000
- [ ] Can access http://localhost:3000/login

## Still Not Working?

Check the backend server console for error messages. The most common issues are:
1. Admin user not seeded (check for errors during startup)
2. Wrong credentials (verify in .env file)
3. MongoDB not connected (check MongoDB URI)
4. Port already in use (kill existing processes)

## Contact:

If issues persist, check:
- Backend console logs
- MongoDB connection status
- Network connectivity
- Firewall settings