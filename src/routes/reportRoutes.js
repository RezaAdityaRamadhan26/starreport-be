import express from 'express';
import { verifyToken } from '../middlewares/authMiddlewares.js';
import { upload } from '../middlewares/uploadMiddlewares.js';
import { 
    getReports, addReports, getDetailReport, changeStatus, 
    getMyReports, getDashboardStats 
} from '../controllers/reportController.js';import { checkRole } from '../middlewares/roleMiddlewares.js';

const reportRoute = express.Router();

reportRoute.use(verifyToken);

reportRoute.get('/', getReports);
reportRoute.get('/me', getMyReports); 
reportRoute.get('/stats', checkRole('admin', 'super_admin'), getDashboardStats);
reportRoute.post('/', upload.single('image'), addReports);

reportRoute.get('/:id', getDetailReport);
reportRoute.put('/:id/status', checkRole('admin', 'super_admin'), changeStatus);

export default reportRoute;