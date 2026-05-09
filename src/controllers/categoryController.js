import { getAllCategories } from "../models/categoryModels.js";

export const fetchCategories = async (req, res) => {
    try {
        const categories = await getAllCategories();
        return res.status(200).json({
            message: "berhasil ambil data kategori",
            success: true,
            data: categories
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ 
            message: "Internal Server Error", 
            success: false 
        });
    }
};