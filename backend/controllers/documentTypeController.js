const DocumentType = require('../models/DocumentType');

const createDocumentType = async (req, res) => {
    try {
        const { name, description, isRequired, expiryDurationMonths, requirements, validationRules } = req.body;

        if (!name) {
            return res.status(400).json({
                message: "Please provide the document type name"
            });
        }

        const newDocumentType = await DocumentType.create({
            name,
            description,
            isRequired,
            expiryDurationMonths,
            requirements,
            validationRules
        });

        return res.status(201).json({
            message: "Document type created successfully",
            data: newDocumentType
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error creating document type",
            error: error.message
        });
    }
};

const getAllDocumentTypes = async (req, res) => {
    try {
        const allDocumentTypes = await DocumentType.find();

        return res.status(200).json({
            message: "All document types fetched successfully",
            data: allDocumentTypes
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error fetching document types",
            error: error.message
        });
    }
};

const updateDocumentType = async (req, res) => {
    try {
        const documentTypeId = req.params.id;
        const updatedDocumentType = await DocumentType.findByIdAndUpdate(documentTypeId, req.body, { new: true });

        if (!updatedDocumentType) {
            return res.status(404).json({
                message: "Document type not found"
            });
        }

        return res.status(200).json({
            message: "Document type updated successfully",
            data: updatedDocumentType
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error updating document type",
            error: error.message
        });
    }
};

const deleteDocumentType = async (req, res) => {
    try {
        const documentTypeId = req.params.id;
        const deletedDocumentType = await DocumentType.findByIdAndDelete(documentTypeId);

        if (!deletedDocumentType) {
            return res.status(404).json({
                message: "Document type not found"
            });
        }

        return res.status(200).json({
            message: "Document type deleted successfully",
            data: deletedDocumentType
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error deleting document type",
            error: error.message
        });
    }
};

module.exports = {
    createDocumentType,
    getAllDocumentTypes,
    updateDocumentType,
    deleteDocumentType
};
