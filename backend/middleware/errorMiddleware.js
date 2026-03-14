// This is a global error handler
// It catches any error that was not handled inside a try/catch block
// It must have 4 parameters (err, req, res, next) - Express knows it's an error handler because of this

const errorMiddleware = (err, req, res, next) => {
    console.log(err.stack);

    // Handle invalid MongoDB ID format error (e.g. /api/packages/notanid)
    if (err.name === "CastError") {
        return res.status(400).json({
            message: "Invalid ID format"
        });
    }

    // Handle MongoDB duplicate key error (e.g. registering with an email that already exists)
    if (err.code === 11000) {
        return res.status(400).json({
            message: "This value already exists. Please use a different one."
        });
    }

    // Handle Mongoose validation errors (e.g. required field missing)
    if (err.name === "ValidationError") {
        return res.status(400).json({
            message: err.message
        });
    }

    // Handle JWT errors
    if (err.name === "JsonWebTokenError") {
        return res.status(401).json({
            message: "Invalid token"
        });
    }

    // Handle expired JWT
    if (err.name === "TokenExpiredError") {
        return res.status(401).json({
            message: "Token has expired. Please login again."
        });
    }

    // For everything else, send a generic 500 error
    return res.status(500).json({
        message: "Something went wrong on the server",
        error: err.message
    });
};

module.exports = errorMiddleware;
