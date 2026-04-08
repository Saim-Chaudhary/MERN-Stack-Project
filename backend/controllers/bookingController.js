const Booking = require('../models/Booking');
const User = require('../models/User');
const Guide = require('../models/Guide');
const Passenger = require('../models/Passenger');

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

        const defaultPassengers = [];
        const adults = Number(numberOfAdults || 0);
        const children = Number(numberOfChildren || 0);
        const infants = Number(numberOfInfants || 0);

        for (let i = 1; i <= adults; i++) {
            defaultPassengers.push({
                booking: newBooking._id,
                fullName: `Adult Passenger ${i}`,
                age: 30,
                passengerType: 'Adult'
            });
        }

        for (let i = 1; i <= children; i++) {
            defaultPassengers.push({
                booking: newBooking._id,
                fullName: `Child Passenger ${i}`,
                age: 10,
                passengerType: 'Child'
            });
        }

        for (let i = 1; i <= infants; i++) {
            defaultPassengers.push({
                booking: newBooking._id,
                fullName: `Infant Passenger ${i}`,
                age: 1,
                passengerType: 'Infant'
            });
        }

        if (defaultPassengers.length > 0) {
            await Passenger.insertMany(defaultPassengers);
        }

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
            .populate('package', 'title basePrice departureDate returnDate')
            .populate('assignedGuide', 'fullName phone email');

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
            .populate({
                path: 'package',
                select: 'title basePrice duration transportType departureDate returnDate airline hotels',
                populate: [
                    { path: 'airline', select: 'name contactNumber' },
                    { path: 'hotels', select: 'name city category distanceFromHaram' }
                ]
            })
            .populate('assignedGuide', 'fullName phone');

        if (!foundBooking) {
            return res.status(404).json({
                message: "Booking not found"
            });
        }

        if (req.user.role !== 'admin' && String(foundBooking.user?._id) !== String(req.user.id)) {
            return res.status(403).json({
                message: "Access denied"
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

const assignGuideToCustomer = async (req, res) => {
    try {
        const { userId } = req.params;
        const { guideId } = req.body;

        if (!guideId) {
            return res.status(400).json({
                message: "Please provide guideId"
            });
        }

        const foundUser = await User.findById(userId);
        if (!foundUser) {
            return res.status(404).json({
                message: "Customer not found"
            });
        }

        const foundGuide = await Guide.findById(guideId);
        if (!foundGuide) {
            return res.status(404).json({
                message: "Guide not found"
            });
        }

        const customerBookings = await Booking.find({ user: userId, status: { $ne: 'Cancelled' } }).select('_id');
        if (customerBookings.length === 0) {
            return res.status(404).json({
                message: "No active bookings found for this customer"
            });
        }

        const updateResult = await Booking.updateMany(
            { user: userId, status: { $ne: 'Cancelled' } },
            { assignedGuide: guideId }
        );

        return res.status(200).json({
            message: "Guide assigned to customer bookings successfully",
            data: {
                matchedCount: updateResult.matchedCount,
                modifiedCount: updateResult.modifiedCount
            }
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error assigning guide to customer",
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
    deleteBooking,
    assignGuideToCustomer
};
