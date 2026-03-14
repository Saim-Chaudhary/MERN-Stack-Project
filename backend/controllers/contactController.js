const Contact = require('../models/Contact');

const submitContact = async (req, res) => {
    try {
        const { fullName, email, phone, subject, message } = req.body;

        if (!fullName || !email || !message) {
            return res.status(400).json({
                message: "Please provide fullName, email, and message"
            });
        }

        const newContact = await Contact.create({
            fullName,
            email,
            phone,
            subject,
            message
        });

        return res.status(201).json({
            message: "Your message has been sent successfully",
            data: newContact
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error submitting contact form",
            error: error.message
        });
    }
};

const getAllContacts = async (req, res) => {
    try {
        const allContacts = await Contact.find().sort({ createdAt: -1 });

        return res.status(200).json({
            message: "All contact messages fetched successfully",
            data: allContacts
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error fetching contact messages",
            error: error.message
        });
    }
};

const updateContactStatus = async (req, res) => {
    try {
        const contactId = req.params.id;
        const { status } = req.body;

        const updatedContact = await Contact.findByIdAndUpdate(
            contactId,
            { status },
            { new: true }
        );

        if (!updatedContact) {
            return res.status(404).json({
                message: "Contact message not found"
            });
        }

        return res.status(200).json({
            message: "Contact status updated successfully",
            data: updatedContact
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error updating contact status",
            error: error.message
        });
    }
};

const deleteContact = async (req, res) => {
    try {
        const contactId = req.params.id;
        const deletedContact = await Contact.findByIdAndDelete(contactId);

        if (!deletedContact) {
            return res.status(404).json({
                message: "Contact message not found"
            });
        }

        return res.status(200).json({
            message: "Contact message deleted successfully",
            data: deletedContact
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error deleting contact message",
            error: error.message
        });
    }
};

module.exports = {
    submitContact,
    getAllContacts,
    updateContactStatus,
    deleteContact
};
