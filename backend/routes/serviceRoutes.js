const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

router.get('/', serviceController.getAllServices);
router.get('/:id', serviceController.getServiceById);

router.post('/create', authMiddleware, adminMiddleware, serviceController.createService);
router.put('/:id', authMiddleware, adminMiddleware, serviceController.updateService);
router.delete('/:id', authMiddleware, adminMiddleware, serviceController.deleteService);

module.exports = router;
