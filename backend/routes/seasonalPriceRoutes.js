const express = require('express');
const router = express.Router();
const seasonalPriceController = require('../controllers/seasonalPriceController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

router.get('/', seasonalPriceController.getAllSeasonalPrices);
router.get('/package/:packageId', seasonalPriceController.getSeasonalPricesByPackage);

router.post('/create', authMiddleware, adminMiddleware, seasonalPriceController.createSeasonalPrice);
router.put('/:id', authMiddleware, adminMiddleware, seasonalPriceController.updateSeasonalPrice);
router.delete('/:id', authMiddleware, adminMiddleware, seasonalPriceController.deleteSeasonalPrice);

module.exports = router;
