const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const streamifier = require('streamifier');
const path = require('path');
const fs = require('fs');

// ── Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const isCloudinaryConfigured = () =>
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_CLOUD_NAME !== 'your_cloud_name' &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET;

// ══════════════════════════════════════════
// UPLOAD TO CLOUDINARY via buffer stream
// (works with Cloudinary v2 — no extra lib needed)
// ══════════════════════════════════════════
const uploadToCloudinary = (fileBuffer, mimetype, originalname) => {
  return new Promise((resolve, reject) => {
    let folder = 'mediaid/guides';
    let resource_type = 'auto';

    if (mimetype.startsWith('video/')) {
      folder = 'mediaid/videos';
      resource_type = 'video';
    } else if (mimetype === 'application/pdf') {
      folder = 'mediaid/pdfs';
      resource_type = 'raw';
    } else if (mimetype.startsWith('image/')) {
      folder = 'mediaid/images';
      resource_type = 'image';
    }

    const public_id = `mediaid-${Date.now()}-${Math.round(Math.random() * 1e6)}`;

    const uploadOptions = {
      folder,
      resource_type,
      public_id,
      // Auto-generate thumbnail for videos
      ...(mimetype.startsWith('video/') && {
        eager: [{ width: 400, height: 300, crop: 'fill', format: 'jpg' }],
        eager_async: true,
      }),
    };

    const uploadStream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
};

// ══════════════════════════════════════════
// LOCAL DISK STORAGE (fallback)
// ══════════════════════════════════════════
const ensureDir = (dir) => { if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true }); };
const UPLOAD_BASE = process.env.UPLOAD_PATH || './uploads';
ensureDir(`${UPLOAD_BASE}/videos`);
ensureDir(`${UPLOAD_BASE}/pdfs`);
ensureDir(`${UPLOAD_BASE}/images`);
ensureDir(`${UPLOAD_BASE}/guides`);

const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const mime = file.mimetype;
    let folder = 'guides';
    if (mime.startsWith('video/')) folder = 'videos';
    else if (mime === 'application/pdf') folder = 'pdfs';
    else if (mime.startsWith('image/')) folder = 'images';
    cb(null, `${UPLOAD_BASE}/${folder}`);
  },
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `mediaid-${unique}${ext}`);
  },
});

// ── File filter
const fileFilter = (req, file, cb) => {
  const allowedMimes = [
    'video/mp4', 'video/webm', 'video/ogg', 'video/quicktime', 'video/avi',
    'application/pdf',
    'image/jpeg', 'image/png', 'image/gif', 'image/webp',
    'text/plain',
  ];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`File type "${file.mimetype}" not allowed.`), false);
  }
};

const maxSizeMB = parseInt(process.env.MAX_FILE_SIZE_MB || '100');

// ── Always use memory storage — we handle upload manually
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: { fileSize: maxSizeMB * 1024 * 1024 },
});

module.exports = upload;
module.exports.cloudinary = cloudinary;
module.exports.isCloudinaryConfigured = isCloudinaryConfigured;
module.exports.uploadToCloudinary = uploadToCloudinary;
module.exports.UPLOAD_BASE = UPLOAD_BASE;
