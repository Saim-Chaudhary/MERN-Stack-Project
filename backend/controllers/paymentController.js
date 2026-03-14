const Payment = require('../models/Payment');

const createPayment = async (req, res) => {
    try {
        const { booking, amount, paymentMethod, transactionId } = req.body;

        if (!booking || !amount || !paymentMethod) {
            return res.status(400).json({
                message: "Please provide booking, amount, and paymentMethod"
            });
        }

        const newPayment = await Payment.create({
            booking,
            amount,
            paymentMethod,
            transactionId
        });

        return res.status(201).json({
            message: "Payment recorded successfully",
            data: newPayment
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error recording payment",
            error: error.message
        });
    }
};

const getPaymentsByBooking = async (req, res) => {
    try {
        const bookingId = req.params.bookingId;
        const payments = await Payment.find({ booking: bookingId });

        return res.status(200).json({
            message: "Payments fetched successfully",
            data: payments
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error fetching payments",
            error: error.message
        });
    }
};

const getAllPayments = async (req, res) => {
    try {
        const allPayments = await Payment.find()
            .populate('booking')
            .sort({ createdAt: -1 });

        return res.status(200).json({
            message: "All payments fetched successfully",
            data: allPayments
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error fetching all payments",
            error: error.message
        });
    }
};

const updatePaymentStatus = async (req, res) => {
    try {
        const paymentId = req.params.id;
        const { paymentStatus } = req.body;

        const updatedPayment = await Payment.findByIdAndUpdate(
            paymentId,
            { paymentStatus },
            { new: true }
        );

        if (!updatedPayment) {
            return res.status(404).json({
                message: "Payment not found"
            });
        }

        return res.status(200).json({
            message: "Payment status updated successfully",
            data: updatedPayment
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error updating payment status",
            error: error.message
        });
    }
};

module.exports = {
    createPayment,
    getPaymentsByBooking,
    getAllPayments,
    updatePaymentStatus
};
