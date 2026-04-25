require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function resetAdminPass() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const admin = await User.findOne({ email: 'admin@mediaid.ai' });
    if (!admin) {
      console.log('❌ Admin user NOT FOUND.');
      process.exit(1);
    }

    admin.password = 'Admin@123';
    await admin.save();

    console.log('✅ Admin password has been reset to: Admin@123');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

resetAdminPass();
