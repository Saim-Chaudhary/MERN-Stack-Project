const Package = require('../models/Package');

const parseArrayField = (value) => {
    if (value === undefined || value === null || value === '') {
        return [];
    }

    if (Array.isArray(value)) {
        return value;
    }

    if (typeof value === 'string') {
        try {
            const parsedValue = JSON.parse(value);
            if (Array.isArray(parsedValue)) {
                return parsedValue;
            }
        } catch (error) {
            return value
                .split(',')
                .map((item) => item.trim())
                .filter(Boolean);
        }
    }

    return [value];
};

const parseBooleanField = (value, fallback = undefined) => {
    if (value === undefined || value === null || value === '') {
        return fallback;
    }

    if (typeof value === 'boolean') {
        return value;
    }

    return String(value).toLowerCase() === 'true';
};

const buildPackagePayload = (body, file, existingPackage = null) => {
    const hasValue = (value) => value !== undefined && value !== null && value !== '';
    const getTextValue = (field) => {
        if (hasValue(body[field])) {
            return body[field];
        }
        return existingPackage ? existingPackage[field] : undefined;
    };

    const getNumberValue = (field) => {
        if (hasValue(body[field])) {
            return Number(body[field]);
        }
        return existingPackage ? existingPackage[field] : undefined;
    };

    const getArrayValue = (field) => {
        if (hasValue(body[field])) {
            return parseArrayField(body[field]);
        }
        return existingPackage ? existingPackage[field] : [];
    };

    const imageUrl = file?.path || file?.secure_url || (hasValue(body.imageUrl) ? body.imageUrl : existingPackage?.imageUrl);

    return {
        title: getTextValue('title'),
        description: getTextValue('description'),
        imageUrl,
        basePrice: getNumberValue('basePrice'),
        duration: getNumberValue('duration'),
        airline: hasValue(body.airline) ? body.airline : existingPackage?.airline,
        hotels: getArrayValue('hotels'),
        transportType: getTextValue('transportType'),
        includedServices: getArrayValue('includedServices'),
        departureDate: getTextValue('departureDate'),
        returnDate: getTextValue('returnDate'),
        cancellationPolicy: getTextValue('cancellationPolicy'),
        isActive: parseBooleanField(body.isActive, existingPackage ? existingPackage.isActive : true),
    };
};

const createPackage = async (req, res) => {
    try {
        const { title, basePrice } = req.body;

        if (!title || !basePrice) {
            return res.status(400).json({
                message: "Please provide title and basePrice"
            });
        }

        const packagePayload = buildPackagePayload(req.body, req.file);
        const newPackage = await Package.create(packagePayload);
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
        const existingPackage = await Package.findById(packageId);

        if(!existingPackage) {
            return res.status(404).json({
                message : "Package not found"
            });
        }

        const packagePayload = buildPackagePayload(req.body, req.file, existingPackage);
        const updatedPackage = await Package.findByIdAndUpdate(packageId, packagePayload, { new: true, runValidators: true });

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