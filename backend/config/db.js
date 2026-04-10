const mongoose = require("mongoose");

let isConnected = false;
let connectPromise = null;

mongoose.set("bufferCommands", false);

const connectDB = async () => {
    if (isConnected) return;
    if (connectPromise) return connectPromise;

    if (!process.env.MONGO_URI) {
        throw new Error("MONGO_URI is not set");
    }

    connectPromise = mongoose
        .connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 10000,
            connectTimeoutMS: 10000,
        })
        .then(() => {
            isConnected = true;
            console.log("MongoDB Connected");
        })
        .catch((error) => {
            connectPromise = null;
            throw error;
        });

    return connectPromise;
};

module.exports = connectDB;