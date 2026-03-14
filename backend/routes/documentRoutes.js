const express = require('express');
const router = express.Router();
const documentController = require('../controllers/documentController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

router.post('/upload', authMiddleware, documentController.uploadDocument);
router.get('/my', authMiddleware, documentController.getMyDocuments);

router.get('/', authMiddleware, adminMiddleware, documentController.getAllDocuments);
router.put('/:id', authMiddleware, adminMiddleware, documentController.updateDocumentStatus);
router.delete('/:id', authMiddleware, adminMiddleware, documentController.deleteDocument);

module.exports = router;
