const Passenger = require('../models/Passenger');
const Booking = require('../models/Booking');

const buildDefaultPassengersForBooking = (bookingDoc) => {
    const adults = Number(bookingDoc?.numberOfAdults || 0);
    const children = Number(bookingDoc?.numberOfChildren || 0);
    const infants = Number(bookingDoc?.numberOfInfants || 0);

    const rows = [];

    for (let i = 1; i <= adults; i++) {
        rows.push({
            booking: bookingDoc._id,
            fullName: `Adult Passenger ${i}`,
            age: 30,
            passengerType: 'Adult'
        });
    }

    for (let i = 1; i <= children; i++) {
        rows.push({
            booking: bookingDoc._id,
            fullName: `Child Passenger ${i}`,
            age: 10,
            passengerType: 'Child'
        });
    }

    for (let i = 1; i <= infants; i++) {
        rows.push({
            booking: bookingDoc._id,
            fullName: `Infant Passenger ${i}`,
            age: 1,
            passengerType: 'Infant'
        });
    }

    return rows;
};

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

        const foundBooking = await Booking.findById(booking);

        if (!foundBooking) {
            return res.status(404).json({
                message: "Booking not found"
            });
        }

        if (req.user.role !== 'admin' && String(foundBooking.user) !== String(req.user.id)) {
            return res.status(403).json({
                message: "Access denied"
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

        const foundBooking = await Booking.findById(bookingId);

        if (!foundBooking) {
            return res.status(404).json({
                message: "Booking not found"
            });
        }

        if (req.user.role !== 'admin' && String(foundBooking.user) !== String(req.user.id)) {
            return res.status(403).json({
                message: "Access denied"
            });
        }

        let passengers = await Passenger.find({ booking: bookingId });

        // Backfill default passengers for older bookings that have traveler counts
        // but no passenger rows yet.
        if (passengers.length === 0) {
            const defaultPassengers = buildDefaultPassengersForBooking(foundBooking);
            if (defaultPassengers.length > 0) {
                await Passenger.insertMany(defaultPassengers);
                passengers = await Passenger.find({ booking: bookingId });
            }
        }

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
        const existingPassenger = await Passenger.findById(passengerId);

        if (!existingPassenger) {
            return res.status(404).json({
                message: "Passenger not found"
            });
        }

        const foundBooking = await Booking.findById(existingPassenger.booking);

        if (!foundBooking) {
            return res.status(404).json({
                message: "Booking not found"
            });
        }

        if (req.user.role !== 'admin' && String(foundBooking.user) !== String(req.user.id)) {
            return res.status(403).json({
                message: "Access denied"
            });
        }

        const updatedPassenger = await Passenger.findByIdAndUpdate(passengerId, req.body, { new: true });

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
