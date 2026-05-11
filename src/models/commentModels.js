import db from "../config/db.js";

export const getCommentsByReportId = async (reportId) => {
    const query = `
        SELECT 
            c.id, 
            c.body, 
            c.created_at, 
            u.username AS author,
            u.role
        FROM comments c
        JOIN users u ON c.user_id = u.id
        WHERE c.public_report_id = ?
        ORDER BY c.created_at ASC
    `;
    const [rows] = await db.query(query, [reportId]);
    return rows;
};

export const createComment = async (reportId, userId, commentBody) => {
    const query = `
        INSERT INTO comments (public_report_id, user_id, body)
        VALUES (?, ?, ?)
    `;
    const [result] = await db.query(query, [reportId, userId, commentBody]);
    return result.insertId;
};

export const getCommentById = async (id) => {
    const query = `SELECT * FROM comments WHERE id = ?`;
    const [rows] = await db.query(query, [id]);
    return rows[0];
};

export const updateComment = async (id, body) => {
    const query = `UPDATE comments SET body = ? WHERE id = ?`;
    const [result] = await db.query(query, [body, id]);
    return result.affectedRows;
};

export const deleteComment = async (id) => {
    const query = `DELETE FROM comments WHERE id = ?`;
    const [result] = await db.query(query, [id]);
    return result.affectedRows;
};