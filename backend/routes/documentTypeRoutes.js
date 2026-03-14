const express = require('express');
const router = express.Router();
const documentTypeController = require('../controllers/documentTypeController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

router.get('/', documentTypeController.getAllDocumentTypes);

router.post('/create', authMiddleware, adminMiddleware, documentTypeController.createDocumentType);
router.put('/:id', authMiddleware, adminMiddleware, documentTypeController.updateDocumentType);
router.delete('/:id', authMiddleware, adminMiddleware, documentTypeController.deleteDocumentType);

module.exports = router;
