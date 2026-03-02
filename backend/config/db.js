const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);

        console.log(`MongoDB Connected`);
    } catch (error) {
        console.error(error);
    }
};

module.exports = connectDB;