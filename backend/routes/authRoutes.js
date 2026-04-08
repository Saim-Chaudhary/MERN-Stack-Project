const express = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const router = express.Router();

router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);

router.get('/profile', authMiddleware, authController.getProfile);
router.put('/profile', authMiddleware, authController.updateMyProfile);

router.get('/users', authMiddleware, adminMiddleware, authController.getAllUsersAdmin);
router.put('/users/:id', authMiddleware, adminMiddleware, authController.updateUserAdmin);
router.put('/users/:id/role', authMiddleware, adminMiddleware, authController.updateUserRoleAdmin);
router.delete('/users/:id', authMiddleware, adminMiddleware, authController.deleteUserAdmin);

module.exports = router;