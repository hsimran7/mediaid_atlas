require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function verifyPassword() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const admin = await User.findOne({ email: 'admin@mediaid.ai' }).select('+password');
    if (!admin) {
      console.log('❌ Admin user NOT FOUND.');
      process.exit(1);
    }

    const testPasswords = ['Admin@123', 'admin@123', 'Password123', 'admin', 'Admin'];
    
    console.log('\n🧪 Testing passwords for admin@mediaid.ai:');
    for (const pass of testPasswords) {
      const isMatch = await admin.comparePassword(pass);
      console.log(`   - "${pass}": ${isMatch ? '✅ MATCH' : '❌ NO MATCH'}`);
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

verifyPassword();
