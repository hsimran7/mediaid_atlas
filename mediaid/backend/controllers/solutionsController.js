const { cloudinary, isCloudinaryConfigured, uploadToCloudinary, UPLOAD_BASE } = require("../config/cloudinary");
const Solution = require('../models/Solution');
const User = require('../models/User');
const path = require('path');
const fs = require('fs');

// ══════════════════════════════════════════
// @route   POST /api/solutions
// @access  Private (contributor / admin)
// ══════════════════════════════════════════
exports.createSolution = async (req, res, next) => {
  try {
    const {
      title, description, condition, conditionKey, mediaType,
      externalUrl, duration, severity, tags, language,
      region, source, evidence, steps, ingredients,
    } = req.body;

    if (!title || !description || !condition || !mediaType) {
      return res.status(400).json({ success: false, message: 'title, description, condition, and mediaType are required.' });
    }

    // Handle uploaded files
    const files = [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        let fileUrl = '';
        let thumbnailUrl = '';
        
        if (isCloudinaryConfigured()) {
          try {
            const result = await uploadToCloudinary(file.buffer, file.mimetype, file.originalname);
            fileUrl = result.secure_url;
            thumbnailUrl = result.eager?.[0]?.secure_url || '';
          } catch (uploadErr) {
            console.error('Cloudinary upload error:', uploadErr);
            // Continue with other files or fail? For now, we fail if any upload fails to ensure data integrity
            return res.status(500).json({ success: false, message: 'File upload failed: ' + uploadErr.message });
          }
        } else {
          // Fallback: save buffer to disk
          const mime = file.mimetype;
          let folder = 'guides';
          if (mime.startsWith('video/')) folder = 'videos';
          else if (mime === 'application/pdf') folder = 'pdfs';
          else if (mime.startsWith('image/')) folder = 'images';
          
          const ext = require('path').extname(file.originalname);
          const diskFileName = `mediaid-${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`;
          const diskPath = `${UPLOAD_BASE}/${folder}/${diskFileName}`;
          fs.writeFileSync(diskPath, file.buffer);
          fileUrl = `/uploads/${folder}/${diskFileName}`;
        }

        files.push({
          fileUrl,
          fileName: file.originalname,
          fileSize: file.size || 0,
          fileMimeType: file.mimetype,
          thumbnailUrl
        });
      }
    }

    const parsedTags = typeof tags === 'string'
      ? tags.split(',').map(t => t.trim().toLowerCase()).filter(Boolean)
      : (Array.isArray(tags) ? tags : []);

    const parsedSteps = typeof steps === 'string'
      ? JSON.parse(steps || '[]')
      : (Array.isArray(steps) ? steps : []);

    const parsedIngredients = typeof ingredients === 'string'
      ? JSON.parse(ingredients || '[]')
      : (Array.isArray(ingredients) ? ingredients : []);

    // Create solution with files array
    const solution = await Solution.create({
      title,
      description,
      condition,
      conditionKey: conditionKey || '',
      mediaType,
      files, // Store all uploaded files
      // Backward compatibility for single-file fields
      fileUrl: files.length > 0 ? files[0].fileUrl : '',
      fileName: files.length > 0 ? files[0].fileName : '',
      fileSize: files.length > 0 ? files[0].fileSize : 0,
      fileMimeType: files.length > 0 ? files[0].fileMimeType : '',
      thumbnailUrl: files.length > 0 ? files[0].thumbnailUrl : '',
      externalUrl: externalUrl || '',
      duration: duration || '',
      severity: severity || 'general',
      tags: parsedTags,
      language: language || 'en',
      region: region || '',
      source: source || 'Community',
      evidence: evidence || '',
      steps: parsedSteps,
      ingredients: parsedIngredients,
      author: req.user._id,
      authorName: req.user.name,
      status: req.user.role === 'admin' ? 'approved' : 'pending',
    });

    // Update contributor stats
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { solutionsCount: 1 },
    });

    // Log activity
    const user = await User.findById(req.user._id);
    user.addActivity('submitted_solution', `Submitted: "${title}"`);
    await user.save();

    res.status(201).json({
      success: true,
      message: req.user.role === 'admin'
        ? 'Solution published immediately.'
        : 'Solution submitted for review. It will appear after approval.',
      solution,
    });
  } catch (error) {
    next(error);
  }
};

