const express = require('express');
const router = express.Router();
const customRequestController = require('../controllers/customRequestController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

router.post('/create', authMiddleware, customRequestController.createCustomRequest);
router.get('/my', authMiddleware, customRequestController.getMyCustomRequests);

router.get('/', authMiddleware, adminMiddleware, customRequestController.getAllCustomRequests);
router.put('/:id', authMiddleware, adminMiddleware, customRequestController.updateCustomRequestStatus);
router.delete('/:id', authMiddleware, adminMiddleware, customRequestController.deleteCustomRequest);

module.exports = router;
