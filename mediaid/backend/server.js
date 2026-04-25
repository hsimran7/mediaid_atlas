require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');

const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const solutionRoutes = require('./routes/solutionRoutes');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const errorHandler = require('./middleware/errorHandler');

// ── Connect DB
connectDB();

const app = express();
app.set('trust proxy', 1); // Enable if behind a proxy (Heroku, Nginx, etc.)

// ── Security Middleware
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));

// ── CORS
const corsOptions = {
  origin: function (origin, callback) {
    const allowed = [
      process.env.FRONTEND_URL,
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:5175',
      'http://localhost:3000',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:5174',
    ].filter(Boolean);

    // Allow requests with no origin (mobile, Postman, curl)
    // Or allow any localhost/127.0.0.1 origin in development
    const isLocal = origin && (origin.startsWith('http://localhost') || origin.startsWith('http://127.0.0.1'));
    
    if (!origin || allowed.includes(origin) || (process.env.NODE_ENV === 'development' && isLocal)) {
      return callback(null, true);
    }
    
    console.error(`CORS Error: Origin ${origin} not allowed`);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));

// ── Rate Limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 1000, // Very lenient for single user/dev, still blocks massive abuse
  message: { success: false, message: 'Too many requests from this IP. Please try again later.' },
  // Skip auth routes in global limiter to use specific authLimiter instead
  skip: (req) => req.originalUrl.includes('/api/auth/login') || req.originalUrl.includes('/api/auth/register'),
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50, // Increased from 20 to 50 for normal usage
  message: { success: false, message: 'Too many auth attempts. Please try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply limiters
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
app.use('/api/', apiLimiter);

// ── Body Parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ── Logger (dev only)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ── Static Files (uploaded media)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ══════════════════════════════════════════
// ROUTES
// ══════════════════════════════════════════
app.use('/api/auth', authRoutes);
app.use('/api/solutions', solutionRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chat', chatRoutes);

// ── Health Check
app.get('/api/health', (req, res) => {
  const hasAtlas = (process.env.MONGO_URI || '').includes('mongodb.net');
  const hasGemini = !!(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here');
  const hasCloudinary = !!(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_CLOUD_NAME !== 'your_cloud_name');
  res.json({
    success: true,
    message: '🩺 MediAid AI API is running',
    version: '2.0.0',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    services: {
      database: hasAtlas ? '☁️ MongoDB Atlas' : '🖥 Local MongoDB',
      ai: hasGemini ? '🤖 Gemini AI Active' : '📋 Rule-based Fallback',
      storage: hasCloudinary ? '☁️ Cloudinary' : '🖥 Local Disk',
    },
  });
});

// ── 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found.` });
});

// ── Error Handler
app.use(errorHandler);

// ── Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🩺 MediAid AI Backend`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
  console.log(`📡 API: http://localhost:${PORT}/api`);
  console.log(`❤️  Health: http://localhost:${PORT}/api/health`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
});

module.exports = app;