// ══════════════════════════════════════════
// @route   GET /api/solutions
// @access  Public — approved solutions only (unless admin)
// ══════════════════════════════════════════
exports.getSolutions = async (req, res, next) => {
  try {
    const {
      page = 1, limit = 12, status, mediaType,
      condition, conditionKey, severity, language,
      search, sort = '-createdAt', featured,
    } = req.query;

    const query = {};

    // ── STRICT VISIBILITY RULES ──
    if (!req.user || req.user.role === 'seeker') {
      // Seekers and Public only see approved
      query.status = 'approved';
    } else if (req.user.role === 'contributor') {
      // Contributors see approved, OR their own pending/rejected
      query.$or = [
        { status: 'approved' },
        { author: req.user._id }
      ];
    } else if (req.user.role === 'admin') {
      // Admins see everything, but can filter by status if provided
      if (status) query.status = status;
    }

    if (mediaType) query.mediaType = mediaType;
    if (condition) query.condition = new RegExp(condition, 'i');
    if (conditionKey) query.conditionKey = conditionKey;
    if (severity) query.severity = severity;
    if (language) query.language = language;
    if (featured === 'true') query.isFeatured = true;

    if (search) {
      // Use text index if available, but fallback to regex for partial/case-insensitive title/condition matches
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { condition: { $regex: search, $options: 'i' } },
        { tags: { $in: [search.toLowerCase()] } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Solution.countDocuments(query);

    const solutions = await Solution.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('author', 'name avatar role country specialization');

    res.json({
      success: true,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      solutions,
    });
  } catch (error) {
    next(error);
  }
};

// ══════════════════════════════════════════
// @route   GET /api/solutions/:id
// @access  Public
// ══════════════════════════════════════════
exports.getSolution = async (req, res, next) => {
  try {
    const solution = await Solution.findById(req.params.id)
      .populate('author', 'name avatar role country specialization bio')
      .populate('comments.user', 'name avatar');

    if (!solution) {
      return res.status(404).json({ success: false, message: 'Solution not found.' });
    }

    if (solution.status !== 'approved' && (!req.user || (req.user.role !== 'admin' && solution.author._id.toString() !== req.user._id.toString()))) {
      return res.status(403).json({ success: false, message: 'Solution not available.' });
    }

    // Increment views
    solution.views += 1;
    await solution.save();

    // Log to user's viewed list
    if (req.user) {
      await User.findByIdAndUpdate(req.user._id, {
        $addToSet: { viewedSolutions: solution._id },
      });
      const user = await User.findById(req.user._id);
      user.addActivity('viewed_solution', `Viewed: "${solution.title}"`);
      await user.save();
    }

    // Update author total views
    await User.findByIdAndUpdate(solution.author._id, {
      $inc: { totalViews: 1 },
    });

    res.json({ success: true, solution });
  } catch (error) {
    next(error);
  }
};

// ══════════════════════════════════════════
// @route   GET /api/solutions/by-condition/:key
// @access  Public — get solutions for a specific condition key
// ══════════════════════════════════════════
exports.getSolutionsByCondition = async (req, res, next) => {
  try {
    const { key } = req.params;
    const { mediaType, limit = 10 } = req.query;

    const query = { conditionKey: key };

    // ── STRICT VISIBILITY RULES ──
    if (!req.user || req.user.role === 'seeker') {
      query.status = 'approved';
    } else if (req.user.role === 'contributor') {
      query.$or = [
        { status: 'approved' },
        { author: req.user._id }
      ];
    }
    // Admin sees all for the condition

    if (mediaType) query.mediaType = mediaType;

    const solutions = await Solution.find(query)
      .sort({ isFeatured: -1, likes: -1, createdAt: -1 })
      .limit(parseInt(limit))
      .populate('author', 'name avatar country specialization');

    res.json({ success: true, solutions });
  } catch (error) {
    next(error);
  }
};

// ══════════════════════════════════════════
// @route   PUT /api/solutions/:id
// @access  Private (owner or admin)
// ══════════════════════════════════════════
exports.updateSolution = async (req, res, next) => {
  try {
    let solution = await Solution.findById(req.params.id);
    if (!solution) return res.status(404).json({ success: false, message: 'Solution not found.' });

    const isOwner = solution.author.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Not authorized.' });
    }

    const allowed = ['title', 'description', 'condition', 'conditionKey', 'externalUrl',
      'duration', 'severity', 'tags', 'language', 'region', 'source', 'evidence', 'steps', 'ingredients'];

    allowed.forEach(field => {
      if (req.body[field] !== undefined) solution[field] = req.body[field];
    });

    // Owners re-submit for review on edit
    if (isOwner && !isAdmin) solution.status = 'pending';

    await solution.save();
    res.json({ success: true, message: 'Solution updated.', solution });
  } catch (error) {
    next(error);
  }
};

// ══════════════════════════════════════════
// @route   DELETE /api/solutions/:id
// @access  Private (owner or admin)
// ══════════════════════════════════════════
exports.deleteSolution = async (req, res, next) => {
  try {
    const solution = await Solution.findById(req.params.id);
    if (!solution) return res.status(404).json({ success: false, message: 'Solution not found.' });

    const isOwner = solution.author.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized.' });
    }

    // Delete all files — Cloudinary or local disk
    const allFiles = solution.files && solution.files.length > 0 ? solution.files : (solution.fileUrl ? [{ fileUrl: solution.fileUrl, mediaType: solution.mediaType }] : []);

    for (const file of allFiles) {
      if (file.fileUrl) {
        if (file.fileUrl.startsWith('http') && isCloudinaryConfigured()) {
          // Extract public_id from Cloudinary URL
          const urlParts = file.fileUrl.split('/');
          const publicIdWithExt = urlParts.slice(-2).join('/');
          const publicId = publicIdWithExt.replace(/\.[^.]+$/, '');
          const resourceType = file.fileMimeType?.startsWith('video/') ? 'video' : file.fileMimeType === 'application/pdf' ? 'raw' : 'image';
          try {
            await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
          } catch (e) { console.warn('Cloudinary delete warning:', e.message); }
        } else if (file.fileUrl.startsWith('/uploads')) {
          const filePath = path.join(__dirname, '..', file.fileUrl);
          if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        }
      }
    }

    await solution.deleteOne();
    await User.findByIdAndUpdate(solution.author, { $inc: { solutionsCount: -1 } });

    if (req.user.role === 'admin') {
      req.user.addActivity('admin_action', `Deleted remedy: "${solution.title}"`);
      await req.user.save();
    }

    res.json({ success: true, message: 'Solution deleted.' });
  } catch (error) {
    next(error);
  }
};

