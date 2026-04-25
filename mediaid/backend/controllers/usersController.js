const User = require('../models/User');
const Solution = require('../models/Solution');

// ══════════════════════════════════════════
// @route   GET /api/users          (Admin)
// @access  Private/Admin
// ══════════════════════════════════════════
exports.getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, role, search } = req.query;
    const query = {};
    if (role) query.role = role;
    if (search) query.$or = [
      { name: new RegExp(search, 'i') },
      { email: new RegExp(search, 'i') },
    ];

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await User.countDocuments(query);
    const users = await User.find(query).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit));

    res.json({ success: true, total, users: users.map(u => u.toPublicJSON()) });
  } catch (error) {
    next(error);
  }
};

// ══════════════════════════════════════════
// @route   GET /api/users/:id
// @access  Private/Admin
// ══════════════════════════════════════════
exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

    const solutions = await Solution.find({ author: user._id }).sort({ createdAt: -1 }).limit(10);

    res.json({ success: true, user: user.toPublicJSON(), recentSolutions: solutions });
  } catch (error) {
    next(error);
  }
};

// ══════════════════════════════════════════
// @route   PATCH /api/users/:id/role    (Admin)
// @access  Private/Admin
// ══════════════════════════════════════════
exports.updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!['seeker', 'contributor', 'admin'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role.' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role, avatar: role === 'contributor' ? '🌿' : role === 'admin' ? '🛡️' : '👤' },
      { new: true }
    );

    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    
    req.user.addActivity('admin_action', `Updated role for ${user.email} to ${role}`);
    await req.user.save();

    res.json({ success: true, message: `User role updated to ${role}.`, user: user.toPublicJSON() });
  } catch (error) {
    next(error);
  }
};

// ══════════════════════════════════════════
// @route   PATCH /api/users/:id/toggle-active   (Admin)
// @access  Private/Admin
// ══════════════════════════════════════════
exports.toggleUserActive = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

    user.isActive = !user.isActive;
    await user.save();

    req.user.addActivity('admin_action', `${user.isActive ? 'Activated' : 'Deactivated'} user: ${user.email}`);
    await req.user.save();

    res.json({ success: true, message: `User ${user.isActive ? 'activated' : 'deactivated'}.`, isActive: user.isActive });
  } catch (error) {
    next(error);
  }
};

// ══════════════════════════════════════════
// @route   GET /api/users/stats/overview   (Admin)
// @access  Private/Admin
// ══════════════════════════════════════════
exports.getUserStats = async (req, res, next) => {
  try {
    const [total, seekers, contributors, admins, activeToday] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'seeker' }),
      User.countDocuments({ role: 'contributor' }),
      User.countDocuments({ role: 'admin' }),
      User.countDocuments({ lastLogin: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } }),
    ]);

    res.json({ success: true, stats: { total, seekers, contributors, admins, activeToday } });
  } catch (error) {
    next(error);
  }
};

// ══════════════════════════════════════════
// @route   DELETE /api/users/:id    (Admin)
// @access  Private/Admin
// ══════════════════════════════════════════
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

    // Prevent deleting self
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'You cannot delete your own admin account.' });
    }

    // Optionally: delete all their solutions? 
    // For now, let's just delete the user. 
    // In a real app, you might want to reassign or delete solutions.
    await User.findByIdAndDelete(req.params.id);

    req.user.addActivity('admin_action', `Permanently deleted user: ${user.email}`);
    await req.user.save();

    res.json({ success: true, message: 'User permanently removed from database.' });
  } catch (error) {
    next(error);
  }
};
