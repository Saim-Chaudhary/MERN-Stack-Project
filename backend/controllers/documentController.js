const Document = require('../models/Document');

const uploadDocument = async (req, res) => {
    try {
        const { documentType, fileUrl } = req.body;

        if (!documentType || !fileUrl) {
            return res.status(400).json({
                message: "Please provide documentType and fileUrl"
            });
        }

        const newDocument = await Document.create({
            user: req.user.id,
            documentType,
            fileUrl
        });

        return res.status(201).json({
            message: "Document submitted successfully. Waiting for admin verification.",
            data: newDocument
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error submitting document",
            error: error.message
        });
    }
};

const getMyDocuments = async (req, res) => {
    try {
        const myDocuments = await Document.find({ user: req.user.id })
            .populate('documentType', 'name description');

        return res.status(200).json({
            message: "Your documents fetched successfully",
            data: myDocuments
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error fetching your documents",
            error: error.message
        });
    }
};

const getAllDocuments = async (req, res) => {
    try {
        const allDocuments = await Document.find()
            .populate('user', 'fullName email')
            .populate('documentType', 'name');

        return res.status(200).json({
            message: "All documents fetched successfully",
            data: allDocuments
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error fetching documents",
            error: error.message
        });
    }
};

const updateDocumentStatus = async (req, res) => {
    try {
        const documentId = req.params.id;
        const { status } = req.body;

        const updatedDocument = await Document.findByIdAndUpdate(
            documentId,
            { status },
            { new: true }
        );

        if (!updatedDocument) {
            return res.status(404).json({
                message: "Document not found"
            });
        }

        return res.status(200).json({
            message: "Document status updated successfully",
            data: updatedDocument
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error updating document status",
            error: error.message
        });
    }
};

const deleteDocument = async (req, res) => {
    try {
        const documentId = req.params.id;
        const deletedDocument = await Document.findByIdAndDelete(documentId);

        if (!deletedDocument) {
            return res.status(404).json({
                message: "Document not found"
            });
        }

        return res.status(200).json({
            message: "Document deleted successfully",
            data: deletedDocument
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error deleting document",
            error: error.message
        });
    }
};

module.exports = {
    uploadDocument,
    getMyDocuments,
    getAllDocuments,
    updateDocumentStatus,
    deleteDocument
};
