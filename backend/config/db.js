const mongoose = require("mongoose");

const connectDB = async () => {
    if (mongoose.connection.readyState === 1) {
        return;
    }

    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connected");
    } catch (error) {
        console.error(error);
        throw error;
    }
};

module.exports = connectDB;