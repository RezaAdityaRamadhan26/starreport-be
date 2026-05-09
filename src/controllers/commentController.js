import { getCommentsByReportId, createComment } from "../models/commentModels.js";

export const fetchComments = async (req, res) => {
    const { reportId } = req.params;        

    try {
        const comments = await getCommentsByReportId(reportId);
        return res.status(200).json({
            message: 'komentar berhasil diambil',
            success: true,
            data: comments
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'internal server error',
            success: false
        })
    }
};

export const addComment = async (req, res) => {
    const { body, report_id } = req.body;
    const user_id = req.user.id;

    if (!body || !report_id) {
        return res.status(400).json({
            message: 'body dan report id harus diisi',
            success: false
        })
    };

    try {
        const insertId = await createComment(report_id, user_id, body);
        
        return res.status(201).json({
            message: 'komentar berhasil ditambahkan',
            success: true,
            data: {id: insertId, body, user_id}
        });

    } catch (error) {
        if (error.sqlState === '45000') {
            return res.status(400).json({ 
                message: error.message, 
                success: false 
            });
        }
        
        console.error(error);
        return res.status(500).json({ 
            message: 'internal server error', 
            success: false 
        });
    }
};