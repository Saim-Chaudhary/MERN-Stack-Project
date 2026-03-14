const express = require('express');
const router = express.Router();
const airlineController = require('../controllers/airlineController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

router.get('/', airlineController.getAllAirlines);
router.get('/:id', airlineController.getAirlineById);

router.post('/create', authMiddleware, adminMiddleware, airlineController.createAirline);
router.put('/:id', authMiddleware, adminMiddleware, airlineController.updateAirline);
router.delete('/:id', authMiddleware, adminMiddleware, airlineController.deleteAirline);

module.exports = router;
