const Payment = require('../models/Payment');
const Booking = require('../models/Booking');
const stripe = require('../config/stripe');
const { sendPaymentSuccessEmail } = require('../utils/sendPaymentEmail');

const DEPOSIT_PERCENT = 0.3; // 30% deposit, 70% remaining

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

const syncBookingPaymentStatus = async (bookingId) => {
    const booking = await Booking.findById(bookingId);

    if (!booking) {
        return null;
    }

    const payments = await Payment.find({
        booking: bookingId,
        paymentStatus: { $ne: 'Failed' }
    });

    const totalPaid = payments.reduce((sum, payment) => {
        return sum + Number(payment.amount || 0);
    }, 0);

    booking.amountPaid = totalPaid;

    if (totalPaid <= 0) {
        booking.paymentStatus = 'Pending';
    } else if (totalPaid >= Number(booking.totalPrice || 0)) {
        booking.paymentStatus = 'Paid';
    } else {
        booking.paymentStatus = 'Partial';
    }

    await booking.save();
    return booking;
};

// ----- Existing manual payment endpoints (kept for admin use) -----

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
            paidBy: req.user.id,
            amount,
            paymentMethod,
            transactionId
        });

        await syncBookingPaymentStatus(booking);

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
        const payments = await Payment.find({ booking: bookingId })
            .populate('paidBy', 'fullName email phone')
            .populate({ path: 'booking', populate: [{ path: 'user', select: 'fullName email phone' }, { path: 'package', select: 'title' }] })
            .sort({ createdAt: -1 });

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
            .populate({ path: 'booking', populate: [{ path: 'user', select: 'fullName email phone' }, { path: 'package', select: 'title' }] })
            .populate('paidBy', 'fullName email phone')
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

        await syncBookingPaymentStatus(updatedPayment.booking);

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

// ----- Stripe checkout flow -----

const resolveAmount = (booking, type) => {
    const total = Number(booking.totalPrice || 0);
    const paid = Number(booking.amountPaid || 0);
    const depositAmount = Math.round(total * DEPOSIT_PERCENT * 100) / 100;
    const remainingAmount = Math.round((total - paid) * 100) / 100;

    if (paid >= total) {
        return { error: "This booking is already fully paid" };
    }

    if (type === 'full') {
        if (paid > 0) {
            return { error: "A payment has already been made on this booking. Use 'remaining' instead." };
        }
        return { amount: total, paymentType: 'Full' };
    }

    if (type === 'deposit') {
        if (paid > 0) {
            return { error: "Deposit has already been paid for this booking" };
        }
        return { amount: depositAmount, paymentType: 'Deposit' };
    }

    if (type === 'remaining') {
        if (paid <= 0) {
            return { error: "No deposit has been paid yet. Pay the deposit first." };
        }
        return { amount: remainingAmount, paymentType: 'Remaining' };
    }

    return { error: "Invalid payment type. Use 'full', 'deposit', or 'remaining'." };
};

// POST /api/payments/checkout-session
const createCheckoutSession = async (req, res) => {
    try {
        const { bookingId, type } = req.body;

        if (!bookingId || !type) {
            return res.status(400).json({ message: "Please provide bookingId and type" });
        }

        const booking = await Booking.findById(bookingId).populate('package', 'title');

        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        if (booking.user.toString() !== req.user.id) {
            return res.status(403).json({ message: "You are not allowed to pay for this booking" });
        }

        const resolved = resolveAmount(booking, type);

        if (resolved.error) {
            return res.status(400).json({ message: resolved.error });
        }

        const { amount, paymentType } = resolved;

        // NOTE: Stripe does not support PKR directly for card payments,
        // so amounts are charged in USD. Adjust currency/conversion as needed
        // for your real payment provider.
        const session = await stripe.checkout.sessions.create({
            mode: 'payment',
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'pkr',
                        unit_amount: Math.round(amount * 100),
                        product_data: {
                            name: `${paymentType} Payment - ${booking.package?.title || 'Booking'}`,
                            description: `Booking ID: ${booking._id}`
                        }
                    },
                    quantity: 1
                }
            ],
            metadata: {
                bookingId: booking._id.toString(),
                paymentType,
                amount: amount.toString(),
                userId: req.user.id
            },
            success_url: `${FRONTEND_URL}/customer/payments/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${FRONTEND_URL}/customer/bookings/${booking._id}?payment=cancelled`
        });

        return res.status(200).json({
            message: "Checkout session created",
            url: session.url
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error creating checkout session",
            error: error.message
        });
    }
};

// GET /api/payments/verify/:sessionId
const verifyPayment = async (req, res) => {
    try {
        const { sessionId } = req.params;

        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if (!session) {
            return res.status(404).json({ message: "Session not found" });
        }

        if (session.metadata?.userId !== req.user.id) {
            return res.status(403).json({ message: "Not allowed to verify this session" });
        }

        const existing = await Payment.findOne({ stripeSessionId: session.id });
        if (existing) {
            return res.status(200).json({
                message: "Payment already recorded",
                data: existing
            });
        }

        if (session.payment_status !== 'paid') {
            return res.status(200).json({
                message: "Payment not completed",
                status: session.payment_status
            });
        }

        const { bookingId, paymentType, amount } = session.metadata;

        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        const paidAmount = Number(amount);

        const payment = await Payment.create({
            booking: booking._id,
            paidBy: booking.user,
            amount: paidAmount,
            paymentMethod: 'Stripe',
            transactionId: session.payment_intent,
            paymentType,
            stripeSessionId: session.id,
            paymentStatus: 'Completed'
        });

        const syncedBooking = await syncBookingPaymentStatus(booking._id);

        // ───── Send payment success email ─────
        const fullBooking = await Booking.findById(booking._id)
            .populate('user', 'fullName email')
            .populate('package', 'title');

        if (fullBooking?.user?.email) {
            await sendPaymentSuccessEmail({
                toEmail: fullBooking.user.email,
                customerName: fullBooking.user.fullName,
                packageTitle: fullBooking.package?.title || 'Umrah Package',
                amount: paidAmount,
                paymentType,
                bookingId: fullBooking._id,
            });
        }

        return res.status(200).json({
            message: "Payment verified and recorded",
            data: payment,
            booking: syncedBooking || booking
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error verifying payment",
            error: error.message
        });
    }
};

module.exports = {
    createPayment,
    getPaymentsByBooking,
    getAllPayments,
    updatePaymentStatus,
    createCheckoutSession,
    verifyPayment
};