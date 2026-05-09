import { 
    createReport, 
    getAllReports, 
    getReportById, 
    updateReportStatus,
    getReportStats, 
    getReportsByUserId,
} from "../models/reportModels.js";

export const getReports = async (req, res) => {
    try {
        const reports = await getAllReports();
        return res.status(201).json({
            message: 'data laporan berhasil diambil',
            success: true,
            data: reports
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "internal server error",
            success: false
        })
    }
};

export const addReports = async (req, res) => {
    const { header, body, category_id} = req.body;
    const userId = req.user.id;
    const image = req.file ? req.file.filename : null;

    if (!header || !body || !category_id) {
        return res.status(400).json({
            message: 'semua kategori wajib diisi',
            success: false
        })
    }

    try {
        const insertId = await createReport(header, body, userId, category_id, image);

        return res.status(201).json({
            message: 'laporan berhasil ditambahkan',
            success: true,
            data: {id: insertId, header, status: 'pending'}
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'internal server error',
            success: false
        });
    };
};

export const getDetailReport = async (req, res) => {
    try {
        const { id } = req.params;
        const report = await getReportById(id);

        if (!report) {
            return res.status(404).json({
                message: 'laporan tidak ditemukan',
                success: false
            })
        }

        return res.status(200).json({
            message: 'detail laporan',
            success: true,
            data: report
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'internal server error',
            success: false
        });
    }
};

export const changeStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const validStatus = ["pending", "approved", "rejected"];

    if (!validStatus.includes(status)) {
        return res.status(400).json({
            message: 'status tidak valid',
            success: false
        })
    }
    
    try {
        const result = await updateReportStatus(id, status);
        if (result === 0) {
            return res.status(404).json({
                message: 'laporan tidak ditemukan',
                success: false
            })
        };

        return res.status(200).json({
            message: `status laporan berhasil diubah jadi ${status}`,
            success: true,
            data: { id, status }
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'internal server error',
            success: false
        });
    }
};

export const getMyReports = async (req, res) => {
    const userId = req.user.id;

    try {
        const reports = await getReportsByUserId(userId);
        
        return res.status(200).json({
            message: 'berhasil ambil laporan',
            success: true,
            data: reports
        });
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'internal server error',
            success: false
        });
    }
};

export const getDashboardStats = async (req, res) => {
    try {
        const stats = await getReportStats();

        return res.status(200).json({
            message: 'statistik laporan berhasil diambil',
            success: true,
            data: stats
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'internal server error',
            success: false
        });
    }
};

