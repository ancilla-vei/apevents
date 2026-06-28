const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const dns = require('dns');
const bcrypt = require('bcryptjs');

dotenv.config();

// ✅ DNS override (optional, usually not needed unless you had resolution issues)
dns.setServers(['1.1.1.1', '8.8.8.8']);

const app = express();

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? process.env.FRONTEND_URL
    : 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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
    const existing = await User.findOne({ phone: process.env.ADMIN_PHONE || '7411185509' });
    if (!existing) {
      const hashed = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Pachu@123', 10);
      await User.create({
        name: 'Admin',
        phone: process.env.ADMIN_PHONE || '7411185509',
        password: hashed,
        role: 'admin'
      });
      console.log('✅ Admin user seeded');
    }
  } catch (err) {
    console.error('❌ Error seeding admin user:', err.message);
  }
}
