const Passenger = require('../models/Passenger');

const addPassenger = async (req, res) => {
    try {
        const {
            booking,
            fullName,
            age,
            passengerType,
            passportNumber,
            nationality,
            gender,
            specialRequirements
        } = req.body;

        if (!booking || !fullName || !age || !passengerType) {
            return res.status(400).json({
                message: "Please provide booking, fullName, age, and passengerType"
            });
        }

        const newPassenger = await Passenger.create({
            booking,
            fullName,
            age,
            passengerType,
            passportNumber,
            nationality,
            gender,
            specialRequirements
        });

        return res.status(201).json({
            message: "Passenger added successfully",
            data: newPassenger
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error adding passenger",
            error: error.message
        });
    }
};

const getPassengersByBooking = async (req, res) => {
    try {
        const bookingId = req.params.bookingId;
        const passengers = await Passenger.find({ booking: bookingId });

        return res.status(200).json({
            message: "Passengers fetched successfully",
            data: passengers
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error fetching passengers",
            error: error.message
        });
    }
};

const updatePassenger = async (req, res) => {
    try {
        const passengerId = req.params.id;
        const updatedPassenger = await Passenger.findByIdAndUpdate(passengerId, req.body, { new: true });

        if (!updatedPassenger) {
            return res.status(404).json({
                message: "Passenger not found"
            });
        }

        return res.status(200).json({
            message: "Passenger updated successfully",
            data: updatedPassenger
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error updating passenger",
            error: error.message
        });
    }
};

const deletePassenger = async (req, res) => {
    try {
        const passengerId = req.params.id;
        const deletedPassenger = await Passenger.findByIdAndDelete(passengerId);

        if (!deletedPassenger) {
            return res.status(404).json({
                message: "Passenger not found"
            });
        }

        return res.status(200).json({
            message: "Passenger deleted successfully",
            data: deletedPassenger
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error deleting passenger",
            error: error.message
        });
    }
};

module.exports = {
    addPassenger,
    getPassengersByBooking,
    updatePassenger,
    deletePassenger
};
