const SeasonalPrice = require('../models/SeasonalPrice');

const createSeasonalPrice = async (req, res) => {
    try {
        const { package: packageId, seasonName, price, startDate, endDate } = req.body;

        if (!packageId || !price) {
            return res.status(400).json({
                message: "Please provide package and price"
            });
        }

        const newSeasonalPrice = await SeasonalPrice.create({
            package: packageId,
            seasonName,
            price,
            startDate,
            endDate
        });

        return res.status(201).json({
            message: "Seasonal price created successfully",
            data: newSeasonalPrice
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error creating seasonal price",
            error: error.message
        });
    }
};

const getAllSeasonalPrices = async (req, res) => {
    try {
        const allPrices = await SeasonalPrice.find()
            .populate('package', 'title');

        return res.status(200).json({
            message: "All seasonal prices fetched successfully",
            data: allPrices
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error fetching seasonal prices",
            error: error.message
        });
    }
};

const getSeasonalPricesByPackage = async (req, res) => {
    try {
        const packageId = req.params.packageId;
        const prices = await SeasonalPrice.find({ package: packageId });

        return res.status(200).json({
            message: "Seasonal prices fetched successfully",
            data: prices
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error fetching seasonal prices for this package",
            error: error.message
        });
    }
};

const updateSeasonalPrice = async (req, res) => {
    try {
        const priceId = req.params.id;
        const updatedPrice = await SeasonalPrice.findByIdAndUpdate(priceId, req.body, { new: true });

        if (!updatedPrice) {
            return res.status(404).json({
                message: "Seasonal price not found"
            });
        }

        return res.status(200).json({
            message: "Seasonal price updated successfully",
            data: updatedPrice
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error updating seasonal price",
            error: error.message
        });
    }
};

const deleteSeasonalPrice = async (req, res) => {
    try {
        const priceId = req.params.id;
        const deletedPrice = await SeasonalPrice.findByIdAndDelete(priceId);

        if (!deletedPrice) {
            return res.status(404).json({
                message: "Seasonal price not found"
            });
        }

        return res.status(200).json({
            message: "Seasonal price deleted successfully",
            data: deletedPrice
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error deleting seasonal price",
            error: error.message
        });
    }
};

module.exports = {
    createSeasonalPrice,
    getAllSeasonalPrices,
    getSeasonalPricesByPackage,
    updateSeasonalPrice,
    deleteSeasonalPrice
};
