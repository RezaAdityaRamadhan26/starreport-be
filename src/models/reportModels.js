import db from "../config/db.js";

export const getAllReports = async () => {
    const query = `
        SELECT 
            pr.id,
            pr.header,
            pr.body,
            u.username AS author_name,
            c.category_name,
            pr.image,
            pr.status,
            pr.created_at,
            GetTotalComments(pr.id) AS total_comments
        FROM public_reports pr
        JOIN users u ON pr.user_id = u.id
        JOIN categories c ON pr.category_id = c.id
        ORDER BY pr.created_at DESC
    `;
    const [rows] = await db.query(query);
    return rows;
};

export const createReport = async (header, body, userId, categoryId, imagePath) => {
    const query = `
        INSERT INTO public_reports (header, body, user_id, category_id, image) 
        VALUES (?, ?, ?, ?, ?)
    `;
    const [result] = await db.query(query, [header, body, userId, categoryId, imagePath]);
    return result.insertId;
}

export const getReportById = async (id) => {
    const query = `
        SELECT 
            pr.id, pr.header, pr.body, u.username AS author_name, 
            c.category_name, pr.image, pr.status, pr.created_at
        FROM public_reports pr
        JOIN users u ON pr.user_id = u.id
        JOIN categories c ON pr.category_id = c.id
        WHERE pr.id = ?
    `;
    const [rows] = await db.query(query, [id]);
    return rows[0];
};

export const updateReportStatus = async (id, status) => {
    const query = `UPDATE public_reports SET status = ? WHERE id = ?`;
    const [result] = await db.query(query, [status, id]);
    return result.affectedRows; 
};

export const getReportsByUserId = async (userId) => {
    const query = `
        SELECT 
            pr.id, pr.header, pr.body, c.category_name, 
            pr.image, pr.status, pr.created_at
        FROM public_reports pr
        JOIN categories c ON pr.category_id = c.id
        WHERE pr.user_id = ?
        ORDER BY pr.created_at DESC
    `;
    const [rows] = await db.query(query, [userId]);
    return rows;
};

export const getReportStats = async () => {
        const query = `
        SELECT status, COUNT(*) as total
        FROM public_reports
        GROUP BY status
    `;
    const [rows] = await db.query(query);
    return rows;
};