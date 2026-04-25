// Re-export from cloudinary config
// This middleware now auto-selects Cloudinary (if configured) or local disk
const upload = require('../config/cloudinary');
module.exports = upload;
