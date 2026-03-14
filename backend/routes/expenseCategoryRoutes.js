const express = require('express');
const router = express.Router();
const expenseCategoryController = require('../controllers/expenseCategoryController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

router.post('/create', authMiddleware, adminMiddleware, expenseCategoryController.createExpenseCategory);
router.get('/', authMiddleware, adminMiddleware, expenseCategoryController.getAllExpenseCategories);
router.put('/:id', authMiddleware, adminMiddleware, expenseCategoryController.updateExpenseCategory);
router.delete('/:id', authMiddleware, adminMiddleware, expenseCategoryController.deleteExpenseCategory);

module.exports = router;