// ══════════════════════════════════════════
// @route   POST /api/solutions/:id/like
// @access  Private
// ══════════════════════════════════════════
exports.toggleLike = async (req, res, next) => {
  try {
    const solution = await Solution.findById(req.params.id);
    if (!solution) return res.status(404).json({ success: false, message: 'Solution not found.' });

    const userId = req.user._id;
    const alreadyLiked = solution.likes.some(id => id.toString() === userId.toString());

    if (alreadyLiked) {
      solution.likes = solution.likes.filter(id => id.toString() !== userId.toString());
      solution.likesCount = Math.max(0, solution.likesCount - 1);
      await User.findByIdAndUpdate(solution.author, { $inc: { totalLikes: -1 } });
    } else {
      solution.likes.push(userId);
      solution.likesCount += 1;
      await User.findByIdAndUpdate(solution.author, { $inc: { totalLikes: 1 } });
    }

    await solution.save();
    res.json({ success: true, liked: !alreadyLiked, likesCount: solution.likesCount });
  } catch (error) {
    next(error);
  }
};

// ══════════════════════════════════════════
// @route   POST /api/solutions/:id/save
// @access  Private
// ══════════════════════════════════════════
exports.toggleSave = async (req, res, next) => {
  try {
    const solution = await Solution.findById(req.params.id);
    if (!solution) return res.status(404).json({ success: false, message: 'Solution not found.' });

    const userId = req.user._id;
    const user = await User.findById(userId);
    const alreadySaved = user.savedSolutions.some(id => id.toString() === solution._id.toString());

    if (alreadySaved) {
      await User.findByIdAndUpdate(userId, { $pull: { savedSolutions: solution._id } });
      solution.saves = solution.saves.filter(id => id.toString() !== userId.toString());
      solution.savesCount = Math.max(0, solution.savesCount - 1);
    } else {
      await User.findByIdAndUpdate(userId, { $addToSet: { savedSolutions: solution._id } });
      solution.saves.push(userId);
      solution.savesCount += 1;
    }

    await solution.save();
    res.json({ success: true, saved: !alreadySaved, savesCount: solution.savesCount });
  } catch (error) {
    next(error);
  }
};

