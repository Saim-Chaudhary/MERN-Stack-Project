const express = require('express');
const router = express.Router();
const passengerController = require('../controllers/passengerController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

router.post('/add', authMiddleware, passengerController.addPassenger);
router.get('/booking/:bookingId', authMiddleware, passengerController.getPassengersByBooking);
router.put('/:id', authMiddleware, passengerController.updatePassenger);

router.delete('/:id', authMiddleware, adminMiddleware, passengerController.deletePassenger);

module.exports = router;
