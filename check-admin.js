const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: './backend/.env' });

const User = require('./backend/models/User');

async function checkAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Check if admin user exists
    const admin = await User.findOne({ phone: '7411185509' });
    
    if (!admin) {
      console.log('❌ Admin user not found in database');
      console.log('Creating admin user...');
      
      const hashedPassword = await bcrypt.hash('Pachu@123', 10);
      const newAdmin = await User.create({
        name: 'Admin',
        phone: '7411185509',
        password: hashedPassword,
        role: 'admin'
      });
      
      console.log('✅ Admin user created successfully');
      console.log('Phone:', newAdmin.phone);
      console.log('Role:', newAdmin.role);
    } else {
      console.log('✅ Admin user found:');
      console.log('Phone:', admin.phone);
      console.log('Name:', admin.name);
      console.log('Role:', admin.role);
      console.log('Email:', admin.email);
      
      // Test password
      const isMatch = await bcrypt.compare('Pachu@123', admin.password);
      console.log('\nPassword test:');
      console.log('Input: Pachu@123');
      console.log('Match:', isMatch);
      
      if (!isMatch) {
        console.log('\n⚠️  Password mismatch! Resetting password...');
        admin.password = await bcrypt.hash('Pachu@123', 10);
        await admin.save();
        console.log('✅ Password reset successful');
      }
    }

    // List all users
    console.log('\n📋 All users in database:');
    const allUsers = await User.find({}).select('phone name role email');
    allUsers.forEach(user => {
      console.log(`- ${user.phone} (${user.name}) - ${user.role}`);
    });

    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

checkAdmin();