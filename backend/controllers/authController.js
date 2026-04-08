const userModel = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const registerUser = async (req, res) => {
    try {
        const { fullName, email, phone, password, address } = req.body;

        if (!fullName || !email || !phone || !password || !address) {
            return res.status(400).json({
                message: "Please fill all the fields"
            });
        }

        const userExist = await userModel.findOne({
            email: email
        });

        if (userExist) {
            return res.status(400).json({
                message: "User already exists"  
            });
        }

        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);

        const createUser = await userModel.create({
            fullName: fullName,
            email: email,
            phone: phone,
            password: hashedPassword,
            address: address
        });

        res.status(201).json({
            message: "User created successfuly",
            fullName : createUser.fullName,
            email: createUser.email,
            role: createUser.role,
        });
    } 
    catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            error 
        });
    }

}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Please fill all the fields"
            });
        }

        const checkUser = await userModel.findOne({
            email: email
        });

        if (!checkUser) {
            return res.status(400).json({
                message: "User does not exist"
            });
        }

        const checkPassword = await bcrypt.compare(password, checkUser.password);

        if (!checkPassword) {
            return res.status(400).json({
                message: "Incorrect password"
            });
        }

        const token = jwt.sign({
            id: checkUser._id,
            role: checkUser.role
        }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRE || "6h"
        });

        res.status(200).json({
            message: "Login successful",
            fullName : checkUser.fullName,
            email: checkUser.email,
            role: checkUser.role,
            token
        });
    } 
    catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            error
        });
    }

}

// Get logged-in user's profile
const getProfile = async (req, res) => {
    try {
        // req.user.id comes from the JWT token (set by authMiddleware)
        const user = await userModel.findById(req.user.id).select('-password');

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        return res.status(200).json({
            message: "Profile fetched successfully",
            data: user
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            error
        });
    }
};

const updateMyProfile = async (req, res) => {
    try {
        const { fullName, phone, address } = req.body;

        if (!fullName || !phone) {
            return res.status(400).json({
                message: "Full name and phone are required"
            });
        }

        const updatedUser = await userModel.findByIdAndUpdate(
            req.user.id,
            { fullName, phone, address },
            { new: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        return res.status(200).json({
            message: "Profile updated successfully",
            data: updatedUser
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            error
        });
    }
};

const getAllUsersAdmin = async (req, res) => {
    try {
        const users = await userModel.find().select('-password').sort({ createdAt: -1 });

        return res.status(200).json({
            message: "Users fetched successfully",
            data: users
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            error
        });
    }
};

const updateUserRoleAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        if (!role || !['admin', 'customer'].includes(role)) {
            return res.status(400).json({
                message: "Role must be either admin or customer"
            });
        }

        const updatedUser = await userModel.findByIdAndUpdate(
            id,
            { role },
            { new: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        return res.status(200).json({
            message: "User role updated successfully",
            data: updatedUser
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            error
        });
    }
};

const updateUserAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const { fullName, phone, address } = req.body;

        const updatedUser = await userModel.findByIdAndUpdate(
            id,
            { fullName, phone, address },
            { new: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        return res.status(200).json({
            message: "User updated successfully",
            data: updatedUser
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            error
        });
    }
};

const deleteUserAdmin = async (req, res) => {
    try {
        const { id } = req.params;

        if (String(req.user.id) === String(id)) {
            return res.status(400).json({
                message: "You cannot delete your own account"
            });
        }

        const deletedUser = await userModel.findByIdAndDelete(id).select('-password');

        if (!deletedUser) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        return res.status(200).json({
            message: "User deleted successfully",
            data: deletedUser
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            error
        });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getProfile,
    updateMyProfile,
    getAllUsersAdmin,
    updateUserAdmin,
    updateUserRoleAdmin,
    deleteUserAdmin
}