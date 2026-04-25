const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Atlas-optimized connection options
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000, // 10s timeout for Atlas cold starts
      socketTimeoutMS: 45000,
      maxPoolSize: 10,                 // Atlas free tier connection limit
      retryWrites: true,
    });

    const host = conn.connection.host;
    const isAtlas = host.includes('mongodb.net');

    console.log(`✅ MongoDB Connected: ${host}`);
    console.log(`   Database: ${conn.connection.name}`);
    console.log(`   Provider: ${isAtlas ? '☁️  MongoDB Atlas (Cloud)' : '🖥  Local MongoDB'}`);

    // ── Connection event listeners
    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  MongoDB disconnected. Attempting to reconnect...');
    });
    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnected.');
    });
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err.message);
    });

  } catch (error) {
    console.error(`❌ MongoDB Connection Failed: ${error.message}`);
    if (error.message.includes('ECONNREFUSED')) {
      console.error('   → Is MongoDB running locally? Or check your Atlas URI.');
    }
    if (error.message.includes('bad auth') || error.message.includes('Authentication failed')) {
      console.error('   → Wrong Atlas username/password in MONGO_URI.');
    }
    if (error.message.includes('IP') || error.message.includes('whitelist')) {
      console.error('   → Your IP is not whitelisted in Atlas Network Access.');
    }
    process.exit(1);
  }
};

module.exports = connectDB;
