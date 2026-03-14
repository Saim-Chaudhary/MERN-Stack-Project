const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

router.post('/create', authMiddleware, bookingController.createBooking);
router.get('/my', authMiddleware, bookingController.getMyBookings);
router.get('/:id', authMiddleware, bookingController.getBookingById);

router.get('/', authMiddleware, adminMiddleware, bookingController.getAllBookings);
router.put('/:id', authMiddleware, adminMiddleware, bookingController.updateBookingStatus);
router.delete('/:id', authMiddleware, adminMiddleware, bookingController.deleteBooking);

module.exports = router;
