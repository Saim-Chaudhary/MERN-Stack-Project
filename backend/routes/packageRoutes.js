const express = require('express');
const router = express.Router();
const { createPackage, getAllPackages, getPackageById, updatePackage, deletePackage } = require('../controllers/packageController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

router.get('/all', getAllPackages);
router.get('/:id', getPackageById);

router.post('/create', authMiddleware, adminMiddleware, createPackage);
router.put('/:id', authMiddleware, adminMiddleware, updatePackage);
router.delete('/:id', authMiddleware, adminMiddleware, deletePackage);

module.exports = router;