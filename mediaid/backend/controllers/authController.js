const User = require('../models/User');
const { sendTokenResponse } = require('../utils/token');
const { validationResult } = require('express-validator');

// ══════════════════════════════════════════
// @route   POST /api/auth/register
// @access  Public
// ══════════════════════════════════════════
exports.register = async (req, res, next) => {
  try {
    // Log incoming request for debugging
    console.log('📝 Register request received:', {
      name: req.body.name,
      email: req.body.email,
      role: req.body.role,
      country: req.body.country,
    });

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('❌ Validation errors:', errors.array());
      return res.status(400).json({ success: false, message: errors.array()[0].msg });
    }

    const { name, email, password, role, country, language } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('❌ Email already exists:', email);
      return res.status(409).json({ success: false, message: 'Email already registered.' });
    }

    // Create the user
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'seeker',
      country: country || '',
      language: language || 'en',
      avatar: role === 'contributor' ? '🌿' : role === 'admin' ? '🛡️' : '👤',
    });

    console.log('✅ New user created in Atlas:', user.email, '| Role:', user.role);

    user.addActivity('register', `Joined MediAid AI as ${user.role}`);
    await user.save();

    sendTokenResponse(user, 201, res, `Registration successful. Welcome to MediAid AI, ${user.name}!`);

  } catch (error) {
    console.error('❌ Register error:', error.message);
    next(error);
  }
};

// ══════════════════════════════════════════
// @route   POST /api/auth/login
// @access  Public
// ══════════════════════════════════════════
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    console.log('🔑 Login attempt:', email);

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user || !user.isActive) {
      console.log('❌ User not found or inactive:', email);
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log('❌ Wrong password for:', email);
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    user.lastLogin = new Date();
    user.loginCount += 1;
    user.addActivity('login', `Logged in`);
    await user.save();

    console.log('✅ Login successful:', email, '| Login count:', user.loginCount);

    sendTokenResponse(user, 200, res, `Welcome back, ${user.name}!`);

  } catch (error) {
    console.error('❌ Login error:', error.message);
    next(error);
  }
};

// ══════════════════════════════════════════
// @route   GET /api/auth/me
// @access  Private
// ══════════════════════════════════════════
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('savedSolutions', 'title mediaType condition severity status createdAt')
      .populate('viewedSolutions', 'title mediaType condition');

    res.json({ success: true, user: user.toPublicJSON() });
  } catch (error) {
    next(error);
  }
};

// ══════════════════════════════════════════
// @route   PUT /api/auth/profile
// @access  Private
// ══════════════════════════════════════════
exports.updateProfile = async (req, res, next) => {
  try {
    const allowed = ['name', 'bio', 'country', 'language', 'specialization', 'avatar'];
    const updates = {};
    allowed.forEach(field => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true, runValidators: true,
    });

    user.addActivity('profile_update', 'Updated profile');
    await user.save();

    console.log('✅ Profile updated for:', user.email);
    res.json({ success: true, message: 'Profile updated.', user: user.toPublicJSON() });
  } catch (error) {
    next(error);
  }
};

// ══════════════════════════════════════════
// @route   PUT /api/auth/change-password
// @access  Private
// ══════════════════════════════════════════
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Both current and new password are required.' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters.' });
    }

    const user = await User.findById(req.user._id).select('+password');
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect.' });
    }

    user.password = newPassword;
    user.addActivity('password_change', 'Changed password');
    await user.save();

    res.json({ success: true, message: 'Password changed successfully.' });
  } catch (error) {
    next(error);
  }
};

// ══════════════════════════════════════════
// @route   GET /api/auth/dashboard
// @access  Private
// ══════════════════════════════════════════
exports.getDashboard = async (req, res, next) => {
  try {
    const Solution = require('../models/Solution');
    const user = req.user;

    let dashboardData = {
      user: user.toPublicJSON(),
    };

    if (user.role === 'seeker' || user.role === 'admin') {
      const recentSolutions = await Solution.find({ status: 'approved' })
        .sort({ createdAt: -1 })
        .limit(6)
        .populate('author', 'name avatar');

      const savedSolutions = await Solution.find({
        _id: { $in: user.savedSolutions },
        status: 'approved',
      }).populate('author', 'name avatar');

      dashboardData.recentSolutions = recentSolutions;
      dashboardData.savedSolutions = savedSolutions;
      dashboardData.activityLog = user.activityLog.slice(0, 10);
    }

    if (user.role === 'contributor' || user.role === 'admin') {
      const mySolutions = await Solution.find({ author: user._id })
        .sort({ createdAt: -1 });

      const stats = {
        total: mySolutions.length,
        pending: mySolutions.filter(s => s.status === 'pending').length,
        approved: mySolutions.filter(s => s.status === 'approved').length,
        rejected: mySolutions.filter(s => s.status === 'rejected').length,
        totalViews: mySolutions.reduce((sum, s) => sum + s.views, 0),
        totalLikes: mySolutions.reduce((sum, s) => sum + s.likesCount, 0),
      };

      dashboardData.mySolutions = mySolutions;
      dashboardData.contributorStats = stats;
    }

    res.json({ success: true, dashboard: dashboardData });
  } catch (error) {
    next(error);
  }
};
