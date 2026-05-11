import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { findUserByUsername, createUser, getUserPasswordById, updateUserPassword, getUserById } from "../models/userModels.js";

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
};

export const changePassword = async (req, res) => {
    const userId = req.user.id; 
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
        return res.status(400).json({
            message: 'password lama dan baru wajib diisi', 
            success: false 
        });
    }

    try {
        const user = await getUserPasswordById(userId);
        const isMatch = await bcrypt.compare(oldPassword, user.password);

        if (!isMatch) {
            return res.status(400).json({
                message: 'password lama salah', 
                success: false 
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedNewPassword = await bcrypt.hash(newPassword, salt);

        await updateUserPassword(userId, hashedNewPassword);

        return res.status(200).json({
            message: 'password berhasil diubah', 
            success: true 
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "internal server error", 
            success: false 
        });
    }
};

export const forgotPassword = async (req, res) => {
    const { username } = req.body;

    if (!username) {
        return res.status(400).json({
            message: 'username wajib diisi',
            success: false
        })
    };

    try {
        const user = await findUserByUsername(username);
        if (!user) {
            return res.status(400).json({
                message: 'username tidak ditemukan',
                success: false
            })
        };

        const secret = process.env.JWT_SECRET + user.password;
        const link = `http://localhost:3000/reset-password/${user.id}/${token}`;

        return res.status(200).json({
            message: 'link reset password berhasil dikirim, check email anda',
            success: true,
            data: {
                reset_link: link,
                token: token,
                id: user.id
            }
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        })
    }
};

export const resetPassword = async (req, res) => {
    const { id, token } = req.params;
    const { newPassword } = req.body;

    if (!newPassword) {
        return res.status(400).json({
            message: 'password baru wajib diisi',
            success: false
        })
    };

    try {
        const user = await getUserById(id);
        const userPass = await getUserPasswordById(id);

        if (!user || !userPass) {
            return res.status(404).json({
                message: 'user tidak ditemukan',
                success: false
            })
        };

        const secret = process.env.JWT_SECRET + userPass.password;

        try {
            jwt.verify(token, secret);
        } catch (error) {
            return res.status(400).json({
                message: 'token tidak valid atau kedaluwarsa',
                success: false
            })
        };

        const salt = await bcrypt.genSalt(10);
        const newHashedPassword = await bcrypt.hash(newPassword, salt);

        await updateUserPassword(id, newHashedPassword);

        return res.status(200).json({
            message: 'password berhasil di reset',
            success: true,
            data: {
                newPassword: newHashedPassword,
                user: user
            }
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        })
    }
};