export const checkRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(401).json({
                message: "akses ditolak, role tidak diizinkan",
                success: false
            });
        }
        next();
    };
};