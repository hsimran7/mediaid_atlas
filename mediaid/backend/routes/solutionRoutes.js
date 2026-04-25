const express = require('express');
const router = express.Router();
const {
  createSolution, getSolutions, getSolution, getSolutionsByCondition,
  updateSolution, deleteSolution, toggleLike, toggleSave,
  addComment, reviewSolution, getPendingSolutions, getStats,
} = require('../controllers/solutionsController');
const { protect, restrictTo, optionalAuth } = require('../middleware/auth');
const upload = require('../middleware/upload');

// ── Public / optional auth
router.get('/stats/overview', getStats);
router.get('/by-condition/:key', optionalAuth, getSolutionsByCondition);
router.get('/', optionalAuth, getSolutions);
router.get('/:id', optionalAuth, getSolution);

// ── Admin only
router.get('/admin/pending', protect, restrictTo('admin'), getPendingSolutions);
router.patch('/:id/review', protect, restrictTo('admin'), reviewSolution);

// ── Authenticated
router.post('/', protect, restrictTo('contributor', 'admin'), upload.array('files', 10), createSolution);
router.put('/:id', protect, updateSolution);
router.delete('/:id', protect, deleteSolution);
router.post('/:id/like', protect, toggleLike);
router.post('/:id/save', protect, toggleSave);
router.post('/:id/comment', protect, addComment);

module.exports = router;