// ══════════════════════════════════════════
// @route   POST /api/solutions/:id/comment
// @access  Private
// ══════════════════════════════════════════
exports.addComment = async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!text || text.trim().length < 2) {
      return res.status(400).json({ success: false, message: 'Comment text is required.' });
    }

    const solution = await Solution.findById(req.params.id);
    if (!solution) return res.status(404).json({ success: false, message: 'Solution not found.' });

    solution.comments.push({
      user: req.user._id,
      userName: req.user.name,
      text: text.trim(),
    });

    await solution.save();
    res.json({ success: true, message: 'Comment added.', comments: solution.comments });
  } catch (error) {
    next(error);
  }
};

// ══════════════════════════════════════════
// @route   PATCH /api/solutions/:id/review   (Admin only)
// @access  Private/Admin
// ══════════════════════════════════════════
exports.reviewSolution = async (req, res, next) => {
  try {
    const { status, reviewNote } = req.body;
    if (!['approved', 'rejected', 'flagged'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status.' });
    }

    const solution = await Solution.findById(req.params.id);
    if (!solution) return res.status(404).json({ success: false, message: 'Solution not found.' });

    solution.status = status;
    solution.reviewNote = reviewNote || '';
    solution.reviewedBy = req.user._id;
    solution.reviewedAt = new Date();
    await solution.save();

    // Update contributor stats and log admin activity
    if (status === 'approved') {
      await User.findByIdAndUpdate(solution.author, { $inc: { verifiedCount: 1 } });
      req.user.addActivity('admin_action', `Approved remedy: "${solution.title}"`);
    } else if (status === 'rejected') {
      await User.findByIdAndUpdate(solution.author, { $inc: { rejectedCount: 1 } });
      req.user.addActivity('admin_action', `Rejected remedy: "${solution.title}"`);
    }
    await req.user.save();

    res.json({ success: true, message: `Solution ${status}.`, solution });
  } catch (error) {
    next(error);
  }
};

// ══════════════════════════════════════════
// @route   GET /api/solutions/admin/pending
// @access  Private/Admin
// ══════════════════════════════════════════
exports.getPendingSolutions = async (req, res, next) => {
  try {
    const solutions = await Solution.find({ status: 'pending' })
      .sort({ createdAt: -1 })
      .populate('author', 'name email avatar country');

    res.json({ success: true, count: solutions.length, solutions });
  } catch (error) {
    next(error);
  }
};

// ══════════════════════════════════════════
// @route   GET /api/solutions/stats/overview
// @access  Public
// ══════════════════════════════════════════
exports.getStats = async (req, res, next) => {
  try {
    const [total, approved, pending, videoCount, pdfCount, guideCount] = await Promise.all([
      Solution.countDocuments(),
      Solution.countDocuments({ status: 'approved' }),
      Solution.countDocuments({ status: 'pending' }),
      Solution.countDocuments({ mediaType: 'video', status: 'approved' }),
      Solution.countDocuments({ mediaType: 'pdf', status: 'approved' }),
      Solution.countDocuments({ mediaType: 'guide', status: 'approved' }),
    ]);

    const topSolutions = await Solution.find({ status: 'approved' })
      .sort({ views: -1 })
      .limit(5)
      .select('title condition mediaType views likesCount')
      .populate('author', 'name');

    res.json({
      success: true,
      stats: {
        total, approved, pending,
        byType: { video: videoCount, pdf: pdfCount, guide: guideCount },
        topSolutions,
      },
    });
  } catch (error) {
    next(error);
  }
};
