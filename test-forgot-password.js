const http = require('http');

const makeRequest = (path, data) => {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(data);
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const response = JSON.parse(body);
          resolve({ status: res.statusCode, data: response });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', (e) => reject(e));
    req.write(postData);
    req.end();
  });
};

const testForgotPassword = async () => {
  console.log('🔍 Testing Forgot Password Flow...\n');

  try {
    // Test 1: Request OTP
    console.log('1️⃣ Testing: Request OTP for phone 7411185509');
    const otpResponse = await makeRequest('/api/auth/forgot-password', {
      phone: '7411185509'
    });
    console.log('Status:', otpResponse.status);
    console.log('Response:', JSON.stringify(otpResponse.data, null, 2));
    
    if (otpResponse.status !== 200) {
      console.log('❌ Failed to request OTP');
      return;
    }
    
    console.log('✅ OTP request successful');
    console.log('⚠️  Note: OTP is now sent via SMS (Twilio)');
    console.log('   Check the phone number for the OTP');
    console.log('   Or check backend console for OTP (if Twilio fails)');
    console.log('');
    
    // For testing, ask user to input OTP
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    const otp = await new Promise((resolve) => {
      rl.question('Enter the OTP you received: ', (answer) => {
        rl.close();
        resolve(answer.trim());
      });
    });

    // Test 2: Verify OTP
    console.log('2️⃣ Testing: Verify OTP');
    const verifyResponse = await makeRequest('/api/auth/verify-otp', {
      phone: '7411185509',
      otp: otp
    });
    console.log('Status:', verifyResponse.status);
    console.log('Response:', JSON.stringify(verifyResponse.data, null, 2));
    
    if (verifyResponse.status !== 200) {
      console.log('❌ OTP verification failed');
      return;
    }
    console.log('✅ OTP verified successfully');
    console.log('');

    // Test 3: Reset Password
    console.log('3️⃣ Testing: Reset Password');
    const resetResponse = await makeRequest('/api/auth/reset-password', {
      phone: '7411185509',
      otp: otp,
      newPassword: 'NewPassword123'
    });
    console.log('Status:', resetResponse.status);
    console.log('Response:', JSON.stringify(resetResponse.data, null, 2));
    
    if (resetResponse.status !== 200) {
      console.log('❌ Password reset failed');
      return;
    }
    console.log('✅ Password reset successful');
    console.log('');

    // Test 4: Login with new password
    console.log('4️⃣ Testing: Login with new password');
    const loginResponse = await makeRequest('/api/auth/login', {
      phone: '7411185509',
      password: 'NewPassword123'
    });
    console.log('Status:', loginResponse.status);
    console.log('Response:', JSON.stringify(loginResponse.data, null, 2));
    
    if (loginResponse.status === 200) {
      console.log('✅ Login with new password successful');
    } else {
      console.log('❌ Login with new password failed');
    }

    console.log('\n🎉 All tests completed!');

  } catch (error) {
    console.error('❌ Test error:', error.message);
  }
};

// Check if server is running first
const checkServer = () => {
  return new Promise((resolve) => {
    const req = http.request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/health',
      method: 'GET',
      timeout: 2000
    }, (res) => {
      resolve(true);
    });

    req.on('error', () => resolve(false));
    req.on('timeout', () => {
      req.destroy();
      resolve(false);
    });
    req.end();
  });
};

checkServer().then((isRunning) => {
  if (isRunning) {
    testForgotPassword();
  } else {
    console.log('❌ Backend server is not running on port 5000');
    console.log('Please start the backend server first: cd backend && npm run dev');
  }
});