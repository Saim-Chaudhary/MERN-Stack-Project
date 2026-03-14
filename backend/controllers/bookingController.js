const Booking = require('../models/Booking');

const createBooking = async (req, res) => {
    try {
        const { package: packageId, numberOfAdults, numberOfChildren, numberOfInfants, totalPrice } = req.body;

        if (!packageId || !numberOfAdults || !totalPrice) {
            return res.status(400).json({
                message: "Please provide package, numberOfAdults, and totalPrice"
            });
        }

        const newBooking = await Booking.create({
            user: req.user.id,
            package: packageId,
            numberOfAdults,
            numberOfChildren,
            numberOfInfants,
            totalPrice
        });

        return res.status(201).json({
            message: "Booking created successfully",
            data: newBooking
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error creating booking",
            error: error.message
        });
    }
};

const getAllBookings = async (req, res) => {
    try {
        const allBookings = await Booking.find()
            .populate('user', 'fullName email phone')
            .populate('package', 'title basePrice')
            .populate('assignedGuide', 'fullName phone');

        return res.status(200).json({
            message: "All bookings fetched successfully",
            data: allBookings
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error fetching bookings",
            error: error.message
        });
    }
};

const getMyBookings = async (req, res) => {
    try {
        const myBookings = await Booking.find({ user: req.user.id })
            .populate('package', 'title basePrice departureDate returnDate');

        return res.status(200).json({
            message: "Your bookings fetched successfully",
            data: myBookings
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error fetching your bookings",
            error: error.message
        });
    }
};

const getBookingById = async (req, res) => {
    try {
        const bookingId = req.params.id;
        const foundBooking = await Booking.findById(bookingId)
            .populate('user', 'fullName email phone')
            .populate('package', 'title basePrice')
            .populate('assignedGuide', 'fullName phone');

        if (!foundBooking) {
            return res.status(404).json({
                message: "Booking not found"
            });
        }

        return res.status(200).json({
            message: "Booking fetched successfully",
            data: foundBooking
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error fetching booking",
            error: error.message
        });
    }
};

const updateBookingStatus = async (req, res) => {
    try {
        const bookingId = req.params.id;
        const { status, paymentStatus, assignedGuide } = req.body;

        const updatedBooking = await Booking.findByIdAndUpdate(
            bookingId,
            { status, paymentStatus, assignedGuide },
            { new: true }
        );

        if (!updatedBooking) {
            return res.status(404).json({
                message: "Booking not found"
            });
        }

        return res.status(200).json({
            message: "Booking updated successfully",
            data: updatedBooking
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error updating booking",
            error: error.message
        });
    }
};

const deleteBooking = async (req, res) => {
    try {
        const bookingId = req.params.id;
        const deletedBooking = await Booking.findByIdAndDelete(bookingId);

        if (!deletedBooking) {
            return res.status(404).json({
                message: "Booking not found"
            });
        }

        return res.status(200).json({
            message: "Booking deleted successfully",
            data: deletedBooking
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error deleting booking",
            error: error.message
        });
    }
};

module.exports = {
    createBooking,
    getAllBookings,
    getMyBookings,
    getBookingById,
    updateBookingStatus,
    deleteBooking
};
