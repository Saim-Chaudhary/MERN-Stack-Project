const Hotel = require('../models/Hotel');

const createHotel = async (req, res) => {
    try {
        const { name, city, distanceFromHaram, category } = req.body;

        if (!name) {
            return res.status(400).json({
                message: "Please provide the hotel name"
            });
        }

        const newHotel = await Hotel.create({
            name,
            city,
            distanceFromHaram,
            category
        });

        return res.status(201).json({
            message: "Hotel added successfully",
            data: newHotel
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error adding hotel",
            error: error.message
        });
    }
};

const getAllHotels = async (req, res) => {
    try {
        const allHotels = await Hotel.find();

        return res.status(200).json({
            message: "All hotels fetched successfully",
            data: allHotels
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error fetching hotels",
            error: error.message
        });
    }
};

const getHotelById = async (req, res) => {
    try {
        const hotelId = req.params.id;
        const foundHotel = await Hotel.findById(hotelId);

        if (!foundHotel) {
            return res.status(404).json({
                message: "Hotel not found"
            });
        }

        return res.status(200).json({
            message: "Hotel fetched successfully",
            data: foundHotel
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error fetching hotel",
            error: error.message
        });
    }
};

const updateHotel = async (req, res) => {
    try {
        const hotelId = req.params.id;
        const updatedHotel = await Hotel.findByIdAndUpdate(hotelId, req.body, { new: true });

        if (!updatedHotel) {
            return res.status(404).json({
                message: "Hotel not found"
            });
        }

        return res.status(200).json({
            message: "Hotel updated successfully",
            data: updatedHotel
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error updating hotel",
            error: error.message
        });
    }
};

const deleteHotel = async (req, res) => {
    try {
        const hotelId = req.params.id;
        const deletedHotel = await Hotel.findByIdAndDelete(hotelId);

        if (!deletedHotel) {
            return res.status(404).json({
                message: "Hotel not found"
            });
        }

        return res.status(200).json({
            message: "Hotel deleted successfully",
            data: deletedHotel
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error deleting hotel",
            error: error.message
        });
    }
};

module.exports = {
    createHotel,
    getAllHotels,
    getHotelById,
    updateHotel,
    deleteHotel
};
