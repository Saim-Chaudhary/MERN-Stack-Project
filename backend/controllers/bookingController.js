const Booking = require('../models/Booking');
const User = require('../models/User');
const Guide = require('../models/Guide');
const Package = require('../models/Package');

const createBooking = async (req, res) => {
    try {
        const {
            package: packageId,
            user,
            travelDate,
            notes,
            numberOfAdults,
            numberOfChildren,
            numberOfInfants,
            finalPrice
        } = req.body;

        // ❌ Block frontend price injection
        if (req.body.totalPrice) {
            return res.status(400).json({
                message: "Do not send totalPrice. It is calculated by server."
            });
        }

        // ✅ Validate required fields
        if (!packageId || !numberOfAdults) {
            return res.status(400).json({
                message: "Please provide package and numberOfAdults"
            });
        }

        // ✅ Get package from DB
        const pkg = await Package.findById(packageId);
        if (!pkg) {
            return res.status(404).json({
                message: "Package not found"
            });
        }

        // 💰 Backend price calculation (SECURE)
        const unitPrice = pkg.basePrice;

        const calculatedTotalPrice =
            (Number(numberOfAdults) * unitPrice) +
            (Number(numberOfChildren || 0) * unitPrice * 0.7) +
            (Number(numberOfInfants || 0) * unitPrice * 0.2);

        // 💾 Save booking
        const newBooking = await Booking.create({
            user: user || req.user.id,
            package: packageId,
            travelDate,
            notes,
            numberOfAdults,
            numberOfChildren,
            numberOfInfants,
            totalPrice: calculatedTotalPrice,

            finalPrice: finalPrice || null
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
        const { status, paymentStatus, assignedGuide, finalPrice } = req.body;

        const updateData = {};

        if (status !== undefined) {
            updateData.status = status;
        }

        if (paymentStatus !== undefined) {
            updateData.paymentStatus = paymentStatus;
        }

        if (assignedGuide !== undefined) {
            updateData.assignedGuide = assignedGuide;
        }
        if (finalPrice !== undefined) {
            updateData.finalPrice = finalPrice;
        }

        const updatedBooking = await Booking.findByIdAndUpdate(
            bookingId,
            { $set: updateData },
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

const updateBookingByAdmin = async (req, res) => {
    try {
        const bookingId = req.params.id;

        const updated = await Booking.findByIdAndUpdate(
            bookingId,
            { $set: req.body },
            { new: true }
        ).populate('user package assignedGuide');

        if (!updated) {
            return res.status(404).json({ message: "Booking not found" });
        }

        return res.status(200).json({
            message: "Booking updated successfully",
            data: updated
        });

    } catch (error) {
        return res.status(500).json({
            message: "Error updating booking",
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
    assignGuideToCustomer,
    updateBookingByAdmin
};
