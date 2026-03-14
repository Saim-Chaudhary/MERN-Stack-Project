const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

router.post('/create', authMiddleware, adminMiddleware, expenseController.createExpense);
router.get('/', authMiddleware, adminMiddleware, expenseController.getAllExpenses);
router.get('/:id', authMiddleware, adminMiddleware, expenseController.getExpenseById);
router.put('/:id', authMiddleware, adminMiddleware, expenseController.updateExpense);
router.delete('/:id', authMiddleware, adminMiddleware, expenseController.deleteExpense);

module.exports = router;
