import express from 'express';
import { fetchCategories } from '../controllers/categoryController.js';

const categoryRoute = express.Router();

categoryRoute.get('/', fetchCategories);

export default categoryRoute;