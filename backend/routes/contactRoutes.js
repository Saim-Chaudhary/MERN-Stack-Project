const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

router.post('/submit', contactController.submitContact);

router.get('/', authMiddleware, adminMiddleware, contactController.getAllContacts);
router.put('/:id', authMiddleware, adminMiddleware, contactController.updateContactStatus);
router.delete('/:id', authMiddleware, adminMiddleware, contactController.deleteContact);

module.exports = router;
