const express = require('express');
const router = express.Router();
const testimonialController = require('../controllers/testimonialController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

router.get('/approved', testimonialController.getApprovedTestimonials);

router.post('/create', authMiddleware, testimonialController.createTestimonial);

router.get('/', authMiddleware, adminMiddleware, testimonialController.getAllTestimonialsAdmin);
router.put('/:id', authMiddleware, adminMiddleware, testimonialController.updateTestimonial);
router.delete('/:id', authMiddleware, adminMiddleware, testimonialController.deleteTestimonial);

module.exports = router;
