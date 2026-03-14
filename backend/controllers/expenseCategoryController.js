const ExpenseCategory = require('../models/ExpenseCategory');

const createExpenseCategory = async (req, res) => {
    try {
        const { name, description } = req.body;

        if (!name) {
            return res.status(400).json({
                message: "Please provide the category name"
            });
        }

        const newCategory = await ExpenseCategory.create({
            name,
            description
        });

        return res.status(201).json({
            message: "Expense category created successfully",
            data: newCategory
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error creating expense category",
            error: error.message
        });
    }
};

const getAllExpenseCategories = async (req, res) => {
    try {
        const allCategories = await ExpenseCategory.find();

        return res.status(200).json({
            message: "All expense categories fetched successfully",
            data: allCategories
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error fetching expense categories",
            error: error.message
        });
    }
};

const updateExpenseCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const updatedCategory = await ExpenseCategory.findByIdAndUpdate(categoryId, req.body, { new: true });

        if (!updatedCategory) {
            return res.status(404).json({
                message: "Expense category not found"
            });
        }

        return res.status(200).json({
            message: "Expense category updated successfully",
            data: updatedCategory
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error updating expense category",
            error: error.message
        });
    }
};

const deleteExpenseCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const deletedCategory = await ExpenseCategory.findByIdAndDelete(categoryId);

        if (!deletedCategory) {
            return res.status(404).json({
                message: "Expense category not found"
            });
        }

        return res.status(200).json({
            message: "Expense category deleted successfully",
            data: deletedCategory
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error deleting expense category",
            error: error.message
        });
    }
};

module.exports = {
    createExpenseCategory,
    getAllExpenseCategories,
    updateExpenseCategory,
    deleteExpenseCategory
};
