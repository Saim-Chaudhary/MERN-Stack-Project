const mongoose = require("mongoose");

let connected = false;

const connectDB = async () => {
    if (connected) {
        return;
    }

    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        connected = conn.connections[0].readyState === 1;
        console.log("MongoDB Connected");
    } catch (error) {
        console.error(error);
        throw error;
    }
};

module.exports = connectDB;