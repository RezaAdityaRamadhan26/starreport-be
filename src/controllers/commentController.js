import {
    getCommentsByReportId,
    createComment,
    getCommentById,
    updateComment,
    deleteComment
} from "../models/commentModels.js";

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

export const editComments = async (req, res) => {
    const { id } = req.params;
    const { body } = req.body;
    const userId = req.user.id;

    if (!body) {
        return res.status(400).json({
            message: 'isi komennya terlebih dahulu',
            success: false
        })
    }

    try {
        const comment = await getCommentById(id);
        if (!comment) {
            return res.status(404).json({
                message: 'komen tidak ditemukan',
                success: false
            })
        };
        if (comment.user_id !== userId) {
            return res.status(403).json({
                message: 'bukan komen milikmu',
                success: false
            })
        }

        await updateComment(id, body);
        return res.status(200).json({
            message: 'komen berhasil diupdate',
            success: true,
            data: {id, body}
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Internal Server Error',
            success: false
        });
    }
};

export const removeComment = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    try {
        const comment = await getCommentById(id);

        if (!comment) {
            return res.status(404).json({
                message: 'komen tidak ditemukan',
                success: false
            })
        };

        if (userRole === 'user' && comment.user_id !== userId) {
            return res.status(403).json({
                message: 'bukan komen milikmu',
                success: false
            });
        }
        
        await deleteComment(id);
        
        return res.status(200).json({
            message: 'komen berhasil dihapus',
            success: true,
            data: {} 
        });
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'internal server error',
            success: false
        });
    }
}