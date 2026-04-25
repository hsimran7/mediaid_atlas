const mongoose = require('mongoose');

const solutionSchema = new mongoose.Schema({
  // ── Core Info
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [120, 'Title cannot exceed 120 characters'],
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters'],
  },
  condition: {
    type: String,
    required: [true, 'Condition/emergency type is required'],
    trim: true,
  },
  conditionKey: {
    // maps to situationsDB key e.g. 'burn', 'cpr', 'seizure'
    type: String,
    default: '',
  },

  // ── Media
  mediaType: {
    type: String,
    enum: ['video', 'pdf', 'guide', 'image', 'link'],
    required: true,
  },
  fileUrl: {
    type: String,   // local path or external URL
    default: '',
  },
  fileName: {
    type: String,
    default: '',
  },
  fileSize: {
    type: Number,   // bytes
    default: 0,
  },
  fileMimeType: {
    type: String,
    default: '',
  },
  thumbnailUrl: {
    type: String,
    default: '',
  },
  externalUrl: {
    type: String,   // YouTube, external link etc
    default: '',
  },
  duration: {
    type: String,   // e.g. "5:32" for video
    default: '',
  },
  files: [{
    fileUrl: String,
    fileName: String,
    fileSize: Number,
    fileMimeType: String,
    thumbnailUrl: String,
  }],

  // ── Classification
  severity: {
    type: String,
    enum: ['critical', 'moderate', 'mild', 'general'],
    default: 'general',
  },
  tags: [{ type: String, lowercase: true, trim: true }],
  language: {
    type: String,
    default: 'en',
  },
  region: {
    type: String,
    default: '',
  },

  // ── Source & Attribution
  source: {
    type: String,   // e.g. 'WHO', 'Red Cross', 'Community'
    default: 'Community',
  },
  evidence: {
    type: String,   // link or description of evidence
    default: '',
  },

  // ── Author (contributor)
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  authorName: {
    type: String,
    default: '',
  },

  // ── Moderation
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'flagged'],
    default: 'pending',
  },
  reviewNote: {
    type: String,
    default: '',
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  reviewedAt: Date,

  // ── Engagement
  views: { type: Number, default: 0 },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  likesCount: { type: Number, default: 0 },
  saves: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  savesCount: { type: Number, default: 0 },

  // ── Comments
  comments: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    userName: String,
    text: String,
    createdAt: { type: Date, default: Date.now },
  }],

  // ── Steps (optional structured content)
  steps: [{ type: String }],
  ingredients: [{ type: String }],

  isFeatured: { type: Boolean, default: false },

}, { timestamps: true });

// ── Text search index
solutionSchema.index({ title: 'text', description: 'text', condition: 'text', tags: 'text' });
solutionSchema.index({ conditionKey: 1, status: 1 });
solutionSchema.index({ author: 1, status: 1 });
solutionSchema.index({ status: 1, createdAt: -1 });
solutionSchema.index({ mediaType: 1, status: 1 });

module.exports = mongoose.model('Solution', solutionSchema);
