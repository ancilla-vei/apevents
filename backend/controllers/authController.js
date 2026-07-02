const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const twilio = require('twilio');

// Initialize Twilio client
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' });

// Generate 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

exports.register = async (req, res) => {
  try {
    const { name, phone, password, email } = req.body;
    if (!name || !phone || !password) return res.status(400).json({ message: 'Name, phone, and password required' });
    const exists = await User.findOne({ phone });
    if (exists) return res.status(400).json({ message: 'Phone number already registered' });
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, phone, password: hashed, email, role: 'customer' });
    const token = signToken(user._id);
    res.status(201).json({ token, user: { id: user._id, name: user.name, phone: user.phone, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { phone, password } = req.body;
    if (!phone || !password) return res.status(400).json({ message: 'Phone and password required' });
    const user = await User.findOne({ phone });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });
    const token = signToken(user._id);
    res.json({ token, user: { id: user._id, name: user.name, phone: user.phone, role: user.role, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, email, address } = req.body;
    const user = await User.findByIdAndUpdate(req.user._id, { name, email, address }, { new: true }).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);
    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) return res.status(400).json({ message: 'Current password incorrect' });
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: 'Password updated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Forgot Password - Send OTP to phone
exports.forgotPassword = async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ message: 'Phone number is required' });
    
    const user = await User.findOne({ phone });
    if (!user) return res.status(404).json({ message: 'No account found with this phone number' });
    
    // Generate OTP and set expiry (10 minutes)
    const otp = generateOTP();
    const otpExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
    
    user.resetPasswordOTP = otp;
    user.resetPasswordExpire = otpExpire;
    await user.save();
    
    // Send OTP via Twilio SMS
    try {
      await twilioClient.messages.create({
        body: `Your AP Events password reset OTP is: ${otp}. Valid for 10 minutes. Do not share this with anyone.`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: `+91${phone}` // Change country code as needed
      });
      console.log(`OTP sent successfully to ${phone}`);
    } catch (smsError) {
      console.error('Failed to send SMS:', smsError.message);
      // Still return success to user but log the error
      // In production, you might want to handle this differently
    }
    
    res.json({ 
      message: 'OTP sent to your phone number'
      // OTP removed from response for security
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Verify OTP
exports.verifyOTP = async (req, res) => {
  try {
    const { phone, otp } = req.body;
    if (!phone || !otp) return res.status(400).json({ message: 'Phone and OTP are required' });
    
    const user = await User.findOne({ phone });
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    // Check if OTP matches and is not expired
    if (user.resetPasswordOTP !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }
    
    if (Date.now() > user.resetPasswordExpire) {
      return res.status(400).json({ message: 'OTP has expired. Please request a new one' });
    }
    
    // OTP is valid - mark as verified (you can add a flag if needed)
    res.json({ message: 'OTP verified successfully', verified: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Reset Password
exports.resetPassword = async (req, res) => {
  try {
    const { phone, otp, newPassword } = req.body;
    if (!phone || !otp || !newPassword) {
      return res.status(400).json({ message: 'Phone, OTP, and new password are required' });
    }
    
    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }
    
    const user = await User.findOne({ phone });
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    // Verify OTP again
    if (user.resetPasswordOTP !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }
    
    if (Date.now() > user.resetPasswordExpire) {
      return res.status(400).json({ message: 'OTP has expired. Please request a new one' });
    }
    
    // Update password
    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordOTP = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    
    res.json({ message: 'Password reset successful' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
