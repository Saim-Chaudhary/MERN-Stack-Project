const Package = require('../models/Package');

const createPackage = async (req, res) => {
    try {
        const { title, basePrice } = req.body;

        if (!title || !basePrice) {
            return res.status(400).json({
                message: "Please provide title and basePrice"
            });
        }

        const newPackage = await Package.create(req.body);
        return res.status(201).json({
            message : "Package created successfully",
            data: newPackage
        });
    } 
    catch (error) {
        return res.status(500).json({
            message : "Error creating package",
            error : error.message
        });
    }
}

const getAllPackages = async (req, res) => {
    try {
        // Only show active packages to the public
        const allPackages = await Package.find({ isActive: true })
            .populate('airline', 'name')
            .populate('hotels', 'name city category distanceFromHaram')
            .populate('includedServices', 'name category');

        return res.status(200).json({
            message : "Packages fetched successfully",
            data: allPackages
        });
    } 
    catch (error) {
        return res.status(500).json({
            message : "Error fetching packages",
            error : error.message
        });
    }
}

const getAllPackagesAdmin = async (req, res) => {
    try {
        const allPackages = await Package.find()
            .populate('airline', 'name')
            .populate('hotels', 'name city category distanceFromHaram')
            .populate('includedServices', 'name category');

        return res.status(200).json({
            message : "All packages fetched successfully",
            data: allPackages
        });
    }
    catch (error) {
        return res.status(500).json({
            message : "Error fetching all packages",
            error : error.message
        });
    }
}

const getPackageById = async (req, res) => {
    try {
        const packageId = req.params.id;
        const foundPackage = await Package.findById(packageId)
            .populate('airline', 'name')
            .populate('hotels', 'name city category distanceFromHaram')
            .populate('includedServices', 'name category');

        if(!foundPackage) {
            return res.status(404).json({
                message : "Package not found"
            });
        }

        return res.status(200).json({
            message : "Package fetched successfully",
            data: foundPackage
        });
    } 
    catch (error) {
        return res.status(500).json({
            message : "Error fetching package",
            error : error.message
        });    
    }
}

const updatePackage = async (req, res) => {
    try {
        const packageId = req.params.id;
        const updatedPackage = await Package.findByIdAndUpdate(packageId, req.body, { new: true, runValidators: true });

        if(!updatedPackage) {
            return res.status(404).json({
                message : "Package not found"
            });
        }

        return res.status(200).json({
            message : "Package updated Successfuly",
            data: updatedPackage
        });

    } 
    catch (error) {
        return res.status(500).json({
            message : "Error updating package",
            error : error.message
        });    
    }
}

const deletePackage = async (req, res) => {
    try {
        const packageId = req.params.id;
        const deletedPackage = await Package.findByIdAndDelete(packageId);

        if(!deletedPackage) {
            return res.status(404).json({
                message : "Package not found"
            });
        }

        return res.status(200).json({
            message : "Package deleted successfully",
            data: deletedPackage
        });

    } 
    catch (error) {
        return res.status(500).json({
            message : "Error deleting package",
            error : error.message
        });    
    }
}

module.exports = {
    createPackage,
    getAllPackages,
    getAllPackagesAdmin,
    getPackageById,
    updatePackage,
    deletePackage
}