const Airline = require('../models/Airline');

const createAirline = async (req, res) => {
    try {
        const { name, contactNumber, contractDetails } = req.body;

        if (!name) {
            return res.status(400).json({
                message: "Please provide the airline name"
            });
        }

        const newAirline = await Airline.create({
            name,
            contactNumber,
            contractDetails
        });

        return res.status(201).json({
            message: "Airline added successfully",
            data: newAirline
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error adding airline",
            error: error.message
        });
    }
};

const getAllAirlines = async (req, res) => {
    try {
        const allAirlines = await Airline.find();

        return res.status(200).json({
            message: "All airlines fetched successfully",
            data: allAirlines
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error fetching airlines",
            error: error.message
        });
    }
};

const getAirlineById = async (req, res) => {
    try {
        const airlineId = req.params.id;
        const foundAirline = await Airline.findById(airlineId);

        if (!foundAirline) {
            return res.status(404).json({
                message: "Airline not found"
            });
        }

        return res.status(200).json({
            message: "Airline fetched successfully",
            data: foundAirline
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error fetching airline",
            error: error.message
        });
    }
};

const updateAirline = async (req, res) => {
    try {
        const airlineId = req.params.id;
        const updatedAirline = await Airline.findByIdAndUpdate(airlineId, req.body, { new: true });

        if (!updatedAirline) {
            return res.status(404).json({
                message: "Airline not found"
            });
        }

        return res.status(200).json({
            message: "Airline updated successfully",
            data: updatedAirline
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error updating airline",
            error: error.message
        });
    }
};

const deleteAirline = async (req, res) => {
    try {
        const airlineId = req.params.id;
        const deletedAirline = await Airline.findByIdAndDelete(airlineId);

        if (!deletedAirline) {
            return res.status(404).json({
                message: "Airline not found"
            });
        }

        return res.status(200).json({
            message: "Airline deleted successfully",
            data: deletedAirline
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error deleting airline",
            error: error.message
        });
    }
};

module.exports = {
    createAirline,
    getAllAirlines,
    getAirlineById,
    updateAirline,
    deleteAirline
};
