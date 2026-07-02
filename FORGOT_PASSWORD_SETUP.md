# Forgot Password Feature - Setup Guide

## ✅ Implementation Complete

The forgot password feature with OTP verification has been successfully implemented!

## 🎯 How It Works

### Current Flow:
1. User clicks "Forgot Password?" on login page
2. Redirected to `/forgot-password` page
3. User enters their registered phone number
4. System generates a 6-digit OTP (valid for 10 minutes)
5. User enters the OTP
6. System verifies the OTP
7. User sets a new password
8. User can now login with the new password

## 🧪 Testing Results

All tests passed successfully:
- ✅ OTP generation and sending
- ✅ OTP verification
- ✅ Password reset
- ✅ Login with new password

## 📱 Current OTP Delivery Method

**For Development/Testing:**
- OTP is logged to the backend console
- Check the terminal where the backend server is running
- Look for: `Password Reset OTP for 7411185509: 230870`

**Example console output:**
```
✅ MongoDB connected
🚀 Server running on port 5000
Password Reset OTP for 7411185509: 230870
```

## 🚀 Production Deployment - SMS Integration

To actually send OTPs to users' phones, you need to integrate an SMS service. Here are the popular options:

### Option 1: Twilio (Recommended)
1. Sign up at https://www.twilio.com/
2. Get your Account SID, Auth Token, and Twilio phone number
3. Install Twilio SDK:
   ```bash
   cd backend
   npm install twilio
   ```
4. Update `backend/controllers/authController.js`:

```javascript
// Add at the top
const twilio = require('twilio');
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Replace the console.log in forgotPassword function with:
await client.messages.create({
  body: `Your AP Events password reset OTP is: ${otp}. Valid for 10 minutes.`,
  from: process.env.TWILIO_PHONE_NUMBER,
  to: `+91${phone}` // or your country code format
});
```

5. Add to `backend/.env`:
```
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890
```

### Option 2: Fast2SMS (India-specific)
1. Sign up at https://www.fast2sms.com/
2. Get your API key
3. Use their API to send SMS

### Option 3: MSG91
1. Sign up at https://msg91.com/
2. Get your API key and sender ID
3. Integrate their SMS API

## 📁 Files Modified/Created

### Backend:
- `backend/models/User.js` - Added OTP fields
- `backend/controllers/authController.js` - Added forgot password logic
- `backend/routes/auth.js` - Added new routes

### Frontend:
- `frontend/src/context/AuthContext.js` - Added auth functions
- `frontend/src/pages/public/ForgotPasswordPage.js` - New forgot password page
- `frontend/src/App.js` - Added routing
- `frontend/src/pages/public/LoginPage.js` - Updated to link to forgot password

### Testing:
- `test-forgot-password.js` - Test script

## 🔐 Security Features

- OTP expires in 10 minutes
- OTP is cleared after successful password reset
- Password must be at least 6 characters
- OTP is validated before password reset
- Phone number must be registered in the system

## 🎨 User Interface

The forgot password page includes:
- Clean, responsive design
- 3-step process (Phone → OTP → New Password)
- Countdown timer showing OTP expiry
- Back buttons to navigate between steps
- Clear error messages
- Success notifications

## 📝 API Endpoints

### 1. Request OTP
```
POST /api/auth/forgot-password
Body: { "phone": "7411185509" }
Response: { "message": "OTP sent...", "otp": "123456" }
```

### 2. Verify OTP
```
POST /api/auth/verify-otp
Body: { "phone": "7411185509", "otp": "123456" }
Response: { "message": "OTP verified", "verified": true }
```

### 3. Reset Password
```
POST /api/auth/reset-password
Body: { "phone": "7411185509", "otp": "123456", "newPassword": "newpass123" }
Response: { "message": "Password reset successful" }
```

## 🧪 How to Test

1. **Start Backend:**
   ```bash
   cd backend
   npm run dev
   ```

2. **Start Frontend:**
   ```bash
   cd frontend
   npm start
   ```

3. **Test via Frontend:**
   - Go to http://localhost:3000/login
   - Click "Forgot Password?"
   - Enter phone: 7411185509
   - Check backend console for OTP
   - Enter OTP
   - Set new password
   - Login with new password

4. **Test via Script:**
   ```bash
   node test-forgot-password.js
   ```

## ⚠️ Important Notes

1. **Remove OTP from response in production!** Currently the OTP is returned in the API response for testing. In production, remove the `otp` field from the response.

2. **Add rate limiting** to prevent OTP bombing attacks

3. **Add CAPTCHA** to prevent automated requests

4. **Log all password reset attempts** for security auditing

5. **Send confirmation email/SMS** after password is reset

## 🎉 Feature Complete!

The forgot password feature is fully functional and ready to use. Just integrate an SMS service for production use!