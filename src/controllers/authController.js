import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { findUserByUsername, createUser } from "../models/userModels.js";

export const register = async (req, res) => {
    const { username, password, role } = req.body;
    
    if (!username || !password ) {
        return res.status(400).json({
            message: 'username dan password harus diisi',
            success: false
        });
    }

    try {
        const existingUser = await findUserByUsername(username);
        if (existingUser) {
            return res.status(400).json({
                message: "username sudah ada",
                success: false
            })
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const insertId = await createUser(username, hashedPassword, role);

        return res.status(201).json({
            message: 'registrasi berhasil',
            success: true,
            data: { id: insertId, username, role: role || "user" }
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        })
    }
};

export const login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            message: 'username dan password harus diisi',
            success: false
        });
    }

    try {
        const user = await findUserByUsername(username);
        if (!user) {
            return res.status(401).json({
                message: 'Username atau Password Salah',
                success: false
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                message: 'username atau password salah',
                success: false
            })
        }

        const token = jwt.sign(
            {id: user.id, username: user.username, role: user.role},
            process.env.JWT_SECRET,
            {expiresIn: '1h'}
        );

        return res.json({
            message: 'login berhasil',
            success: true,
            token,
            user: { id: user.id, username: user.username, role: user.role}
        })

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        })
    }
}

