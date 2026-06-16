const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');


router.post('/checkout-session', authMiddleware, paymentController.createCheckoutSession);

router.get('/verify/:sessionId', authMiddleware, paymentController.verifyPayment);
router.post('/create', authMiddleware, paymentController.createPayment);

router.get('/booking/:bookingId', authMiddleware, paymentController.getPaymentsByBooking);
router.get('/', authMiddleware, adminMiddleware, paymentController.getAllPayments);

router.put('/:id', authMiddleware, adminMiddleware, paymentController.updatePaymentStatus);


module.exports = router;