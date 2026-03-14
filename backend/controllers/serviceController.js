const Service = require('../models/Service');

const createService = async (req, res) => {
    try {
        const { name, description, category } = req.body;

        if (!name) {
            return res.status(400).json({
                message: "Please provide the service name"
            });
        }

        const newService = await Service.create({
            name,
            description,
            category
        });

        return res.status(201).json({
            message: "Service added successfully",
            data: newService
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error adding service",
            error: error.message
        });
    }
};

const getAllServices = async (req, res) => {
    try {
        const allServices = await Service.find({ isActive: true });

        return res.status(200).json({
            message: "All services fetched successfully",
            data: allServices
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error fetching services",
            error: error.message
        });
    }
};

const getServiceById = async (req, res) => {
    try {
        const serviceId = req.params.id;
        const foundService = await Service.findById(serviceId);

        if (!foundService) {
            return res.status(404).json({
                message: "Service not found"
            });
        }

        return res.status(200).json({
            message: "Service fetched successfully",
            data: foundService
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error fetching service",
            error: error.message
        });
    }
};

const updateService = async (req, res) => {
    try {
        const serviceId = req.params.id;
        const updatedService = await Service.findByIdAndUpdate(serviceId, req.body, { new: true });

        if (!updatedService) {
            return res.status(404).json({
                message: "Service not found"
            });
        }

        return res.status(200).json({
            message: "Service updated successfully",
            data: updatedService
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error updating service",
            error: error.message
        });
    }
};

const deleteService = async (req, res) => {
    try {
        const serviceId = req.params.id;
        const deletedService = await Service.findByIdAndDelete(serviceId);

        if (!deletedService) {
            return res.status(404).json({
                message: "Service not found"
            });
        }

        return res.status(200).json({
            message: "Service deleted successfully",
            data: deletedService
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error deleting service",
            error: error.message
        });
    }
};

module.exports = {
    createService,
    getAllServices,
    getServiceById,
    updateService,
    deleteService
};
