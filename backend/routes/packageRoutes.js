const express = require('express');
const router = express.Router();
const { createPackage, getAllPackages, getAllPackagesAdmin, getPackageById, updatePackage, deletePackage } = require('../controllers/packageController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const upload = require('../config/multer');

router.get('/all', getAllPackages);
router.get('/admin/all', authMiddleware, adminMiddleware, getAllPackagesAdmin);
router.get('/:id', getPackageById);

router.post('/create', authMiddleware, adminMiddleware, upload.single('image'), createPackage);
router.put('/:id', authMiddleware, adminMiddleware, upload.single('image'), updatePackage);
router.delete('/:id', authMiddleware, adminMiddleware, deletePackage);

module.exports = router;