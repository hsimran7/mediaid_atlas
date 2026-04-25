require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function checkAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const admin = await User.findOne({ email: 'admin@mediaid.ai' });
    if (admin) {
      console.log('🛡️ Admin found:');
      console.log('   Email:', admin.email);
      console.log('   Name:', admin.name);
      console.log('   Role:', admin.role);
      console.log('   IsActive:', admin.isActive);
    } else {
      console.log('❌ Admin user NOT FOUND in database.');
    }

    const allUsers = await User.find({}, 'email role');
    console.log('\n👥 Total users in DB:', allUsers.length);
    console.log(allUsers);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkAdmin();
