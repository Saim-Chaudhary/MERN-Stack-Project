const express = require('express');
const router = express.Router();
const hotelController = require('../controllers/hotelController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

router.get('/', hotelController.getAllHotels);
router.get('/:id', hotelController.getHotelById);

router.post('/create', authMiddleware, adminMiddleware, hotelController.createHotel);
router.put('/:id', authMiddleware, adminMiddleware, hotelController.updateHotel);
router.delete('/:id', authMiddleware, adminMiddleware, hotelController.deleteHotel);

module.exports = router;
