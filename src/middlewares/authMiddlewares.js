import jwt from "jsonwebtoken";
import configDotenv from "dotenv";

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            message: 'akses ditolak, token tidak ditemukan',
            success: false
        });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({
                message: 'token tidak valid atau kedaluwarsa',
                success: false
            })
        }
        req.user = user;
        
        next();
    });
};