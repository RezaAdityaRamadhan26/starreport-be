import express from 'express';
import { register, login, changePassword } from '../controllers/authController.js';
import { verifyToken } from '../middlewares/authMiddlewares.js';

const authRouter = express.Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.put('/password', verifyToken, changePassword);

export default authRouter;