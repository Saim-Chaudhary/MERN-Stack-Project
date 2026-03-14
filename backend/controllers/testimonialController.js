const Testimonial = require('../models/Testimonial');

const createTestimonial = async (req, res) => {
    try {
        const { booking, rating, comment } = req.body;

        if (!rating || !comment) {
            return res.status(400).json({
                message: "Please provide rating and comment"
            });
        }

        const newTestimonial = await Testimonial.create({
            user: req.user.id,
            booking,
            rating,
            comment
        });

        return res.status(201).json({
            message: "Testimonial submitted successfully. It will be visible after admin approval.",
            data: newTestimonial
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error submitting testimonial",
            error: error.message
        });
    }
};

const getApprovedTestimonials = async (req, res) => {
    try {
        const testimonials = await Testimonial.find({ isApproved: true })
            .populate('user', 'fullName')
            .sort({ createdAt: -1 });

        return res.status(200).json({
            message: "Approved testimonials fetched successfully",
            data: testimonials
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error fetching testimonials",
            error: error.message
        });
    }
};

const getAllTestimonialsAdmin = async (req, res) => {
    try {
        const allTestimonials = await Testimonial.find()
            .populate('user', 'fullName email')
            .populate('booking')
            .sort({ createdAt: -1 });

        return res.status(200).json({
            message: "All testimonials fetched successfully",
            data: allTestimonials
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error fetching all testimonials",
            error: error.message
        });
    }
};

const updateTestimonial = async (req, res) => {
    try {
        const testimonialId = req.params.id;
        const { isApproved, isFeatured } = req.body;

        const updatedTestimonial = await Testimonial.findByIdAndUpdate(
            testimonialId,
            { isApproved, isFeatured },
            { new: true }
        );

        if (!updatedTestimonial) {
            return res.status(404).json({
                message: "Testimonial not found"
            });
        }

        return res.status(200).json({
            message: "Testimonial updated successfully",
            data: updatedTestimonial
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error updating testimonial",
            error: error.message
        });
    }
};

const deleteTestimonial = async (req, res) => {
    try {
        const testimonialId = req.params.id;
        const deletedTestimonial = await Testimonial.findByIdAndDelete(testimonialId);

        if (!deletedTestimonial) {
            return res.status(404).json({
                message: "Testimonial not found"
            });
        }

        return res.status(200).json({
            message: "Testimonial deleted successfully",
            data: deletedTestimonial
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error deleting testimonial",
            error: error.message
        });
    }
};

module.exports = {
    createTestimonial,
    getApprovedTestimonials,
    getAllTestimonialsAdmin,
    updateTestimonial,
    deleteTestimonial
};
