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

module.exports = {
    registerUser,
    loginUser
}