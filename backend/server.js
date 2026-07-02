 const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

const dns = require('dns');
const bcrypt = require('bcryptjs');

dotenv.config();

// ✅ DNS override (optional, usually not needed unless you had resolution issues)
dns.setServers(['1.1.1.1', '8.8.8.8']);

const app = express();

// Middleware
const corsOptions = {
  credentials: true,
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = process.env.NODE_ENV === 'production'
      ? [
          process.env.FRONTEND_URL,
          'https://apeventmangalore.netlify.app',
          'https://apeventmanaglore.netlify.app',
          'https://ap-events-frontend.netlify.app',
          'https://apevents-1.onrender.com'
        ].filter(Boolean) // Remove undefined values
      : ['https://apeventmanglore.netlify.app', 'http://localhost:3000'];
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  }
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/quotations', require('./routes/quotations'));
app.use('/api/testimonials', require('./routes/testimonials'));
app.use('/api/enquiries', require('./routes/enquiries'));
app.use('/api/services', require('./routes/services'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/gallery', require('./routes/gallery'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/customers', require('./routes/customers'));
app.use('/api/settings', require('./routes/settings'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'AP Events API running', timestamp: new Date().toISOString() });
});

// Global error handler (so you see real errors instead of silent 500s)
app.use((err, req, res, next) => {
  console.error('❌ Internal server error:', err.stack);
  res.status(500).json({ success: false, message: 'Internal Server Error' });
});

// Connect DB and start server
mongoose.connect(process.env.MONGODB_URI)

  .then(async () => {
    console.log('✅ MongoDB connected');
    await seedAdmin();
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`API: http://localhost:${PORT}/api`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

// Seed admin user
async function seedAdmin() {
  try {
    const User = require('./models/User');
    const adminPhone = process.env.ADMIN_PHONE || '7411185509';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Pachu@123';
    
    console.log(`\n🔍 Checking for admin user with phone: ${adminPhone}`);
    
    const existing = await User.findOne({ phone: adminPhone });
    
    if (!existing) {
      console.log('📝 Admin user not found, creating new admin user...');
      const hashed = await bcrypt.hash(adminPassword, 10);
      const admin = await User.create({
        name: 'Admin',
        phone: adminPhone,
        password: hashed,
        role: 'admin'
      });
      console.log('✅ Admin user created successfully');
      console.log(`   Phone: ${admin.phone}`);
      console.log(`   Role: ${admin.role}`);
      console.log(`   Password hash: ${admin.password.substring(0, 20)}...`);
    } else {
      console.log('✅ Admin user already exists');
      console.log(`   Phone: ${existing.phone}`);
      console.log(`   Name: ${existing.name}`);
      console.log(`   Role: ${existing.role}`);
      
      // Verify password is correct
      const isMatch = await bcrypt.compare(adminPassword, existing.password);
      console.log(`   Password match test: ${isMatch ? '✅ PASS' : '❌ FAIL'}`);
      
      if (!isMatch) {
        console.log('⚠️  Password mismatch detected, resetting password...');
        existing.password = await bcrypt.hash(adminPassword, 10);
        await existing.save();
        console.log('✅ Password reset successful');
      }
    }
  } catch (err) {
    console.error('❌ Error seeding admin user:', err.message);
    console.error('   Stack:', err.stack);
  }
}
