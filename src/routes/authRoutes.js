import express from 'express';
import { register, login, changePassword, forgotPassword, resetPassword } from '../controllers/authController.js';
import { verifyToken } from '../middlewares/authMiddlewares.js';

const authRouter = express.Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.put('/password', verifyToken, changePassword);

authRouter.post('/forgot-password', forgotPassword);
authRouter.post('/reset-password/:id/:token', resetPassword);

export default authRouter;