import db from "../config/db.js";

export const getAllCategories = async () => {
    const query = `SELECT id, category_name FROM categories ORDER BY id ASC`;
    const [rows] = await db.query(query);
    return rows;
};