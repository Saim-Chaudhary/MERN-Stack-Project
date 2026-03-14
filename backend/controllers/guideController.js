const Guide = require('../models/Guide');

const createGuide = async (req, res) => {
    try {
        const { fullName, phone, email, experienceYears, languages } = req.body;

        if (!fullName) {
            return res.status(400).json({
                message: "Please provide the guide's fullName"
            });
        }

        const newGuide = await Guide.create({
            fullName,
            phone,
            email,
            experienceYears,
            languages
        });

        return res.status(201).json({
            message: "Guide added successfully",
            data: newGuide
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error adding guide",
            error: error.message
        });
    }
};

const getAllGuides = async (req, res) => {
    try {
        const allGuides = await Guide.find();

        return res.status(200).json({
            message: "All guides fetched successfully",
            data: allGuides
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error fetching guides",
            error: error.message
        });
    }
};

const getGuideById = async (req, res) => {
    try {
        const guideId = req.params.id;
        const foundGuide = await Guide.findById(guideId);

        if (!foundGuide) {
            return res.status(404).json({
                message: "Guide not found"
            });
        }

        return res.status(200).json({
            message: "Guide fetched successfully",
            data: foundGuide
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error fetching guide",
            error: error.message
        });
    }
};

const updateGuide = async (req, res) => {
    try {
        const guideId = req.params.id;
        const updatedGuide = await Guide.findByIdAndUpdate(guideId, req.body, { new: true });

        if (!updatedGuide) {
            return res.status(404).json({
                message: "Guide not found"
            });
        }

        return res.status(200).json({
            message: "Guide updated successfully",
            data: updatedGuide
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error updating guide",
            error: error.message
        });
    }
};

const deleteGuide = async (req, res) => {
    try {
        const guideId = req.params.id;
        const deletedGuide = await Guide.findByIdAndDelete(guideId);

        if (!deletedGuide) {
            return res.status(404).json({
                message: "Guide not found"
            });
        }

        return res.status(200).json({
            message: "Guide deleted successfully",
            data: deletedGuide
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error deleting guide",
            error: error.message
        });
    }
};

module.exports = {
    createGuide,
    getAllGuides,
    getGuideById,
    updateGuide,
    deleteGuide
};
