const CustomRequest = require('../models/CustomRequest');

const createCustomRequest = async (req, res) => {
    try {
        const {
            preferredAirline,
            hotelType,
            hotelName,
            transportType,
            duration,
            numberOfAdults,
            numberOfChildren,
            numberOfInfants,
            specialRequests,
            offeredPrice
        } = req.body;

        if (!duration || !numberOfAdults) {
            return res.status(400).json({
                message: "Please provide at least duration and numberOfAdults"
            });
        }

        const newCustomRequest = await CustomRequest.create({
            user: req.user.id,
            preferredAirline,
            hotelType,
            hotelName,
            transportType,
            duration,
            numberOfAdults,
            numberOfChildren,
            numberOfInfants,
            specialRequests,
            offeredPrice
        });

        return res.status(201).json({
            message: "Custom request submitted successfully",
            data: newCustomRequest
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error submitting custom request",
            error: error.message
        });
    }
};

const getAllCustomRequests = async (req, res) => {
    try {
        const allRequests = await CustomRequest.find()
            .populate('user', 'fullName email phone')
            .populate('preferredAirline', 'name')
            .sort({ createdAt: -1 });

        return res.status(200).json({
            message: "All custom requests fetched successfully",
            data: allRequests
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error fetching custom requests",
            error: error.message
        });
    }
};

const getMyCustomRequests = async (req, res) => {
    try {
        const myRequests = await CustomRequest.find({ user: req.user.id })
            .populate('preferredAirline', 'name')
            .sort({ createdAt: -1 });

        return res.status(200).json({
            message: "Your custom requests fetched successfully",
            data: myRequests
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error fetching your custom requests",
            error: error.message
        });
    }
};

const updateCustomRequestStatus = async (req, res) => {
    try {
        const requestId = req.params.id;
        const { status } = req.body;

        const updatedRequest = await CustomRequest.findByIdAndUpdate(
            requestId,
            { status },
            { new: true }
        );

        if (!updatedRequest) {
            return res.status(404).json({
                message: "Custom request not found"
            });
        }

        return res.status(200).json({
            message: "Custom request status updated successfully",
            data: updatedRequest
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error updating custom request status",
            error: error.message
        });
    }
};

const deleteCustomRequest = async (req, res) => {
    try {
        const requestId = req.params.id;
        const deletedRequest = await CustomRequest.findByIdAndDelete(requestId);

        if (!deletedRequest) {
            return res.status(404).json({
                message: "Custom request not found"
            });
        }

        return res.status(200).json({
            message: "Custom request deleted successfully",
            data: deletedRequest
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error deleting custom request",
            error: error.message
        });
    }
};

module.exports = {
    createCustomRequest,
    getAllCustomRequests,
    getMyCustomRequests,
    updateCustomRequestStatus,
    deleteCustomRequest
};
