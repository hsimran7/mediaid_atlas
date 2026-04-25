const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // ── Identity
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [60, 'Name cannot exceed 60 characters'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false, // Never return password in queries
  },

  // ── Role & Mode
  role: {
    type: String,
    enum: ['seeker', 'contributor', 'admin'],
    default: 'seeker',
  },

  // ── Profile
  avatar: {
    type: String,
    default: '👤',
  },
  bio: {
    type: String,
    maxlength: [300, 'Bio cannot exceed 300 characters'],
    default: '',
  },
  country: {
    type: String,
    default: '',
  },
  language: {
    type: String,
    default: 'en',
  },
  specialization: {
    type: String,   // e.g. 'Emergency Medicine', 'Traditional Medicine'
    default: '',
  },

  // ── Seeker Stats
  queriesCount: { type: Number, default: 0 },
  lastQuery: { type: String, default: '' },
  savedSolutions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Solution' }],
  viewedSolutions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Solution' }],

  // ── Contributor Stats
  solutionsCount: { type: Number, default: 0 },
  verifiedCount: { type: Number, default: 0 },
  totalViews: { type: Number, default: 0 },
  totalLikes: { type: Number, default: 0 },
  rejectedCount: { type: Number, default: 0 },

  // ── Activity Log (last 20 entries)
  activityLog: [{
    action: String,       // 'query', 'viewed_solution', 'submitted_solution', 'login'
    detail: String,
    timestamp: { type: Date, default: Date.now },
  }],

  // ── Auth
  isActive: { type: Boolean, default: true },
  lastLogin: { type: Date },
  loginCount: { type: Number, default: 0 },

}, { timestamps: true });

// ── Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ── Compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// ── Add activity
userSchema.methods.addActivity = function (action, detail) {
  this.activityLog.unshift({ action, detail, timestamp: new Date() });
  if (this.activityLog.length > 20) this.activityLog = this.activityLog.slice(0, 20);
};

// ── Public profile (no sensitive fields)
userSchema.methods.toPublicJSON = function () {
  return {
    _id: this._id,
    name: this.name,
    email: this.email,
    role: this.role,
    avatar: this.avatar,
    bio: this.bio,
    country: this.country,
    language: this.language,
    specialization: this.specialization,
    queriesCount: this.queriesCount,
    solutionsCount: this.solutionsCount,
    verifiedCount: this.verifiedCount,
    totalViews: this.totalViews,
    totalLikes: this.totalLikes,
    savedSolutions: this.savedSolutions,
    activityLog: this.activityLog,
    lastLogin: this.lastLogin,
    loginCount: this.loginCount,
    createdAt: this.createdAt,
  };
};

module.exports = mongoose.model('User', userSchema);
