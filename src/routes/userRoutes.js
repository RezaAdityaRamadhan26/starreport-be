import express from 'express';
import { verifyToken } from '../middlewares/authMiddlewares.js';
import { checkRole } from '../middlewares/roleMiddlewares.js';
import { fetchUsers, fetchUserDetail, changeUserRole, removeUser } from '../controllers/userController.js';

const userRoute = express.Router();

userRoute.use(verifyToken);
userRoute.use(checkRole('super_admin'));

userRoute.get('/', fetchUsers); // liat semua user
userRoute.get('/:id', fetchUserDetail); // liat 1 by id
userRoute.put('/:id/role', changeUserRole); // ubah role
userRoute.delete('/:id', removeUser); // hapus user

export default userRoute;