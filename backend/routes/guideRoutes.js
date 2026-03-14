const express = require('express');
const router = express.Router();
const guideController = require('../controllers/guideController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

router.post('/create', authMiddleware, adminMiddleware, guideController.createGuide);
router.get('/', authMiddleware, adminMiddleware, guideController.getAllGuides);
router.get('/:id', authMiddleware, adminMiddleware, guideController.getGuideById);
router.put('/:id', authMiddleware, adminMiddleware, guideController.updateGuide);
router.delete('/:id', authMiddleware, adminMiddleware, guideController.deleteGuide);

module.exports = router;
