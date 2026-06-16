const adminMiddleware = (req, res, next) => {
    const isReadRequest = ['GET', 'HEAD', 'OPTIONS'].includes(req.method);

    if (req.user && (req.user.role === "admin" || (isReadRequest && req.user.role === "employee"))) {
        next();
    } else {
        return res.status(403).json({
            message: "Access denied. Admins only for this action."
        });
    }
};

module.exports = adminMiddleware;
