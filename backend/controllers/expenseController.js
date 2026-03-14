const Expense = require('../models/Expense');

const createExpense = async (req, res) => {
    try {
        const { category, amount, description, relatedBooking, expenseDate } = req.body;

        if (!amount) {
            return res.status(400).json({
                message: "Please provide the expense amount"
            });
        }

        const newExpense = await Expense.create({
            category,
            amount,
            description,
            relatedBooking,
            expenseDate,
            createdBy: req.user.id
        });

        return res.status(201).json({
            message: "Expense recorded successfully",
            data: newExpense
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error recording expense",
            error: error.message
        });
    }
};

const getAllExpenses = async (req, res) => {
    try {
        const allExpenses = await Expense.find()
            .populate('category', 'name')
            .populate('relatedBooking')
            .populate('createdBy', 'fullName')
            .sort({ createdAt: -1 });

        return res.status(200).json({
            message: "All expenses fetched successfully",
            data: allExpenses
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error fetching expenses",
            error: error.message
        });
    }
};

const getExpenseById = async (req, res) => {
    try {
        const expenseId = req.params.id;
        const foundExpense = await Expense.findById(expenseId)
            .populate('category', 'name')
            .populate('relatedBooking')
            .populate('createdBy', 'fullName');

        if (!foundExpense) {
            return res.status(404).json({
                message: "Expense not found"
            });
        }

        return res.status(200).json({
            message: "Expense fetched successfully",
            data: foundExpense
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error fetching expense",
            error: error.message
        });
    }
};

const updateExpense = async (req, res) => {
    try {
        const expenseId = req.params.id;
        const updatedExpense = await Expense.findByIdAndUpdate(expenseId, req.body, { new: true });

        if (!updatedExpense) {
            return res.status(404).json({
                message: "Expense not found"
            });
        }

        return res.status(200).json({
            message: "Expense updated successfully",
            data: updatedExpense
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error updating expense",
            error: error.message
        });
    }
};

const deleteExpense = async (req, res) => {
    try {
        const expenseId = req.params.id;
        const deletedExpense = await Expense.findByIdAndDelete(expenseId);

        if (!deletedExpense) {
            return res.status(404).json({
                message: "Expense not found"
            });
        }

        return res.status(200).json({
            message: "Expense deleted successfully",
            data: deletedExpense
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error deleting expense",
            error: error.message
        });
    }
};

module.exports = {
    createExpense,
    getAllExpenses,
    getExpenseById,
    updateExpense,
    deleteExpense
};
