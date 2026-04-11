const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if(!authHeader) {
            return res.status(401).json({
                message : "Unauthorized"
            });
        }

        const userToken = authHeader.split(" ")[1];
        
        if(!userToken){
            return res.status(401).json({
                message : "Unauthorized"
            });
        }

        const verifyToken = jwt.verify(userToken, process.env.JWT_SECRET);
        req.user = verifyToken;
        
        next();
    } 
    catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Session expired. Please login again." });
        }

        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({ message: "Invalid token. Please login again." });
        }

        return res.status(401).json({ message: "Unauthorized" });
    }
}

module.exports = authMiddleware;