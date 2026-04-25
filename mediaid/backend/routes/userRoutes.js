const express = require('express');
const router = express.Router();
const {
  getAllUsers, getUserById, updateUserRole, toggleUserActive, getUserStats, deleteUser
} = require('../controllers/usersController');
const { protect, restrictTo } = require('../middleware/auth');

router.use(protect, restrictTo('admin'));

router.get('/', getAllUsers);
router.get('/stats/overview', getUserStats);
router.get('/:id', getUserById);
router.patch('/:id/role', updateUserRole);
router.patch('/:id/toggle-active', toggleUserActive);
router.delete('/:id', deleteUser);

module.exports = router;
