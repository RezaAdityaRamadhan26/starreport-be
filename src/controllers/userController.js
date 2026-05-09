import { getAllUsers, getUserById, updateUserRole, deleteUserById } from "../models/userModels.js";

export const fetchUsers = async (req, res) => {
    try {
        const users = await getAllUsers();
        res.json({
            success: true,
            message: "daftar user berhasil diambil",
            data: users
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "internal server error",
            success: false
        })
    }
};

export const fetchUserDetail = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await getUserById(id);
        if (!user) {
            return res.status(404).json({
                message: "user tidak ditemukan",
                success: false
            });
        }
        res.json({
            success: true,
            message: "detail user berhasil diambil",
            data: user
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "internal server error",
            success: false
        })
    }
};

export const changeUserRole = async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;
    
    const validRoles = ["user", "admin", "super_admin"];

    if (!validRoles.includes(role)) {
        return res.status(400).json({
            message: 'role tidak valid',
            success: false
        })
    };

    try {
        const affectedRows = await updateUserRole(id, role);
        if (affectedRows === 0) {
            return res.status(400).json({
                message: 'user tidak ditemukan',
                success: false
            })
        }

        return res.status(200).json({
            message: `role berhasil diupdate jadi ${role}`,
            success: true
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "internal server error",
            success: false
        })
    }
};

export const removeUser = async (req, res) => {
    const { id } = req.params;

    try {
        const affectedRows = await deleteUserById(id);
        if (affectedRows === 0) {
            return res.status(404).json({
                message: "user tidak ditemukan",
                success: false
            })
        }

        return res.status(200).json({
            message: 'user berhasil dihapus',
            success: true
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "internal server error",
            success: false
        })
    }
};